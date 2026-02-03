'use server';

/**
 * @fileOverview A code explanation AI agent using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeExplanationsInputSchema = z.object({
  code: z.string(),
  analysis: z.string(),
});
export type GenerateCodeExplanationsInput = z.infer<typeof GenerateCodeExplanationsInputSchema>;

const GenerateCodeExplanationsOutputSchema = z.object({
  explanation: z.string(),
});
export type GenerateCodeExplanationsOutput = z.infer<typeof GenerateCodeExplanationsOutputSchema>;

export async function generateCodeExplanations(input: GenerateCodeExplanationsInput): Promise<GenerateCodeExplanationsOutput> {
  return generateCodeExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeExplanationsPrompt',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: GenerateCodeExplanationsInputSchema},
  prompt: `Explain the refactoring suggestions for this code in a way that is easy for developers to understand.

  Code:
  {{code}}

  Analysis:
  {{analysis}}

  Respond with ONLY a valid JSON object matching this schema:
  {
    "explanation": "string"
  }
  Do not include markdown code blocks or any other text.`,
});

const generateCodeExplanationsFlow = ai.defineFlow(
  {
    name: 'generateCodeExplanationsFlow',
    inputSchema: GenerateCodeExplanationsInputSchema,
    outputSchema: GenerateCodeExplanationsOutputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as GenerateCodeExplanationsOutput;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", text);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
  }
);
