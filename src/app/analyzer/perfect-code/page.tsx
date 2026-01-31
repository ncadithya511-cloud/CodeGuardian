import { Suspense } from 'react';
import { codeSchema, type GeneratePerfectCodeOutput } from '@/lib/types';
import PerfectCodeView from './perfect-code-view';
import { Diamond, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

async function performPerfection(code: string): Promise<GeneratePerfectCodeOutput> {
    // MOCK AI CALL
    const mockResult: GeneratePerfectCodeOutput = {
      perfectCode: `// This is a mock of "perfect" code.
function findCommonElementsOptimized(arr1, arr2) {
  const set1 = new Set(arr1);
  const commonElements = new Set();
  for (const element of arr2) {
    if (set1.has(element)) {
      commonElements.add(element);
    }
  }
  return Array.from(commonElements);
}`,
      explanation: "This is a mock explanation. The original code's nested loops resulted in O(n*m) complexity. This 'perfect' version uses a Set for O(1) average time complexity lookups, reducing the overall complexity to O(n+m), which is significantly more performant for large datasets. It is also more readable and maintainable."
    };
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return mockResult;
}

export default function PerfectCodePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
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
                <PerfectionResults code={validation.data} />
            </Suspense>
        </main>
    );
}

async function PerfectionResults({ code }: { code: string }) {
    try {
        const result = await performPerfection(code);
        return <PerfectCodeView code={code} result={result} />;
    } catch (error) {
        console.error(error);
        return (
             <div className="mx-auto max-w-3xl">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Perfection Failed</AlertTitle>
                    <AlertDescription>
                        An unexpected error occurred during the perfection process. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }
}

function LoadingState() {
    return (
        <div className="mx-auto max-w-3xl">
            <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px] bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                <Diamond className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Crafting Perfection...</h2>
                <p className="max-w-md text-muted-foreground">
                    The AI is transcending mortal programming paradigms to forge the ultimate code. This may take a moment.
                </p>
            </Card>
        </div>
    )
}
