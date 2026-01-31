'use client';

import { useState, useMemo, type FC, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeCode, getRefactoredCode, type AnalysisState, type RefactorState } from '@/app/actions';
import { AlertTriangle, Bot, CheckCircle, Code, Copy, FileCode2, Frown, Github, Loader2, ShieldCheck, Sparkles, Wand2, XCircle } from 'lucide-react';
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

const analysisInitialState: AnalysisState = { status: 'idle' };
const refactorInitialState: RefactorState = { status: 'idle' };

const initialCode = `function findCommonElements(arr1, arr2) {
  const commonElements = [];
  // This nested loop is inefficient (O(n*m)) and can be optimized.
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
  return commonElements;
}`;

const exampleSnippets = [
  {
    title: 'Inefficient Loop',
    code: initialCode
  },
  {
    title: 'Complex Conditionals',
    code: `function getDiscount(user) {
  let discount = 0;
  if (user.isVip) {
    discount = 0.2;
  } else {
    if (user.purchaseHistory.length > 10) {
      if (user.accountAge > 2) {
        discount = 0.1;
      }
    } else {
      discount = 0;
    }
  }
  return discount;
}`
  },
    {
    title: 'Long Function',
    code: `function processOrder(order) {
    // Validate order
    if (!order.id || !order.items || order.items.length === 0) {
        console.error("Invalid order data");
        return;
    }

    // Connect to database
    console.log("Connecting to database...");

    // Fetch user
    const user = { id: order.userId, name: "John Doe" };
    console.log("User fetched:", user.name);

    let totalPrice = 0;
    for(const item of order.items) {
        totalPrice += item.price * item.quantity;
    }
    console.log("Total price calculated:", totalPrice);

    // Apply discount
    if (user.isVip) {
        totalPrice *= 0.9;
        console.log("VIP discount applied");
    }

    // Check inventory
    for(const item of order.items) {
        console.log("Checking stock for item:", item.name);
        // imagine stock checking logic here
    }

    // Create payment
    console.log("Processing payment...");
    
    // Send confirmation email
    console.log("Sending confirmation email...");

    // Disconnect from database
    console.log("Disconnecting from database...");

    console.log("Order processed successfully");
    return { success: true, totalPrice };
}`
  }
];

const ExampleSnippets: FC<{ onSelect: (code: string) => void }> = ({ onSelect }) => (
  <Card className="mb-8 bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Code />
        Try an Example
      </CardTitle>
      <CardDescription>
        Not sure what to analyze? Start with one of these snippets.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-2">
      {exampleSnippets.map((snippet) => (
        <Button
          key={snippet.title}
          variant="outline"
          size="sm"
          onClick={() => onSelect(snippet.code)}
        >
          {snippet.title}
        </Button>
      ))}
    </CardContent>
  </Card>
);

const AnalyzeButton = () => {
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

export default function AnalyzerPage() {
  const { toast } = useToast();
  const [code, setCode] = useState(initialCode);
  const [analysisState, analysisAction] = useActionState(analyzeCode, analysisInitialState);
  const [refactorState, refactorAction] = useActionState(getRefactoredCode, refactorInitialState);


  const severityColor = (severity: 'High' | 'Medium' | 'Low') => {
    switch (severity) {
      case 'High': return 'border-destructive/80 text-destructive';
      case 'Medium': return 'border-yellow-400/80 text-yellow-400';
      case 'Low': return 'border-sky-400/80 text-sky-400';
      default: return 'border-secondary';
    }
  }
  
  const handleAnalysisFormAction = (formData: FormData) => {
    refactorInitialState.status = 'idle'; // Reset refactor state
    analysisAction(formData);
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Meet Your AI <span className="text-primary">Code Guardian</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Leverage a hybrid static and generative AI system to analyze, score, and improve your code's quality, performance, and maintainability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
            <ExampleSnippets onSelect={setCode} />
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className="flex items-center gap-2">
                      <FileCode2 /> Code to Analyze
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
                    Paste your source code below, or use an example, to have it analyzed.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form action={handleAnalysisFormAction}>
                    <Textarea
                      name="code"
                      placeholder="Enter your code here..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-[300px] font-code text-[13px] leading-relaxed bg-transparent"
                      required
                    />
                    <div className="mt-4">
                      <AnalyzeButton />
                    </div>
                </form>
                </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-8">
              {analysisState.status === 'idle' && (
              <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px] bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                  <div className="rounded-full bg-primary/10 p-4">
                  <Bot className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Awaiting Analysis</h2>
                  <p className="max-w-md text-muted-foreground">
                  Your code analysis report will appear here. The AI Guardian is ready to review your code for quality, performance, and maintainability.
                  </p>
              </Card>
              )}

              {analysisState.status === 'error' && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>
                        {analysisState.error || "An unknown error occurred. Please try again."}
                    </AlertDescription>
                </Alert>
              )}

              {analysisState.status === 'success' && analysisState.result && (
              <>
                  <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                    <CardHeader>
                        <CardTitle>Analysis Report</CardTitle>
                        <CardDescription>
                        A summary of code quality metrics and identified issues.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex items-center justify-center rounded-lg bg-background/50 p-4">
                          <ScoreChart score={analysisState.result.score} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-center md:text-left">Identified Code Smells</h3>
                            {analysisState.result.issues.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {analysisState.result.issues.map((issue, index) => (
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
                                    <p className="text-sm font-medium">No major issues found!</p>
                                    <p className="text-xs text-muted-foreground">Great job keeping the code clean.</p>
                                </div>
                            )}
                        </div>
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
                          <p>{analysisState.result.explanation}</p>
                          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                              navigator.clipboard.writeText(analysisState.result?.explanation || '');
                              toast({ title: "Explanation copied to clipboard!" });
                            }}>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy explanation</span>
                          </Button>
                        </div>
                        <form action={refactorAction} className="mt-4">
                          <input type="hidden" name="code" value={code} />
                          <input type="hidden" name="analysis" value={JSON.stringify(analysisState.result.issues)} />
                          <AutoRefactorButton />
                        </form>
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
                  
                  <GitCommitSimulator score={analysisState.result.score} />
              </>
              )}
              
              {analysisState.status === 'loading' && (
                  <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px] bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <h2 className="text-xl font-semibold">Guardian is Thinking...</h2>
                      <p className="max-w-md text-muted-foreground">
                          Analyzing Abstract Syntax Tree, calculating complexity, and consulting with the local AI. Please wait.
                      </p>
                  </Card>
              )}
          </div>
          </div>
      </div>
    </main>
  );
}
