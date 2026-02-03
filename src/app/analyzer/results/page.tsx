
import { Suspense } from 'react';
import { codeSchema, type AnalysisResult } from '@/lib/types';
import ResultsView from './results-view';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { analyzeCodeQuality } from '@/ai/flows/analyze-code-quality';
import { generateCodeExplanations } from '@/ai/flows/generate-code-explanations';
import { securityAnalysis } from '@/ai/flows/security-analysis';

async function performAnalysis(code: string): Promise<AnalysisResult> {
    const [qualityResult, securityResult] = await Promise.all([
        analyzeCodeQuality({ code }),
        securityAnalysis({ code }),
    ]);

    const issues = qualityResult.issues;
    const score = qualityResult.score;
    const securityVulnerabilities = securityResult.vulnerabilities;

    let explanation = 'Excellent work! The code appears to be clean and secure.';
    if (issues.length > 0 || securityVulnerabilities.length > 0) {
        try {
            const explanationResult = await generateCodeExplanations({
                code,
                analysis: JSON.stringify({ issues, securityVulnerabilities }, null, 2),
            });
            explanation = explanationResult.explanation;
        } catch (e) {
            explanation = "Could not generate an AI explanation. Please review the issues manually.";
        }
    }
    
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
                        <AlertDescription>The provided code was not valid.</AlertDescription>
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
    } catch (error: any) {
        // Detailed error extraction for debugging
        const errorDetail = error instanceof Error ? error.message : JSON.stringify(error);
        
        return (
             <div className="mx-auto max-w-3xl">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>
                        <p className="font-semibold">Error Detail:</p>
                        <code className="text-xs block mt-2 bg-background/50 p-2 rounded">{errorDetail}</code>
                        <p className="mt-4">This usually indicates the AI service (Gemini) is unreachable or your API key is invalid. Please check your GOOGLE_GENAI_API_KEY environment variable.</p>
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
                <Card className="h-[400px] animate-pulse" />
                <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px] bg-card/70 backdrop-blur-xl border-border/50">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <h2 className="text-xl font-semibold text-primary">Guardian is Thinking...</h2>
                    <p className="max-w-md text-muted-foreground">Consulting Gemini 1.5 Flash for deep architectural analysis.</p>
                </Card>
            </div>
        </div>
    )
}
