
'use server';

/**
 * @fileOverview An AI agent for analyzing code quality using OpenAI GPT-4o.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeCodeQualityInputSchema = z.object({
  code: z.string().describe("The code block to be analyzed."),
});
export type AnalyzeCodeQualityInput = z.infer<typeof AnalyzeCodeQualityInputSchema>;

const AnalyzeCodeQualityOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  issues: z.array(z.object({
    title: z.string(),
    detail: z.string(),
    severity: z.enum(["High", "Medium", "Low"])
  })),
});
export type AnalyzeCodeQualityOutput = z.infer<typeof AnalyzeCodeQualityOutputSchema>;

export async function analyzeCodeQuality(input: AnalyzeCodeQualityInput): Promise<AnalyzeCodeQualityOutput> {
  const { output } = await ai.generate({
    model: 'openai/gpt-4o',
    input: input,
    prompt: `You are an expert software architect. Analyze the provided code for quality, complexity, and maintainability.
    Calculate a Technical Debt Score (0-100), where 100 is perfect.
    Identify specific issues with clear titles, descriptions, and severity.

    Code to analyze:
    {{{code}}}`,
    output: { schema: AnalyzeCodeQualityOutputSchema }
  });

  if (!output) {
    throw new Error("The AI returned an invalid response. Please try again.");
  }

  return output;
}
