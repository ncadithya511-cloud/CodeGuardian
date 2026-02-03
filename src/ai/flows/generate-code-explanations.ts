'use server';

/**
 * @fileOverview A code explanation AI agent using hardcoded gemini-pro.
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
  const { text } = await ai.generate({
    model: 'googleai/gemini-pro',
    prompt: `Explain the refactoring suggestions for this code.

    Code:
    ${input.code}

    Analysis:
    ${input.analysis}

    Respond with ONLY a valid JSON object matching this schema:
    {
      "explanation": "string"
    }
    Do not include markdown code blocks or any other text.`,
  });

  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as GenerateCodeExplanationsOutput;
  } catch (e) {
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
