
'use server';

/**
 * @fileOverview An AI security expert using OpenAI GPT-4o.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  const { output } = await ai.generate({
    model: 'openai/gpt-4o',
    input: input,
    prompt: `Perform a deep security audit on the following code. Identify vulnerabilities (SQLi, XSS, etc.) and provide CWE IDs.

    Code:
    {{{code}}}`,
    output: { schema: SecurityAnalysisOutputSchema }
  });

  if (!output) throw new Error("AI failed to generate security analysis.");
  return output;
}
