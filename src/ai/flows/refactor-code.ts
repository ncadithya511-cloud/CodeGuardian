'use server';

/**
 * @fileOverview An AI agent for refactoring code.
 *
 * - refactorCode - A function that handles the code refactoring process.
 * - RefactorCodeInput - The input type for the refactorCode function.
 * - RefactorCodeOutput - The return type for the refactorCode function.
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
  input: {schema: RefactorCodeInputSchema},
  output: {schema: RefactorCodeOutputSchema},
  prompt: `You are an expert software engineer specializing in code refactoring and optimization.
  Given a code block and an analysis of its issues, your task is to refactor the code to address the identified problems.
  The refactored code should be functionally equivalent to the original but improved in terms of performance, readability, and maintainability.

  Respond with ONLY a valid JSON object that conforms to the output schema.
  Do not include any other text or markdown formatting.

  Original Code Block:
  \'\'\'
  {{code}}
  \'\'\'

  Analysis of Issues (in JSON format):
  {{analysis}}
  `,
});

const refactorCodeFlow = ai.defineFlow(
  {
    name: 'refactorCodeFlow',
    inputSchema: RefactorCodeInputSchema,
    outputSchema: RefactorCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI returned an invalid response. Please try again.");
    }
    return output;
  }
);
