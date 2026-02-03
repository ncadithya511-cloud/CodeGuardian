
'use server';

/**
 * @fileOverview An AI agent for generating code documentation using Gemini 1.5 Flash.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

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
  const { text } = await ai.generate({
    model: googleAI.model('gemini-1.5-flash'),
    prompt: `You are an AI specialized in technical writing. Add professional documentation (JSDoc/TSDoc) to the code.

    IMPORTANT: Your response must be a single, valid JSON object matching this structure:
    {
      "documentedCode": "string",
      "explanation": "string"
    }

    Code Block:
    ${input.code}`,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return GenerateDocumentationOutputSchema.parse(parsed);
  } catch (e) {
    throw new Error("AI failed to generate documentation.");
  }
}
