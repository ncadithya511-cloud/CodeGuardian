'use server';

/**
 * @fileOverview An AI agent for generating flawless code using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePerfectCodeInputSchema = z.object({
  code: z.string(),
});
export type GeneratePerfectCodeInput = z.infer<typeof GeneratePerfectCodeInputSchema>;

const GeneratePerfectCodeOutputSchema = z.object({
  perfectCode: z.string(),
  explanation: z.string(),
});
export type GeneratePerfectCodeOutput = z.infer<typeof GeneratePerfectCodeOutputSchema>;

export async function generatePerfectCode(input: GeneratePerfectCodeInput): Promise<GeneratePerfectCodeOutput> {
  return generatePerfectCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePerfectCodePrompt',
  model: 'googleai/gemini-1.5-pro', // HARDCODED
  input: {schema: GeneratePerfectCodeInputSchema},
  prompt: `Rewrite this code to be 100% perfect, optimized, secure, and clean.

  Original Code:
  '''
  {{code}}
  '''

  Respond with ONLY a valid JSON object matching this schema:
  {
    "perfectCode": "string",
    "explanation": "string"
  }
  Do not include markdown code blocks or any other text.`,
});

const generatePerfectCodeFlow = ai.defineFlow(
  {
    name: 'generatePerfectCodeFlow',
    inputSchema: GeneratePerfectCodeInputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as GeneratePerfectCodeOutput;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", text);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
  }
);
