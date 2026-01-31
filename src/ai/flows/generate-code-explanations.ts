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
  input: {schema: GenerateCodeExplanationsInputSchema},
  prompt: `You are an AI assistant that helps developers understand code refactoring suggestions.

  Given a code block and its analysis, your task is to generate a human-readable explanation of the refactoring suggestions.
  The explanation should be clear, concise, and easy to understand for developers of all skill levels.

  Code Block:
  \`\`\`
  {{code}}
  \`\`\`

  Analysis:
  {{analysis}}

  Respond with ONLY a valid JSON object that conforms to the following schema:
  {
    "type": "object",
    "properties": {
      "explanation": {
        "type": "string",
        "description": "A human-readable explanation of the refactoring suggestions."
      }
    },
    "required": ["explanation"]
  }`,
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
      const cleanedJsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
      return JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error("Failed to parse JSON from model response:", jsonString);
      throw new Error("AI returned an invalid response format.");
    }
  }
);
