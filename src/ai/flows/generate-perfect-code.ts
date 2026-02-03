'use server';

/**
 * @fileOverview An AI agent for generating flawless code using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePerfectCodeInputSchema = z.object({
  code: z.string(),
});
export type GeneratePerfectCodeInput = z.infer<typeof GeneratePerfectCodeInputSchema>;

const GeneratePerfectCodeOutputSchema = z.object({
  perfectCode: z.string(),
  explanation: z.string(),
});
export type GeneratePerfectCodeOutput = z.infer<typeof GeneratePerfectCodeOutputSchema>;

export async function generatePerfectCode(input: GeneratePerfectCodeInput): Promise<GeneratePerfectCodeOutput> {
  return generatePerfectCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePerfectCodePrompt',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: GeneratePerfectCodeInputSchema},
  output: {schema: GeneratePerfectCodeOutputSchema},
  prompt: `Rewrite this code to be 100% perfect, optimized, secure, and clean.

  Original Code:
  '''
  {{code}}
  '''
  `,
});

const generatePerfectCodeFlow = ai.defineFlow(
  {
    name: 'generatePerfectCodeFlow',
    inputSchema: GeneratePerfectCodeInputSchema,
    outputSchema: GeneratePerfectCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI failed to generate perfect code.");
    return output;
  }
);
