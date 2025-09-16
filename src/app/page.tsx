import { Header } from "@/components/header";
import { PlantIdentifier } from "@/components/plant-identifier";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <PlantIdentifier />
        </div>
      </main>
    </div>
  );
}
