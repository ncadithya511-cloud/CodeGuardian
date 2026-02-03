'use server';

/**
 * @fileOverview An AI agent for generating code documentation using hardcoded gemini-1.5-flash.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentationInputSchema = z.object({
  code: z.string().describe("The code block to generate documentation for."),
});
export type GenerateDocumentationInput = z.infer<typeof GenerateDocumentationInputSchema>;

const GenerateDocumentationOutputSchema = z.object({
  documentedCode: z.string(),
  explanation: z.string(),
});
export type GenerateDocumentationOutput = z.infer<typeof GenerateDocumentationOutputSchema>;

export async function generateDocumentation(input: GenerateDocumentationInput): Promise<GenerateDocumentationOutput> {
  // HARDCODED MODEL AND DIRECT GENERATION TO AVOID CONFIG ERRORS
  const { text } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `You are an AI specialized in technical writing. Add professional documentation (JSDoc/TSDoc) to the code.

    Code Block:
    '''
    ${input.code}
    '''

    Respond with ONLY a valid JSON object matching this schema:
    {
      "documentedCode": "string",
      "explanation": "string"
    }
    Do not include markdown code blocks or any other text.`,
  });

  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as GenerateDocumentationOutput;
  } catch (e) {
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
