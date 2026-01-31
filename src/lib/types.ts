import { z } from 'zod';

export type Issue = {
  title: string;
  detail: string;
  severity: 'High' | 'Medium' | 'Low';
};

export type AnalysisResult = {
  score: number;
  issues: Issue[];
  explanation: string;
};

export type AnalysisState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: AnalysisResult;
  error?: string;
};

export type RefactorState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: {
    refactoredCode: string;
    explanation: string;
  };
  error?: string;
};

export const codeSchema = z.string().min(10, 'Code must be at least 10 characters long.');
