"use client";

import type { IdentifyPlantSpeciesOutput } from "@/ai/flows/identify-plant-species";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, List } from "lucide-react";

type IdentificationResultProps = {
  result: IdentifyPlantSpeciesOutput;
};

export function IdentificationResult({ result }: IdentificationResultProps) {
  const confidencePercent = Math.round(result.confidence * 100);

  const getConfidenceColor = () => {
    if (confidencePercent > 70) return "bg-green-500";
    if (confidencePercent > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline tracking-tight">
            {result.species}
          </CardTitle>
          <CardDescription>Primary Identification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Confidence Level
              </h4>
              <span
                className={cn(
                  "font-bold text-lg",
                  confidencePercent > 70
                    ? "text-green-600 dark:text-green-400"
                    : confidencePercent > 40
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {confidencePercent}%
              </span>
            </div>
            <Progress value={confidencePercent} />
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-accent" />
              Species Information
            </h4>
            <p className="text-sm text-foreground/80">
              Detailed information about {result.species} will be available in a
              future update.
            </p>
          </div>
        </CardContent>
      </Card>

      {result.alternativeSuggestions &&
        result.alternativeSuggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <List className="h-5 w-5 mr-3 text-primary" />
                Alternative Suggestions
              </CardTitle>
              <CardDescription>
                If the confidence is low, consider these possibilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.alternativeSuggestions.map((suggestion, index) => (
                  <Badge key={index} variant="secondary" className="text-base">
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
