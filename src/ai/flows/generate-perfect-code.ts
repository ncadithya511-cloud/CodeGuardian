
'use server';

/**
 * @fileOverview An AI agent for generating flawless code using Vertex AI for Firebase.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePerfectCodeOutputSchema = z.object({
  perfectCode: z.string(),
  explanation: z.string(),
});

export type GeneratePerfectCodeOutput = z.infer<typeof GeneratePerfectCodeOutputSchema>;

export async function generatePerfectCode(input: { code: string }): Promise<GeneratePerfectCodeOutput> {
  const { text } = await ai.generate({
    model: 'vertexai/gemini-1.5-flash',
    prompt: `Rewrite the following code to be 100% perfect, optimized, secure, and clean. Follow industry best practices.

    IMPORTANT: Your response must be a single, valid JSON object matching this structure:
    {
      "perfectCode": "string",
      "explanation": "string"
    }

    Original Code:
    ${input.code}`,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return GeneratePerfectCodeOutputSchema.parse(parsed);
  } catch (e) {
    throw new Error("AI failed to generate perfect code.");
  }
}
