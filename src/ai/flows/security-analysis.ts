
'use server';

/**
 * @fileOverview An AI security expert using Gemini 1.5 Flash.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

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
    model: googleAI.model('gemini-1.5-flash'),
    prompt: `Perform a deep security audit on the following code. Identify vulnerabilities (SQLi, XSS, etc.) and provide CWE IDs.

    IMPORTANT: Your response must be a single, valid JSON object matching this structure:
    {
      "vulnerabilities": [
        { "title": "string", "detail": "string", "severity": "Critical" | "High" | "Medium" | "Low", "cwe": "string" }
      ]
    }

    Code:
    ${input.code}`,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return SecurityAnalysisOutputSchema.parse(parsed);
  } catch (e) {
    console.error("Security analysis parse failed:", text);
    throw new Error("AI failed to generate security analysis.");
  }
}
