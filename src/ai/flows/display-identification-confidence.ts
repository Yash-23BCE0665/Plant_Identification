'use server';

/**
 * @fileOverview A flow to display the confidence level of plant identification.
 *
 * - displayIdentificationConfidence - A function that returns the confidence level of plant identification.
 * - DisplayIdentificationConfidenceInput - The input type for the displayIdentificationConfidence function.
 * - DisplayIdentificationConfidenceOutput - The return type for the displayIdentificationConfidence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayIdentificationConfidenceInputSchema = z.object({
  identificationResult: z
    .string()
    .describe("The plant identification result from the MobileNetV2 model."),
});
export type DisplayIdentificationConfidenceInput = z.infer<
  typeof DisplayIdentificationConfidenceInputSchema
>;

const DisplayIdentificationConfidenceOutputSchema = z.object({
  confidenceLevel: z
    .number()
    .describe("The confidence level of the plant identification (0-1)."),
  explanation: z.string().describe('Explanation of the confidence level.'),
});
export type DisplayIdentificationConfidenceOutput = z.infer<
  typeof DisplayIdentificationConfidenceOutputSchema
>;

export async function displayIdentificationConfidence(
  input: DisplayIdentificationConfidenceInput
): Promise<DisplayIdentificationConfidenceOutput> {
  return displayIdentificationConfidenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displayIdentificationConfidencePrompt',
  input: {schema: DisplayIdentificationConfidenceInputSchema},
  output: {schema: DisplayIdentificationConfidenceOutputSchema},
  prompt: `You are an AI expert in assessing the confidence of plant identifications.
  You are given the plant identification result from a MobileNetV2 model:
  {{identificationResult}}

  Determine the confidence level (between 0 and 1) of the plant identification.
  Also, provide a brief explanation for the confidence level.
  Consider that this information will be displayed to a farmer who may not know anything about AI.

  Return the confidenceLevel as a number between 0 and 1.
  Return a short, concise explanation of the confidenceLevel in terms that a farmer can easily understand.
  `,
});

const displayIdentificationConfidenceFlow = ai.defineFlow(
  {
    name: 'displayIdentificationConfidenceFlow',
    inputSchema: DisplayIdentificationConfidenceInputSchema,
    outputSchema: DisplayIdentificationConfidenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
