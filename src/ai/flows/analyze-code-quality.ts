'use server';

/**
 * @fileOverview An AI agent for analyzing code quality using hardcoded gemini-pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    model: 'googleai/gemini-pro',
    prompt: `You are an expert software architect. Analyze the provided code for quality, complexity, and maintainability.
    Calculate a Technical Debt Score (0-100), where 100 is perfect.
    Identify specific issues with clear titles, descriptions, and severity.

    Code:
    '''
    ${input.code}
    '''

    Respond with ONLY a valid JSON object matching this schema:
    {
      "score": number,
      "issues": [
        {
          "title": "string",
          "detail": "string",
          "severity": "High" | "Medium" | "Low"
        }
      ]
    }
    Do not include markdown code blocks or any other text.`,
  });

  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as AnalyzeCodeQualityOutput;
  } catch (e) {
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
