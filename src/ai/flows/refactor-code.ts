'use server';

/**
 * @fileOverview An AI agent for refactoring code using hardcoded gemini-pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    model: 'googleai/gemini-pro',
    prompt: `You are an expert software engineer specializing in code refactoring and optimization.
    Given a code block and an analysis of its issues, refactor the code to address the problems.

    Original Code Block:
    '''
    ${input.code}
    '''

    Analysis:
    ${input.analysis}

    Respond with ONLY a valid JSON object matching this schema:
    {
      "refactoredCode": "string",
      "explanation": "string"
    }
    Do not include markdown code blocks or any other text.`,
  });

  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as RefactorCodeOutput;
  } catch (e) {
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
