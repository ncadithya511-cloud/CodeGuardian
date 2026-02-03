'use server';

/**
 * @fileOverview An AI security expert using hardcoded gemini-pro.
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
  const { text } = await ai.generate({
    model: 'googleai/gemini-pro',
    prompt: `Perform a deep security audit on this code. Identify vulnerabilities (SQLi, XSS, etc.) and provide CWE IDs.

    Code:
    '''
    ${input.code}
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

  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as SecurityAnalysisOutput;
  } catch (e) {
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
