'use server';

/**
 * @fileOverview An AI agent for security vulnerability analysis.
 *
 * - securityAnalysis - A function that handles the security analysis process.
 * - SecurityAnalysisInput - The input type for the securityAnalysis function.
 * - SecurityAnalysisOutput - The return type for the securityAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SecurityAnalysisInputSchema = z.object({
  code: z
    .string()
    .describe("The code block to be analyzed for security vulnerabilities."),
});
export type SecurityAnalysisInput = z.infer<typeof SecurityAnalysisInputSchema>;

const VulnerabilitySchema = z.object({
  title: z.string().describe('A brief, clear title for the vulnerability (e.g., "SQL Injection").'),
  detail: z.string().describe('A detailed explanation of the vulnerability, how it can be exploited, and suggestions for remediation.'),
  severity: z.enum(["Critical", "High", "Medium", "Low"]).describe('The severity of the vulnerability.'),
  cwe: z.string().describe('The Common Weakness Enumeration (CWE) identifier (e.g., "CWE-89").'),
});

const SecurityAnalysisOutputSchema = z.object({
  vulnerabilities: z.array(VulnerabilitySchema).describe('A list of identified security vulnerabilities.'),
});
export type SecurityAnalysisOutput = z.infer<typeof SecurityAnalysisOutputSchema>;

export async function securityAnalysis(input: SecurityAnalysisInput): Promise<SecurityAnalysisOutput> {
  return securityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'securityAnalysisPrompt',
  input: {schema: SecurityAnalysisInputSchema},
  prompt: `You are a world-class cybersecurity expert and principal software engineer with a specialization in application security (AppSec). You have a deep understanding of the OWASP Top 10, CWE, and common attack vectors.

  Given the following code block, your task is to perform a thorough security analysis and identify any potential vulnerabilities. For each vulnerability, you must provide a clear title, a detailed explanation of the risk and remediation, its severity, and the relevant CWE identifier.

  Focus on vulnerabilities such as:
  - Injection flaws (SQL, NoSQL, OS, etc.)
  - Cross-Site Scripting (XSS)
  - Insecure Deserialization
  - Sensitive Data Exposure
  - Security Misconfiguration
  - Broken Authentication
  - Insecure Direct Object References (IDOR)
  - And other common weaknesses.

  If no vulnerabilities are found, return an empty array.

  Respond with ONLY a valid JSON object with the following structure:
  {
    "vulnerabilities": [
      {
        "title": "Brief title of the vulnerability",
        "detail": "Detailed explanation of the risk and remediation.",
        "severity": "Critical | High | Medium | Low",
        "cwe": "CWE-ID"
      }
    ]
  }

  Do not include any other text or markdown formatting.

  Code Block to Analyze:
  \'\'\'
  {{code}}
  \'\'\'
  `,
});

const securityAnalysisFlow = ai.defineFlow(
  {
    name: 'securityAnalysisFlow',
    inputSchema: SecurityAnalysisInputSchema,
    outputSchema: SecurityAnalysisOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const jsonString = response.text;
    try {
      const cleanedJsonString = jsonString.replace(/^```json\n|```$/g, '');
      const parsed = JSON.parse(cleanedJsonString);
      return SecurityAnalysisOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse JSON response from AI:", jsonString);
      throw new Error("The AI returned an invalid response. Please try again.");
    }
  }
);
