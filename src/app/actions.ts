'use server';

import { redirect } from 'next/navigation';
import type { AnalysisState, Issue, RefactorState } from '@/lib/types';
import { codeSchema } from '@/lib/types';
import { refactorCode } from '@/ai/flows/refactor-code';

export async function analyzeCode(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const code = formData.get('code');
  
  const validation = codeSchema.safeParse(code);
  if (!validation.success) {
    return { status: 'error', error: validation.error.errors[0].message };
  }
  
  const validatedCode = validation.data;

  redirect(`/analyzer/results?code=${encodeURIComponent(validatedCode)}`);
}

export async function getRefactoredCode(
  prevState: RefactorState,
  formData: FormData
): Promise<RefactorState> {
  const code = formData.get('code') as string;
  const analysis = formData.get('analysis') as string;

  if (!code || !analysis) {
    return { status: 'error', error: 'Missing code or analysis for refactoring.' };
  }
  
  try {
    const result = await refactorCode({ code, analysis });
    return {
      status: 'success',
      result: {
        refactoredCode: result.refactoredCode,
        explanation: result.explanation,
      },
    };
  } catch (e: any) {
    console.error("Refactoring failed:", e);
    return { status: 'error', error: e.message || 'An unexpected error occurred during refactoring.' };
  }
}
