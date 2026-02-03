
'use server';

/**
 * @fileOverview An AI agent for generating flawless code using OpenAI GPT-4o.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  const { output } = await ai.generate({
    model: 'openai/gpt-4o',
    input: input,
    prompt: `Rewrite the following code to be 100% perfect, optimized, secure, and clean.

    Original Code:
    {{{code}}}`,
    output: { schema: GeneratePerfectCodeOutputSchema }
  });

  if (!output) throw new Error("AI failed to generate perfect code.");
  return output;
}
