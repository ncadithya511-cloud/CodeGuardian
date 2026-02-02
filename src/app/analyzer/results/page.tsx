import { Suspense } from 'react';
import { mockAstAnalysis } from '@/app/actions';
import { codeSchema, type AnalysisResult } from '@/lib/types';
import ResultsView from './results-view';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

async function performAnalysis(code: string): Promise<AnalysisResult> {
    const { score, issues } = await mockAstAnalysis(code);

    // MOCK IMPLEMENTATION to prevent API errors
    const explanation = "This is a mock AI explanation. The original code uses nested loops and `includes`, which is inefficient. A better approach is to use a `Set` for faster lookups to optimize performance from O(n*m) to O(n+m).";
    
    const securityVulnerabilities = [
        {
            "title": "Potential Cross-Site Scripting (XSS)",
            "detail": "The application appears to render user-provided content without proper sanitization. An attacker could inject malicious scripts that would be executed by other users' browsers. Always sanitize user input before rendering it in the DOM.",
            "cwe": "CWE-79",
            "severity": "High" as const
        },
        {
            "title": "Hardcoded Secret/API Key",
            "detail": "A value that looks like a hardcoded API key or secret was found. Storing secrets directly in source code is highly insecure. Use environment variables or a secret management service.",
            "cwe": "CWE-798",
            "severity": "Critical" as const
        }
    ];

    return {
        score,
        issues,
        explanation,
        securityVulnerabilities,
    };
}

export default function ResultsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    const code = typeof searchParams.code === 'string' ? searchParams.code : '';

    const validation = codeSchema.safeParse(code);

    if (!validation.success) {
        return (
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-3xl">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Invalid Input</AlertTitle>
                        <AlertDescription>
                            The provided code was not valid. Please go back and try again.
                        </AlertDescription>
                    </Alert>
                </div>
            </main>
        )
    }
    
    return (
        <main className="flex-1 p-4 md:p-8">
            <Suspense fallback={<LoadingState />}>
                {/* @ts-expect-error Async Server Component */}
                <AnalysisResults code={validation.data} />
            </Suspense>
        </main>
    );
}

async function AnalysisResults({ code }: { code: string }) {
    try {
        const analysisResult = await performAnalysis(code);
        return <ResultsView code={code} analysisResult={analysisResult} />;
    } catch (error) {
        return (
             <div className="mx-auto max-w-3xl">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>
                        An unexpected error occurred during analysis. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }
}

function LoadingState() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-8">
                    {/* Placeholder for original code card */}
                    <Card className="h-[400px] animate-pulse" />
                </div>
                 <div className="flex flex-col gap-8">
                    <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px] bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <h2 className="text-xl font-semibold">Guardian is Thinking...</h2>
                        <p className="max-w-md text-muted-foreground">
                            Analyzing Abstract Syntax Tree, calculating complexity, and consulting with the local AI. Please wait.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
