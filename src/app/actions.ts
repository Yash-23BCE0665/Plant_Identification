"use server";

import { identifyPlantSpecies as identifyPlantSpeciesFlow } from "@/ai/flows/identify-plant-species";
import type { IdentifyPlantSpeciesOutput } from "@/ai/flows/identify-plant-species";

export async function identifyPlant(
  prevState: any,
  formData: FormData
): Promise<{ result: IdentifyPlantSpeciesOutput | null; error: string | null }> {
  const imageDataUri = formData.get("imageDataUri") as string;

  if (!imageDataUri) {
    return { result: null, error: "Image data is required." };
  }

  try {
    const result = await identifyPlantSpeciesFlow({ photoDataUri: imageDataUri });
    return { result, error: null };
  } catch (e) {
    console.error(e);
    // Provide a user-friendly error message
    return {
      result: null,
      error: "Failed to identify the plant. The AI model might be unavailable. Please try again later.",
    };
  }
}
