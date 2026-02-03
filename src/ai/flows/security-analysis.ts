'use server';

/**
 * @fileOverview An AI security expert using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SecurityAnalysisInputSchema = z.object({
  code: z.string(),
});
export type SecurityAnalysisInput = z.infer<typeof SecurityAnalysisInputSchema>;

const SecurityAnalysisOutputSchema = z.object({
  vulnerabilities: z.array(z.object({
    title: z.string(),
    detail: z.string(),
    severity: z.enum(["Critical", "High", "Medium", "Low"]),
    cwe: z.string(),
  })),
});
export type SecurityAnalysisOutput = z.infer<typeof SecurityAnalysisOutputSchema>;

export async function securityAnalysis(input: SecurityAnalysisInput): Promise<SecurityAnalysisOutput> {
  return securityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'securityAnalysisPrompt',
  model: 'googleai/gemini-1.5-pro', // HARDCODED
  input: {schema: SecurityAnalysisInputSchema},
  prompt: `Perform a deep security audit on this code. Identify vulnerabilities (SQLi, XSS, etc.) and provide CWE IDs.

  Code:
  '''
  {{code}}
  '''

  Respond with ONLY a valid JSON object matching this schema:
  {
    "vulnerabilities": [
      {
        "title": "string",
        "detail": "string",
        "severity": "Critical" | "High" | "Medium" | "Low",
        "cwe": "string"
      }
    ]
  }
  Do not include markdown code blocks or any other text.`,
});

const securityAnalysisFlow = ai.defineFlow(
  {
    name: 'securityAnalysisFlow',
    inputSchema: SecurityAnalysisInputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as SecurityAnalysisOutput;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", text);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
  }
);
