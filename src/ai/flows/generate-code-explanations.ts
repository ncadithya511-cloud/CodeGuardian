'use server';

/**
 * @fileOverview A code explanation AI agent using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeExplanationsInputSchema = z.object({
  code: z.string(),
  analysis: z.string(),
});
export type GenerateCodeExplanationsInput = z.infer<typeof GenerateCodeExplanationsInputSchema>;

const GenerateCodeExplanationsOutputSchema = z.object({
  explanation: z.string(),
});
export type GenerateCodeExplanationsOutput = z.infer<typeof GenerateCodeExplanationsOutputSchema>;

export async function generateCodeExplanations(input: GenerateCodeExplanationsInput): Promise<GenerateCodeExplanationsOutput> {
  return generateCodeExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeExplanationsPrompt',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: GenerateCodeExplanationsInputSchema},
  output: {schema: GenerateCodeExplanationsOutputSchema},
  prompt: `Explain the refactoring suggestions for this code in a way that is easy for developers to understand.

  Code:
  {{code}}

  Analysis:
  {{analysis}}
  `,
});

const generateCodeExplanationsFlow = ai.defineFlow(
  {
    name: 'generateCodeExplanationsFlow',
    inputSchema: GenerateCodeExplanationsInputSchema,
    outputSchema: GenerateCodeExplanationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI failed to generate an explanation.");
    return output;
  }
);
