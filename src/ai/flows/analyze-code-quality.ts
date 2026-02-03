'use server';

/**
 * @fileOverview An AI agent for analyzing code quality using Gemini 1.5 Flash.
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
  const { text } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `You are an expert software architect. Analyze the provided code for quality, complexity, and maintainability.
    Calculate a Technical Debt Score (0-100), where 100 is perfect.
    Identify specific issues with clear titles, descriptions, and severity.

    IMPORTANT: Your response must be a single, valid JSON object matching this structure:
    {
      "score": number,
      "issues": [
        { "title": "string", "detail": "string", "severity": "High" | "Medium" | "Low" }
      ]
    }

    Code to analyze:
    ${input.code}`,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return AnalyzeCodeQualityOutputSchema.parse(parsed);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("The AI returned an invalid response. Please try again.");
  }
}
