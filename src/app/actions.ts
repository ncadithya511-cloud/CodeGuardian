'use server';

import { z } from 'zod';
import { generateCodeExplanations } from '@/ai/flows/generate-code-explanations';

type Issue = {
  title: string;
  detail: string;
  severity: 'High' | 'Medium' | 'Low';
};

type AnalysisResult = {
  score: number;
  issues: Issue[];
  explanation: string;
};

export type AnalysisState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: AnalysisResult;
  error?: string;
};

const codeSchema = z.string().min(10, 'Code must be at least 10 characters long.');

// A mock function to simulate AST analysis and scoring
const mockAstAnalysis = (code: string): { score: number, issues: Issue[], analysisText: string } => {
  // Simple logic to generate a score and some issues based on code characteristics
  const lines = code.split('\n').length;
  const complexityMatch = (code.match(/(if|for|while|case)/g) || []).length;
  const nestedLoopMatch = code.match(/for.*for/g);
  const nestedLoops = nestedLoopMatch ? nestedLoopMatch.length : 0;
  
  let score = 100;
  let analysisText = 'Initial analysis indicates a healthy codebase. ';
  const issues: Issue[] = [];

  // Penalize for long functions
  if (lines > 40) {
    const penalty = Math.min((lines - 40) * 0.5, 15);
    score -= penalty;
    issues.push({
      title: 'Long Function',
      detail: `Function has ${lines} lines. Consider breaking it down into smaller, more manageable functions.`,
      severity: 'Low'
    });
  }

  // Penalize for high cyclomatic complexity
  if (complexityMatch > 5) {
    const penalty = Math.min((complexityMatch - 5) * 2, 25);
    score -= penalty;
    issues.push({
      title: 'High Cyclomatic Complexity',
      detail: `High number of branches (${complexityMatch}) detected. This can make the code hard to test and maintain.`,
      severity: 'Medium'
    });
  }
  
  // Penalize heavily for nested loops
  if (nestedLoops > 0) {
    score -= nestedLoops * 20;
    issues.push({
      title: 'Nested Loops Detected',
      detail: `Found ${nestedLoops} instance(s) of nested loops. This can lead to poor performance (O(n^2) or worse).`,
      severity: 'High'
    });
  }

  score = Math.max(0, Math.round(score));
  analysisText = `Technical Debt Score is ${score}. Found issues: ${issues.map(i => i.title).join(', ') || 'None'}.`;

  return { score, issues, analysisText };
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

  try {
    // 1. Static Analysis Layer (Mocked)
    const { score, issues, analysisText } = mockAstAnalysis(validatedCode);

    // 2. Heuristic Layer (GenAI)
    // The AI is only asked to explain what the static analysis has already found.
    const aiResponse = await generateCodeExplanations({
      code: validatedCode,
      analysis: analysisText
    });

    if (!aiResponse.explanation) {
      return { status: 'error', error: 'AI failed to generate an explanation.' };
    }

    return {
      status: 'success',
      result: {
        score,
        issues,
        explanation: aiResponse.explanation
      },
    };
  } catch (error) {
    console.error(error);
    return { status: 'error', error: 'An unexpected error occurred during analysis.' };
  }
}
