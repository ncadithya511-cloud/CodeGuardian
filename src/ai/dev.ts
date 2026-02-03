'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-code-explanations.ts';
import '@/ai/flows/refactor-code.ts';
import '@/ai/flows/generate-perfect-code.ts';
import '@/ai/flows/security-analysis.ts';
import '@/ai/flows/analyze-code-quality.ts';
import '@/ai/flows/generate-documentation.ts';
