'use client';

import { useState, useMemo, type FC, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getRefactoredCode } from '@/app/actions';
import type { RefactorState, AnalysisResult } from '@/lib/types';
import { AlertTriangle, Bot, CheckCircle, Code, Copy, Diamond, FileCode2, Github, Loader2, Sparkles, Wand2, XCircle } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const refactorInitialState: RefactorState = { status: 'idle' };

const AutoRefactorButton = () => {
  const { pending } = useFormStatus();
  return (
      <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refactoring...
              </>
          ) : (
              <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Auto-Refactor Code
              </>
          )}
      </Button>
  );
};

const ScoreChart: FC<{ score: number }> = ({ score }) => {
  const color = useMemo(() => {
    if (score >= 80) return 'hsl(var(--accent))';
    if (score >= 50) return 'hsl(var(--chart-4))';
    return 'hsl(var(--destructive))';
  }, [score]);

  const data = [{ value: score }];

  return (
    <ResponsiveContainer width="100%" height={180}>
      <RadialBarChart
        innerRadius="70%"
        outerRadius="100%"
        data={data}
        startAngle={90}
        endAngle={-270}
        barSize={20}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          background={{ fill: 'hsl(var(--muted))' }}
          dataKey="value"
          cornerRadius={10}
          fill={color}
          className="transition-all duration-500"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground font-headline text-5xl font-bold"
        >
          {score}
        </text>
        <text
          x="50%"
          y="68%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground font-body text-sm"
        >
          Debt Score
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

const GitCommitSimulator: FC<{ score: number }> = ({ score }) => {
    const [status, setStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');
    const commitThreshold = 70;
  
    const handleCommit = () => {
      setStatus('checking');
      setTimeout(() => {
        if (score >= commitThreshold) {
          setStatus('passed');
        } else {
          setStatus('failed');
        }
      }, 1500);
    };
  
    return (
      <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github />
            Git Pre-Commit Hook
          </CardTitle>
          <CardDescription>
            Simulate a `git commit` action. Commits are rejected if the Technical Debt Score is below {commitThreshold}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-background/50 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              {status === 'idle' && <Github className="h-8 w-8 text-muted-foreground" />}
              {status === 'checking' && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
              {status === 'passed' && <CheckCircle className="h-8 w-8 text-accent" />}
              {status === 'failed' && <XCircle className="h-8 w-8 text-destructive" />}
            </div>
            
            <div className="text-center h-12">
              {status === 'checking' && <p className="text-sm text-primary">Running CodeGuardian analysis...</p>}
              {status === 'passed' && (
                <div className="animate-in fade-in">
                  <p className="font-semibold text-accent">Commit Successful!</p>
                  <p className="text-sm text-muted-foreground">Code quality meets the standards.</p>
                </div>
              )}
              {status === 'failed' && (
                <div className="animate-in fade-in">
                  <p className="font-semibold text-destructive">Commit Rejected!</p>
                  <p className="text-sm text-muted-foreground">Score of {score} is below threshold of {commitThreshold}.</p>
                </div>
              )}
            </div>
  
            <Button onClick={handleCommit} disabled={status === 'checking' || status === 'passed'} className="w-full max-w-xs">
              {status === 'failed' ? "Retry Commit" : "git commit -m 'feat: new changes'"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
};

type ResultsViewProps = {
  code: string;
  analysisResult: AnalysisResult;
}

export default function ResultsView({ code, analysisResult }: ResultsViewProps) {
    const { toast } = useToast();
    const [refactorState, refactorAction] = useActionState(getRefactoredCode, refactorInitialState);

    const severityColor = (severity: 'High' | 'Medium' | 'Low') => {
        switch (severity) {
        case 'High': return 'border-destructive/80 text-destructive';
        case 'Medium': return 'border-yellow-400/80 text-yellow-400';
        case 'Low': return 'border-sky-400/80 text-sky-400';
        default: return 'border-secondary';
        }
    }

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Analysis Report</h1>
                    <p className="text-muted-foreground">
                        Here's what the AI Guardian found in your code.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/analyzer">Analyze Another Snippet</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
                    <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCode2 /> Original Code
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => {
                                    navigator.clipboard.writeText(code);
                                    toast({ title: "Code copied to clipboard!" });
                                }}>
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy code</span>
                                </Button>
                            </div>
                            <CardDescription>
                                The code that was submitted for analysis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                name="code"
                                readOnly
                                value={code}
                                className="min-h-[300px] font-code text-[13px] leading-relaxed bg-transparent"
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-8">
                    <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                        <CardHeader>
                            <CardTitle>Technical Debt Score</CardTitle>
                            <CardDescription>
                                A summary of your code's quality metrics.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center rounded-lg bg-background/50 p-4">
                            <ScoreChart score={analysisResult.score} />
                        </CardContent>
                    </Card>

                    <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="text-destructive" />
                                Identified Issues
                            </CardTitle>
                            <CardDescription>
                                Found {analysisResult.issues.length} {analysisResult.issues.length === 1 ? 'issue' : 'issues'} in your code, ranked by severity.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analysisResult.issues.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {analysisResult.issues.map((issue, index) => (
                                        <AccordionItem value={`item-${index}`} key={index} className="border-border/50 rounded-lg mb-2 bg-card-foreground/5 overflow-hidden">
                                            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                                                <div className="flex justify-between items-center w-full">
                                                    <span>{issue.title}</span>
                                                    <Badge variant="outline" className={cn("text-xs", severityColor(issue.severity))}>
                                                        {issue.severity}
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-3">
                                                <p className="text-xs text-muted-foreground">{issue.detail}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
                                    <CheckCircle className="h-8 w-8 text-accent" />
                                    <p className="text-sm font-medium">No issues found!</p>
                                    <p className="text-xs text-muted-foreground">Great job keeping the code clean.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot /> AI Refactoring Suggestions
                            </CardTitle>
                            <CardDescription>
                                The AI Guardian's explanation of the identified issues and how to resolve them.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border/50 bg-background/50 p-4 font-body relative">
                              <p>{analysisResult.explanation}</p>
                              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                  navigator.clipboard.writeText(analysisResult.explanation || '');
                                  toast({ title: "Explanation copied to clipboard!" });
                                }}>
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Copy explanation</span>
                              </Button>
                            </div>
                            <form action={refactorAction} className="mt-4">
                              <input type="hidden" name="code" value={code} />
                              <input type="hidden" name="analysis" value={JSON.stringify(analysisResult.issues)} />
                              <AutoRefactorButton />
                            </form>
                        </CardContent>
                  </Card>

                    <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary shadow-lg shadow-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Diamond /> Generate "Perfect" Code
                            </CardTitle>
                            <CardDescription>
                                Take the next step and see the AI's attempt at a flawless, production-grade version of your code.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={`/perfect?code=${encodeURIComponent(code)}`}>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Perfect Code
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                  {refactorState.status === 'loading' && (
                      <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[200px] bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                          <Loader2 className="h-12 w-12 animate-spin text-primary" />
                          <h2 className="text-xl font-semibold">AI is Refactoring...</h2>
                          <p className="max-w-md text-muted-foreground">
                              Applying improvements to your code. Please wait.
                          </p>
                      </Card>
                  )}

                  {refactorState.status === 'error' && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Refactoring Failed</AlertTitle>
                        <AlertDescription>
                            {refactorState.error || "An unknown error occurred."}
                        </AlertDescription>
                    </Alert>
                  )}

                  {refactorState.status === 'success' && refactorState.result && (
                    <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles /> Refactored Code
                            </CardTitle>
                            <CardDescription>
                                Here is the AI-generated refactored code and an explanation of the changes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border/50 bg-background/50 p-4 font-body mb-4">
                              <p>{refactorState.result.explanation}</p>
                            </div>
                            <div className="relative">
                                <Textarea
                                    readOnly
                                    value={refactorState.result.refactoredCode}
                                    className="min-h-[250px] font-code text-[13px] leading-relaxed bg-transparent"
                                />
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                    navigator.clipboard.writeText(refactorState.result?.refactoredCode || '');
                                    toast({ title: "Refactored code copied to clipboard!" });
                                }}>
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy refactored code</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  
                  <GitCommitSimulator score={analysisResult.score} />
                </div>
            </div>
        </div>
    )
}
