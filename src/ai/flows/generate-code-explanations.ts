'use server';

/**
 * @fileOverview A code explanation AI agent.
 *
 * - generateCodeExplanations - A function that handles the code explanation process.
 * - GenerateCodeExplanationsInput - The input type for the generateCodeExplanations function.
 * - GenerateCodeExplanationsOutput - The return type for the generateCodeExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeExplanationsInputSchema = z.object({
  code: z
    .string()
    .describe("The code block to be explained."),
  analysis: z
    .string()
    .describe('The analysis of the code block, including potential issues.'),
});
export type GenerateCodeExplanationsInput = z.infer<typeof GenerateCodeExplanationsInputSchema>;

const GenerateCodeExplanationsOutputSchema = z.object({
  explanation: z.string().describe('A human-readable explanation of the refactoring suggestions.'),
});
export type GenerateCodeExplanationsOutput = z.infer<typeof GenerateCodeExplanationsOutputSchema>;

export async function generateCodeExplanations(input: GenerateCodeExplanationsInput): Promise<GenerateCodeExplanationsOutput> {
  return generateCodeExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeExplanationsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateCodeExplanationsInputSchema},
  prompt: `You are an AI assistant that helps developers understand code refactoring suggestions.
  Given a code block and its analysis, your task is to generate a human-readable explanation of the refactoring suggestions.
  The explanation should be clear, concise, and easy to understand for developers of all skill levels.

  Respond with ONLY a valid JSON object with the following structure:
  {
    "explanation": "A human-readable explanation of the refactoring suggestions."
  }
  
  Do not include any other text or markdown formatting.

  Code Block:
  \'\'\'
  {{code}}
  \'\'\'

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
    const response = await prompt(input);
    const jsonString = response.text;
    try {
      // The model might return the JSON string wrapped in markdown
      const cleanedJsonString = jsonString.replace(/^```json\n|```$/g, '');
      const parsed = JSON.parse(cleanedJsonString);
      return GenerateCodeExplanationsOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse JSON response from AI:", jsonString);
      throw new Error("The AI returned an invalid response. Please try again.");
    }
  }
);
