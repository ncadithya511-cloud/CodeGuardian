
import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';

/**
 * Genkit instance configured for Vertex AI (Firebase).
 * Using a strict singleton pattern to prevent multiple initializations 
 * and model registry conflicts during Next.js hot-reloads.
 */
const globalForGenkit = global as unknown as { ai: ReturnType<typeof genkit> };

export const ai =
  globalForGenkit.ai ||
  genkit({
    plugins: [
      vertexAI(),
    ],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForGenkit.ai = ai;
}
