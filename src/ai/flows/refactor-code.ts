'use server';

/**
 * @fileOverview An AI agent for refactoring code using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefactorCodeInputSchema = z.object({
  code: z
    .string()
    .describe("The code block to be refactored."),
  analysis: z
    .string()
    .describe('The analysis of the code block, including the issues to be fixed in JSON format.'),
});
export type RefactorCodeInput = z.infer<typeof RefactorCodeInputSchema>;

const RefactorCodeOutputSchema = z.object({
  refactoredCode: z.string().describe('The refactored code block.'),
  explanation: z.string().describe('A brief explanation of the changes made during refactoring.')
});
export type RefactorCodeOutput = z.infer<typeof RefactorCodeOutputSchema>;

export async function refactorCode(input: RefactorCodeInput): Promise<RefactorCodeOutput> {
  return refactorCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refactorCodePrompt',
  model: 'googleai/gemini-1.5-pro', // HARDCODED
  input: {schema: RefactorCodeInputSchema},
  prompt: `You are an expert software engineer specializing in code refactoring and optimization.
  Given a code block and an analysis of its issues, your task is to refactor the code to address the identified problems.
  The refactored code should be functionally equivalent to the original but improved in terms of performance, readability, and maintainability.

  Respond with ONLY a valid JSON object matching this schema:
  {
    "refactoredCode": "string",
    "explanation": "string"
  }
  Do not include markdown code blocks or any other text.

  Original Code Block:
  '''
  {{code}}
  '''

  Analysis of Issues (in JSON format):
  {{analysis}}`,
});

const refactorCodeFlow = ai.defineFlow(
  {
    name: 'refactorCodeFlow',
    inputSchema: RefactorCodeInputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as RefactorCodeOutput;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", text);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
  }
);
