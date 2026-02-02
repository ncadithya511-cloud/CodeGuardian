'use server';

/**
 * @fileOverview An AI agent for analyzing code quality.
 *
 * - analyzeCodeQuality - A function that handles the code quality analysis.
 * - AnalyzeCodeQualityInput - The input type for the analyzeCodeQuality function.
 * - AnalyzeCodeQualityOutput - The return type for the analyzeCodeQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IssueSchema = z.object({
  title: z.string().describe('A brief, clear title for the issue (e.g., "High Cyclomatic Complexity").'),
  detail: z.string().describe('A detailed explanation of the issue and why it is problematic.'),
  severity: z.enum(["High", "Medium", "Low"]).describe('The severity of the issue.'),
});

const AnalyzeCodeQualityInputSchema = z.object({
  code: z.string().describe("The code block to be analyzed."),
});
export type AnalyzeCodeQualityInput = z.infer<typeof AnalyzeCodeQualityInputSchema>;

const AnalyzeCodeQualityOutputSchema = z.object({
  score: z.number().int().min(0).max(100).describe('The overall technical debt score for the analyzed code, from 0 to 100, where 100 is a perfect score.'),
  issues: z.array(IssueSchema).describe('A list of identified code quality issues.'),
});
export type AnalyzeCodeQualityOutput = z.infer<typeof AnalyzeCodeQualityOutputSchema>;

export async function analyzeCodeQuality(input: AnalyzeCodeQualityInput): Promise<AnalyzeCodeQualityOutput> {
  return analyzeCodeQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodeQualityPrompt',
  input: {schema: AnalyzeCodeQualityInputSchema},
  output: {schema: AnalyzeCodeQualityOutputSchema},
  prompt: `You are an expert software engineer and code quality analyzer. Your task is to analyze the provided code snippet and calculate a "Technical Debt Score" from 0 to 100, where 100 is a perfect, debt-free code.

  Analyze the code based on the following criteria:
  - Readability and Maintainability: Is the code clean, well-formatted, and easy to understand?
  - Complexity: Evaluate cyclomatic complexity. Are there deeply nested conditionals or loops?
  - Performance: Identify any obviously inefficient patterns or algorithms (e.g., nested loops for lookups where a Set would be better).
  - Best Practices: Does the code adhere to modern language-specific best practices?
  - Error Handling: Is error handling robust or absent?
  - Syntax Errors: Check for any syntax errors. If there are syntax errors, the score should be very low.

  Based on your analysis, provide a list of specific issues you found. For each issue, provide a title, a detailed explanation, and a severity level (High, Medium, Low).

  If the code is perfect, return a score of 100 and an empty list of issues.

  Respond with ONLY a valid JSON object that conforms to the output schema. Do not include any other text or markdown formatting.

  Code Block to Analyze:
  \'\'\'
  {{code}}
  \'\'\'
  `,
});

const analyzeCodeQualityFlow = ai.defineFlow(
  {
    name: 'analyzeCodeQualityFlow',
    inputSchema: AnalyzeCodeQualityInputSchema,
    outputSchema: AnalyzeCodeQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI returned an invalid response. Please try again.");
    }
    return output;
  }
);
