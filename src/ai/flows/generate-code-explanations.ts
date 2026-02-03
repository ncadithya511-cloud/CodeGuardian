'use server';

/**
 * @fileOverview A code explanation AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCodeExplanationsOutputSchema = z.object({
  explanation: z.string(),
});

export type GenerateCodeExplanationsOutput = z.infer<typeof GenerateCodeExplanationsOutputSchema>;

export async function generateCodeExplanations(input: { code: string, analysis: string }): Promise<GenerateCodeExplanationsOutput> {
  const { text } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `Explain the refactoring suggestions for this code based on the provided analysis.

    IMPORTANT: Your response must be a single, valid JSON object matching this structure:
    {
      "explanation": "string"
    }

    Code:
    ${input.code}

    Analysis:
    ${input.analysis}`,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return GenerateCodeExplanationsOutputSchema.parse(parsed);
  } catch (e) {
    throw new Error("AI failed to generate code explanations.");
  }
}
