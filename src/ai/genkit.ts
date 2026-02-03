import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// The googleAI() plugin will automatically look for a GEMINI_API_KEY
// in the environment variables.

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
});
