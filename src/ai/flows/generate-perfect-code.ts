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
  model: 'googleai/gemini-pro',
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

  Respond with ONLY a valid JSON object that conforms to the following Zod schema:
  \`\`\`
  z.object({
    perfectCode: z.string().describe('The 100% perfect version of the code.'),
    explanation: z.string().describe('A detailed explanation of why this new code is perfect.')
  })
  \`\`\`

  Do not include any other text or markdown formatting.

  Original Code Block:
  \`\`\`
  {{code}}
  \`\`\`
  `,
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
      // The model might return the JSON string wrapped in markdown
      const cleanedJsonString = jsonString.replace(/^```json\n|```$/g, '');
      const parsed = JSON.parse(cleanedJsonString);
      return GeneratePerfectCodeOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse JSON response from AI:", jsonString);
      throw new Error("The AI returned an invalid response. Please try again.");
    }
  }
);
