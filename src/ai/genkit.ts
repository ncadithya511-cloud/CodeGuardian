
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for Google AI (Gemini).
 * Using stable v1 API to ensure maximum compatibility.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1' }),
  ],
});
