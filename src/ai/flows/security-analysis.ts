'use server';

/**
 * @fileOverview An AI security expert using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VulnerabilitySchema = z.object({
  title: z.string(),
  detail: z.string(),
  severity: z.enum(["Critical", "High", "Medium", "Low"]),
  cwe: z.string(),
});

const SecurityAnalysisInputSchema = z.object({
  code: z.string(),
});
export type SecurityAnalysisInput = z.infer<typeof SecurityAnalysisInputSchema>;

const SecurityAnalysisOutputSchema = z.object({
  vulnerabilities: z.array(VulnerabilitySchema),
});
export type SecurityAnalysisOutput = z.infer<typeof SecurityAnalysisOutputSchema>;

export async function securityAnalysis(input: SecurityAnalysisInput): Promise<SecurityAnalysisOutput> {
  return securityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'securityAnalysisPrompt',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: SecurityAnalysisInputSchema},
  output: {schema: SecurityAnalysisOutputSchema},
  prompt: `Perform a deep security audit on this code. Identify vulnerabilities (SQLi, XSS, etc.) and provide CWE IDs.

  Code:
  '''
  {{code}}
  '''
  `,
});

const securityAnalysisFlow = ai.defineFlow(
  {
    name: 'securityAnalysisFlow',
    inputSchema: SecurityAnalysisInputSchema,
    outputSchema: SecurityAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI failed to generate security analysis.");
    return output;
  }
);
