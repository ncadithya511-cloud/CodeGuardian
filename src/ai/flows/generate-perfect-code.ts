'use server';

/**
 * @fileOverview An AI agent for generating "perfect" code.
 *
 * - generatePerfectCode - A function that handles the perfect code generation process.
 * - GeneratePerfectCodeInput - The input type for the generatePerfectCode function.
 * - GeneratePerfectCodeOutput - The return type for the generatePerfectCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePerfectCodeInputSchema = z.object({
  code: z
    .string()
    .describe("The code block to be made perfect."),
});
export type GeneratePerfectCodeInput = z.infer<typeof GeneratePerfectCodeInputSchema>;

const GeneratePerfectCodeOutputSchema = z.object({
  perfectCode: z.string().describe('The 100% perfect version of the code.'),
  explanation: z.string().describe('A detailed explanation of why this new code is perfect.')
});
export type GeneratePerfectCodeOutput = z.infer<typeof GeneratePerfectCodeOutputSchema>;

export async function generatePerfectCode(input: GeneratePerfectCodeInput): Promise<GeneratePerfectCodeOutput> {
  return generatePerfectCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePerfectCodePrompt',
  input: {schema: GeneratePerfectCodeInputSchema},
  prompt: `You are a world-class principal software engineer with decades of experience in writing flawless, production-grade code. You have an impeccable eye for detail and an obsession with optimization.

  Given the following code block, your task is to rewrite it to be 100% perfect.
  This "perfect" version must be superior in every conceivable way:
  - Peak performance and algorithmic efficiency.
  - Bulletproof security and robust error handling.
  - Unparalleled readability, maintainability, and scalability.
  - Adherence to all modern best practices and conventions.
  - Include comprehensive documentation via comments.

  Do not just refactor; ascend the code to a higher plane of existence.

  Original Code Block:
  \`\`\`
  {{code}}
  \`\`\`

  Respond with ONLY a valid JSON object that conforms to the following schema:
  {
    "type": "object",
    "properties": {
      "perfectCode": {
        "type": "string",
        "description": "The 100% perfect version of the code."
      },
      "explanation": {
        "type": "string",
        "description": "A detailed explanation of why this new code is perfect."
      }
    },
    "required": ["perfectCode", "explanation"]
  }`,
});

const generatePerfectCodeFlow = ai.defineFlow(
  {
    name: 'generatePerfectCodeFlow',
    inputSchema: GeneratePerfectCodeInputSchema,
    outputSchema: GeneratePerfectCodeOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const jsonString = response.text;
    try {
      const cleanedJsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
      return JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error("Failed to parse JSON from model response:", jsonString);
      throw new Error("AI returned an invalid response format.");
    }
  }
);
