
'use server';

/**
 * @fileOverview An AI agent for generating code documentation using OpenAI GPT-4o.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  const { output } = await ai.generate({
    model: 'openai/gpt-4o',
    input: input,
    prompt: `You are an AI specialized in technical writing. Add professional documentation (JSDoc/TSDoc) to the code.

    Code Block:
    {{{code}}}`,
    output: { schema: GenerateDocumentationOutputSchema }
  });

  if (!output) throw new Error("AI failed to generate documentation.");
  return output;
}
