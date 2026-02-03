import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for Google AI (Gemini).
 * Using singleton pattern to prevent multiple initializations during Next.js hot-reloads.
 */
const aiConfig = {
  plugins: [
    googleAI({ apiVersion: 'v1beta' }),
  ],
};

const globalForGenkit = global as unknown as { ai: ReturnType<typeof genkit> };

export const ai = globalForGenkit.ai || genkit(aiConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForGenkit.ai = ai;
}
