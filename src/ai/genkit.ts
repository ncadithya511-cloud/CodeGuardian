
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for Google AI (Gemini).
 * Using v1beta API as it is more reliable for Gemini 1.5 models in this environment.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1beta' }),
  ],
});
