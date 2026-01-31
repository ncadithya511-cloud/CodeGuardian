'use server';

import { redirect } from 'next/navigation';
import { refactorCode } from '@/ai/flows/refactor-code';
import { codeSchema, type AnalysisState, type Issue, type RefactorState } from '@/lib/types';

// A mock function to simulate AST analysis and scoring
export const mockAstAnalysis = async (code: string): Promise<{ score: number, issues: Issue[] }> => {
  // Simple logic to generate a score and some issues based on code characteristics
  const lines = code.split('\n').length;
  const complexityMatch = (code.match(/(if|for|while|case)/g) || []).length;
  const nestedLoopMatch = code.match(/for.*for/g);
  const nestedLoops = nestedLoopMatch ? nestedLoopMatch.length : 0;
  
  let score = 100;
  const issues: Issue[] = [];

  // Penalize for long functions
  if (lines > 30) {
    const penalty = Math.min((lines - 30) * 0.8, 20);
    score -= penalty;
    issues.push({
      title: 'Long Function',
      detail: `Function has ${lines} lines. Consider breaking it down into smaller, more manageable functions for better readability and maintenance.`,
      severity: 'Low'
    });
  }

  // Penalize for high cyclomatic complexity
  if (complexityMatch > 4) {
    const penalty = Math.min((complexityMatch - 4) * 3, 30);
    score -= penalty;
    issues.push({
      title: 'High Cyclomatic Complexity',
      detail: `High number of branches (${complexityMatch}) detected. This can make the code hard to test, understand, and maintain.`,
      severity: 'Medium'
    });
  }
  
  // Penalize heavily for nested loops
  if (nestedLoops > 0) {
    score -= nestedLoops * 25;
    issues.push({
      title: 'Nested Loops Detected',
      detail: `Found ${nestedLoops} instance(s) of nested loops. This can lead to poor performance (O(n^2) or worse) and should be refactored.`,
      severity: 'High'
    });
  }

  // Check for inefficient array operations
  if (code.includes('.includes(') && (nestedLoops > 0 || complexityMatch > 5)) {
    score -= 10;
     issues.push({
      title: 'Inefficient Array Method in Loop',
      detail: `Using '.includes()' inside a loop can be inefficient. For large arrays, consider using a Set for faster lookups.`,
      severity: 'Medium'
    });
  }

  score = Math.max(0, Math.round(score));

  return { score, issues };
};


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
      result: result
    };
  } catch (e: any) {
    console.error("Refactor code error:", e);
    return {
      status: 'error',
      error: e.message || "An unexpected error occurred during refactoring."
    };
  }
}
