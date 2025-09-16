'use server';

/**
 * @fileOverview Suggests alternative plant species if the confidence level of the plant identification is low.
 *
 * - suggestAlternativePlantSpecies - A function that suggests alternative plant species based on the identified plant and confidence level.
 * - SuggestAlternativePlantSpeciesInput - The input type for the suggestAlternativePlantSpecies function.
 * - SuggestAlternativePlantSpeciesOutput - The return type for the suggestAlternativePlantSpecies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativePlantSpeciesInputSchema = z.object({
  identifiedPlant: z.string().describe('The identified plant species.'),
  confidenceLevel: z.number().describe('The confidence level of the plant identification (0-1).'),
});
export type SuggestAlternativePlantSpeciesInput = z.infer<
  typeof SuggestAlternativePlantSpeciesInputSchema
>;

const SuggestAlternativePlantSpeciesOutputSchema = z.object({
  alternativePlantSuggestions: z
    .array(z.string())
    .describe('A list of alternative plant species suggestions.'),
});
export type SuggestAlternativePlantSpeciesOutput = z.infer<
  typeof SuggestAlternativePlantSpeciesOutputSchema
>;

export async function suggestAlternativePlantSpecies(
  input: SuggestAlternativePlantSpeciesInput
): Promise<SuggestAlternativePlantSpeciesOutput> {
  return suggestAlternativePlantSpeciesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativePlantSpeciesPrompt',
  input: {schema: SuggestAlternativePlantSpeciesInputSchema},
  output: {schema: SuggestAlternativePlantSpeciesOutputSchema},
  prompt: `You are a helpful AI assistant that suggests alternative plant species based on the identified plant and confidence level.

  Given the identified plant: {{{identifiedPlant}}} and its confidence level: {{{confidenceLevel}}},
  suggest alternative plant species. Only return an array of plant species names, without any additional text. Limit suggestions to 3 species.`,
});

const suggestAlternativePlantSpeciesFlow = ai.defineFlow(
  {
    name: 'suggestAlternativePlantSpeciesFlow',
    inputSchema: SuggestAlternativePlantSpeciesInputSchema,
    outputSchema: SuggestAlternativePlantSpeciesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
