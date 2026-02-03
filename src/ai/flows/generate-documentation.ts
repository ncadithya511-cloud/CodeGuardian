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
  return generateDocumentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentationPrompt',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: GenerateDocumentationInputSchema},
  output: {schema: GenerateDocumentationOutputSchema},
  prompt: `You are an AI specialized in technical writing and software documentation. 
  Your task is to take the provided code block and add comprehensive, professional-grade documentation (JSDoc for JavaScript, TSDoc for TypeScript).

  Guidelines:
  - Document all functions, classes, and exported constants.
  - Include descriptions, @param tags with types and descriptions, @returns tags, and @throws tags where applicable.
  - Ensure the documentation is clear, accurate, and follows industry standard conventions.
  - Do not change the underlying logic of the code.

  Respond with ONLY a valid JSON object that conforms to the output schema.
  Do not include any other text or markdown formatting.

  Code Block:
  '''
  {{code}}
  '''
  `,
});

const generateDocumentationFlow = ai.defineFlow(
  {
    name: 'generateDocumentationFlow',
    inputSchema: GenerateDocumentationInputSchema,
    outputSchema: GenerateDocumentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI returned an invalid response. Please try again.");
    }
    return output;
  }
);
