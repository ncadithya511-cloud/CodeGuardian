'use server';

/**
 * @fileOverview An AI agent for generating code documentation using Gemini 1.5 Flash.
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
  const { text } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `You are an AI specialized in technical writing and software engineering documentation. 
    Your task is to add professional documentation (JSDoc for JavaScript or TSDoc for TypeScript) to the provided code block.
    
    Ensure the documentation includes:
    1. A clear description of the function or class's purpose.
    2. Detailed @param tags for all arguments, including their types and descriptions.
    3. A @returns tag describing the return value and its type.
    4. @throws tags if the code can throw specific errors.
    5. @example tags if the logic is complex.

    IMPORTANT: Your response must be a single, valid JSON object matching this structure:
    {
      "documentedCode": "The original code with integrated JSDoc/TSDoc comments",
      "explanation": "A short summary of what documentation was added and why"
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
    throw new Error("AI failed to generate documentation. The response was not valid JSON.");
  }
}
