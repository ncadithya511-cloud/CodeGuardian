'use server';

/**
 * @fileOverview An AI agent for generating code documentation using Gemini 1.5 Pro.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentationInputSchema = z.object({
  code: z.string().describe("The code block to generate documentation for."),
});
export type GenerateDocumentationInput = z.infer<typeof GenerateDocumentationInputSchema>;

const GenerateDocumentationOutputSchema = z.object({
  documentedCode: z.string().describe('The code block with added JSDoc/TSDoc documentation.'),
  explanation: z.string().describe('A summary of the documentation changes made.'),
});
export type GenerateDocumentationOutput = z.infer<typeof GenerateDocumentationOutputSchema>;

export async function generateDocumentation(input: GenerateDocumentationInput): Promise<GenerateDocumentationOutput> {
  // HARDCODED MODEL AND DIRECT GENERATION
  const { text } = await ai.generate({
    model: 'googleai/gemini-1.5-pro',
    prompt: `You are an AI specialized in technical writing and software documentation. 
    Your task is to take the provided code block and add comprehensive, professional-grade documentation (JSDoc for JavaScript, TSDoc for TypeScript).

    Guidelines:
    - Document all functions, classes, and exported constants.
    - Include descriptions, @param tags with types and descriptions, @returns tags, and @throws tags where applicable.
    - Ensure the documentation is clear, accurate, and follows industry standard conventions.
    - Do not change the underlying logic of the code.

    Respond with ONLY a valid JSON object matching this schema:
    {
      "documentedCode": "string",
      "explanation": "string"
    }
    Do not include markdown code blocks or any other text.

    Code Block:
    '''
    ${input.code}
    '''`,
  });

  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as GenerateDocumentationOutput;
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", text);
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
}
