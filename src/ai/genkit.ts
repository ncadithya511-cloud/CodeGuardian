import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configured for Google AI (Gemini).
 * Using a strict singleton pattern to prevent multiple initializations during Next.js hot-reloads.
 */
const globalForGenkit = global as unknown as { ai: ReturnType<typeof genkit> };

export const ai =
  globalForGenkit.ai ||
  genkit({
    plugins: [googleAI({ apiVersion: 'v1beta' })],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForGenkit.ai = ai;
}
