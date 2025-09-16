'use server';

/**
 * @fileOverview This file defines a Genkit flow to identify plant species from an image.
 *
 * It includes: IdentifyPlantSpeciesInput, IdentifyPlantSpeciesOutput, identifyPlantSpecies function and the flow itself.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPlantSpeciesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type IdentifyPlantSpeciesInput = z.infer<typeof IdentifyPlantSpeciesInputSchema>;

const IdentifyPlantSpeciesOutputSchema = z.object({
  scientificName: z.string().describe('The identified plant species scientific name.'),
  commonName: z.string().describe('The common name of the plant.'),
  description: z.string().describe('A short description of the plant.'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
  alternativeSuggestions: z.array(z.string()).describe('Alternative plant species suggestions if confidence is low.'),
});
export type IdentifyPlantSpeciesOutput = z.infer<typeof IdentifyPlantSpeciesOutputSchema>;

export async function identifyPlantSpecies(input: IdentifyPlantSpeciesInput): Promise<IdentifyPlantSpeciesOutput> {
  return identifyPlantSpeciesFlow(input);
}

const identifyPlantSpeciesPrompt = ai.definePrompt({
  name: 'identifyPlantSpeciesPrompt',
  input: {schema: IdentifyPlantSpeciesInputSchema},
  output: {schema: IdentifyPlantSpeciesOutputSchema},
  prompt: `You are an expert botanist. You will identify the species of a plant from a photo.

  Analyze the following photo and identify the plant species. Provide its scientific name, common name, and a brief description. Also, provide a confidence level (0-1) for your identification.
  If the confidence level is low (less than 0.6), suggest alternative plant species.

  Photo: {{media url=photoDataUri}}
  Output in JSON format.
  `,
});

const identifyPlantSpeciesFlow = ai.defineFlow(
  {
    name: 'identifyPlantSpeciesFlow',
    inputSchema: IdentifyPlantSpeciesInputSchema,
    outputSchema: IdentifyPlantSpeciesOutputSchema,
  },
  async input => {
    const {output} = await identifyPlantSpeciesPrompt(input);
    return output!;
  }
);
