'use server';

/**
 * @fileOverview An AI agent for refactoring code using Gemini 1.5 Flash.
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
  const { text } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `You are an expert software engineer specializing in code refactoring.
    Given a code block and an analysis of its issues, refactor the code to address the problems.

    IMPORTANT: Your response must be a single, valid JSON object matching this structure:
    {
      "refactoredCode": "string",
      "explanation": "string"
    }

    Original Code:
    ${input.code}

    Analysis:
    ${input.analysis}`,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return RefactorCodeOutputSchema.parse(parsed);
  } catch (e) {
    throw new Error("AI failed to refactor the code.");
  }
}
