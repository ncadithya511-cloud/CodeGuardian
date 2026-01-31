import { Suspense } from 'react';
import { codeSchema, type GeneratePerfectCodeOutput } from '@/lib/types';
import PerfectCodeView from './perfect-code-view';
import { Diamond, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

async function performPerfection(code: string): Promise<GeneratePerfectCodeOutput> {
    // Mocking the AI call to prevent crashes
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResult = {
        perfectCode: `/**
 * @function findUniqueCommonElements
 * @description Finds common elements between two arrays with optimal performance.
 * @param {any[]} arr1 - The first array.
 * @param {any[]} arr2 - The second array.
 * @returns {any[]} An array of unique common elements.
 */
const findUniqueCommonElements = (arr1, arr2) => {
  // A Set provides O(1) average time complexity for lookups.
  const set1 = new Set(arr1);
  
  // Use a Set for the result to handle duplicates in arr2 efficiently.
  const commonElementsSet = new Set();
  
  // Single loop over the second array is O(m).
  for (const element of arr2) {
    if (set1.has(element)) {
      commonElementsSet.add(element);
    }
  }
  
  // Convert the Set back to an array.
  return Array.from(commonElementsSet);
};`,
        explanation: "This is a mocked 'perfect code' response. It demonstrates optimal performance by leveraging Sets for O(1) lookups, avoiding nested loops entirely. The code is also more readable, includes type annotations (via JSDoc), and is structured for clarity and maintainability. This approach is significantly more scalable than the original O(n*m) implementation."
    };
    
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
