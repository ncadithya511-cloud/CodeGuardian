'use server';

/**
 * @fileOverview An AI agent for analyzing code quality using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IssueSchema = z.object({
  title: z.string().describe('A brief, clear title for the issue.'),
  detail: z.string().describe('A detailed explanation of the issue.'),
  severity: z.enum(["High", "Medium", "Low"]).describe('The severity of the issue.'),
});

const AnalyzeCodeQualityInputSchema = z.object({
  code: z.string().describe("The code block to be analyzed."),
});
export type AnalyzeCodeQualityInput = z.infer<typeof AnalyzeCodeQualityInputSchema>;

const AnalyzeCodeQualityOutputSchema = z.object({
  score: z.number().int().min(0).max(100).describe('The technical debt score (0-100).'),
  issues: z.array(IssueSchema).describe('List of identified issues.'),
});
export type AnalyzeCodeQualityOutput = z.infer<typeof AnalyzeCodeQualityOutputSchema>;

export async function analyzeCodeQuality(input: AnalyzeCodeQualityInput): Promise<AnalyzeCodeQualityOutput> {
  return analyzeCodeQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodeQualityPrompt',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: AnalyzeCodeQualityInputSchema},
  prompt: `You are an expert software architect. Analyze the provided code for quality, complexity, and maintainability.
  Calculate a Technical Debt Score (0-100), where 100 is perfect.
  Identify specific issues with clear titles, descriptions, and severity.

  Code:
  '''
  {{code}}
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

const analyzeCodeQualityFlow = ai.defineFlow(
  {
    name: 'analyzeCodeQualityFlow',
    inputSchema: AnalyzeCodeQualityInputSchema,
    outputSchema: AnalyzeCodeQualityOutputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    try {
      // Handle potential markdown formatting
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as AnalyzeCodeQualityOutput;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", text);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
  }
);
