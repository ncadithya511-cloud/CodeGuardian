
'use server';

/**
 * @fileOverview An AI agent for refactoring code using OpenAI GPT-4o.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RefactorCodeInputSchema = z.object({
  code: z.string(),
  analysis: z.string(),
});
export type RefactorCodeInput = z.infer<typeof RefactorCodeInputSchema>;

const RefactorCodeOutputSchema = z.object({
  refactoredCode: z.string(),
  explanation: z.string()
});
export type RefactorCodeOutput = z.infer<typeof RefactorCodeOutputSchema>;

export async function refactorCode(input: RefactorCodeInput): Promise<RefactorCodeOutput> {
  const { output } = await ai.generate({
    model: 'openai/gpt-4o',
    input: input,
    prompt: `You are an expert software engineer specializing in code refactoring.
    Given a code block and an analysis of its issues, refactor the code to address the problems.

    Original Code:
    {{{code}}}

    Analysis:
    {{{analysis}}}`,
    output: { schema: RefactorCodeOutputSchema }
  });

  if (!output) throw new Error("AI failed to refactor the code.");
  return output;
}
