
'use server';

/**
 * @fileOverview A code explanation AI agent using OpenAI GPT-4o.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  const { output } = await ai.generate({
    model: 'openai/gpt-4o',
    input: input,
    prompt: `Explain the refactoring suggestions for this code based on the provided analysis.

    Code:
    {{{code}}}

    Analysis:
    {{{analysis}}}`,
    output: { schema: GenerateCodeExplanationsOutputSchema }
  });

  if (!output) throw new Error("AI failed to generate code explanations.");
  return output;
}
