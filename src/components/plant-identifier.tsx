"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Bot, ImageIcon, Loader, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { identifyPlant } from "@/app/actions";
import { IdentificationResult } from "./identification-result";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  result: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Identifying...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Identify Plant
        </>
      )}
    </Button>
  );
}

export function PlantIdentifier() {
  const [state, formAction, isPending] = useActionState(identifyPlant, initialState);
  const { toast } = useToast();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Identification Failed",
        description: state.error,
      });
      setShowResult(false);
    }
    if (state.result) {
      setShowResult(true);
    }
  }, [state, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select an image file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(URL.createObjectURL(file));
        setImageDataUri(reader.result as string);
        setShowResult(false); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageDataUri("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowResult(false);
  };
  
  const handleReset = () => {
    handleClearImage();
  };

  const isIdentifying = isPending;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <form action={formAction}>
          <input type="hidden" name="imageDataUri" value={imageDataUri} />
          <Card
            className={cn(
              "transition-all duration-300",
              imagePreview ? "aspect-auto" : "aspect-video"
            )}
          >
            <CardContent className="p-4 h-full">
              {!imagePreview ? (
                <label
                  htmlFor="plant-image-upload"
                  className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                >
                  <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-semibold">
                    Click to upload a plant image
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    PNG, JPG, or WEBP
                  </p>
                  <input
                    id="plant-image-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative group w-full h-full rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Plant preview"
                    fill
                    className="object-contain"
                  />
                   {!isIdentifying && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleClearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                   )}
                </div>
              )}
            </CardContent>
          </Card>
          {imagePreview && !showResult && (
            <div className="flex justify-center">
              <SubmitButton />
            </div>
          )}
        </form>
      </div>
      <div className="mt-8 md:mt-0">
        {showResult && state.result ? (
          <IdentificationResult result={state.result} onReset={handleReset} />
        ) : (
          <Card className="flex flex-col items-center justify-center aspect-video bg-muted/50 border-dashed">
            <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              Awaiting Identification
            </h3>
            <p className="text-sm text-muted-foreground/80 text-center max-w-xs">
              Upload an image and click 'Identify Plant' to see the results here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
