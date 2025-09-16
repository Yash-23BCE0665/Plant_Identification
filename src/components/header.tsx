import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="py-4 border-b bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Leaf className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground font-headline tracking-tight">
          PlantDetectAI
        </h1>
      </div>
    </header>
  );
}
