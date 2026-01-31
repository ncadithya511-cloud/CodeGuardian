'use client';

import { useState, useMemo, type FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { analyzeCode, type AnalysisState } from '@/app/actions';
import { AlertTriangle, Bot, CheckCircle, Code, FileCode2, Frown, Github, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: AnalysisState = {
  status: 'idle',
};

const defaultCode = `function findCommonElements(arr1, arr2) {
  const commonElements = [];
  // This nested loop is inefficient (O(n*m))
  // and can be optimized.
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        // .includes() inside a loop adds more complexity.
        if (!commonElements.includes(arr1[i])) {
          commonElements.push(arr1[i]);
        }
      }
    }
  }

  // This block of logic increases cyclomatic complexity.
  // It could be simplified.
  if (commonElements.length > 5) {
    console.log("Found more than 5 common elements!");
    if (arr1.length > arr2.length) {
      console.log("The first array is longer.");
    } else {
      console.log("The second array is longer or they are equal.");
    }
  } else if (commonElements.length > 0) {
    console.log("Found 5 or fewer common elements.");
  } else {
    console.log("No common elements found.");
  }
  
  return commonElements;
}`;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Analyze Code
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
          background
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
          className="fill-foreground font-headline text-4xl font-bold"
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
      <Card>
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

export default function Home() {
  const [state, formAction] = useFormState(analyzeCode, initialState);

  const severityColor = (severity: 'High' | 'Medium' | 'Low') => {
    switch (severity) {
      case 'High': return 'bg-destructive/20 text-destructive-foreground border-destructive/50';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50';
      case 'Low': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default: return 'bg-secondary';
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <h1 className="font-headline text-2xl font-semibold">CodeGuardian</h1>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="lg:sticky lg:top-24 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode2 /> Code to Analyze
              </CardTitle>
              <CardDescription>
                Paste your source code below. The system will parse it, identify potential issues, and suggest improvements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction}>
                <Textarea
                  name="code"
                  placeholder="Enter your code here..."
                  defaultValue={defaultCode}
                  className="min-h-[400px] font-code text-[13px] leading-relaxed"
                  required
                />
                <div className="mt-4">
                  <SubmitButton />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-8">
            {state.status === 'idle' && (
              <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px]">
                <div className="rounded-full bg-primary/10 p-4">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Awaiting Analysis</h2>
                <p className="max-w-md text-muted-foreground">
                  Your code analysis report will appear here. The AI Guardian is ready to review your code for quality, performance, and maintainability.
                </p>
              </Card>
            )}

            {state.status === 'error' && (
               <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Analysis Failed</AlertTitle>
                  <AlertDescription>
                    {state.error || "An unknown error occurred. Please try again."}
                  </AlertDescription>
                </Alert>
            )}

            {state.status === 'success' && state.result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Report</CardTitle>
                    <CardDescription>
                      A summary of code quality metrics and identified issues.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex items-center justify-center">
                       <ScoreChart score={state.result.score} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-center md:text-left">Identified Code Smells</h3>
                        {state.result.issues.length > 0 ? (
                            state.result.issues.map((issue, index) => (
                                <div key={index} className="rounded-lg border bg-card-foreground/5 p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-medium text-sm">{issue.title}</h4>
                                        <Badge variant="outline" className={cn("text-xs", severityColor(issue.severity))}>
                                            {issue.severity}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{issue.detail}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
                                <CheckCircle className="h-8 w-8 text-accent" />
                                <p className="text-sm font-medium">No major issues found!</p>
                                <p className="text-xs text-muted-foreground">Great job keeping the code clean.</p>
                            </div>
                        )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot /> AI Refactoring Suggestions
                    </CardTitle>
                    <CardDescription>
                      The AI Guardian's explanation of the identified issues and how to resolve them.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-background/50 p-4 font-body">
                      <p>{state.result.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <GitCommitSimulator score={state.result.score} />
              </>
            )}
            
            {state.status === 'loading' && (
                <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <h2 className="text-xl font-semibold">Guardian is Thinking...</h2>
                    <p className="max-w-md text-muted-foreground">
                        Analyzing Abstract Syntax Tree, calculating complexity, and consulting with the local AI. Please wait.
                    </p>
                </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
