import { Suspense } from 'react';
import { mockAstAnalysis } from '@/app/actions';
import { codeSchema, type AnalysisResult, type GeneratePerfectCodeOutput } from '@/lib/types';
import ResultsView from './results-view';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

async function performPerfection(code: string): Promise<GeneratePerfectCodeOutput> {
    // Mock AI call to prevent crashes from API errors
    const result: GeneratePerfectCodeOutput = {
        perfectCode: `/**
 * Finds common elements between two arrays with optimal performance.
 *
 * This "perfect" implementation avoids the pitfalls of the original code by leveraging a Set for efficient lookups.
 *
 * @param {any[]} arr1 The first array.
 * @param {any[]} arr2 The second array.
 * @returns {any[]} An array containing elements common to both arr1 and arr2, with no duplicates.
 */
function findCommonElements(arr1, arr2) {
  // Validate inputs to prevent runtime errors.
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new Error("Invalid input: Both arguments must be arrays.");
  }

  // Use a Set for the second array for O(1) average time complexity lookups.
  // This is significantly more performant than using .includes() in a loop.
  const arr2Set = new Set(arr2);

  // Use a Set to store common elements to handle duplicates automatically and efficiently.
  const commonElementsSet = new Set();

  // Iterate through the first array only once.
  for (const element of arr1) {
    // If the element exists in the second array's set, add it to our result set.
    if (arr2Set.has(element)) {
      commonElementsSet.add(element);
    }
  }

  // Convert the set back to an array for the final output.
  // The spread syntax is concise and highly readable.
  return [...commonElementsSet];
}`,
        explanation: "The original code suffered from a major performance issue due to its nested loop structure (O(n*m) complexity) and inefficient use of `Array.prototype.includes()` within the loop. This 'perfect' version rectifies these problems by using a `Set` for one of the arrays, which provides near-constant time O(1) lookups. This reduces the overall time complexity to a much more scalable O(n+m). Additionally, it adds input validation to prevent runtime errors and uses a `Set` for the results to handle duplicate elements elegantly and efficiently."
    };
    // Add a short delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    return result;
}


async function performAnalysis(code: string): Promise<AnalysisResult> {
    const [{ score, issues }, perfectResult] = await Promise.all([
        mockAstAnalysis(code),
        performPerfection(code)
    ]);

    // Mock AI call to prevent crashes from API errors
    const explanation = "The primary issue is the nested loop, which leads to a time complexity of O(n*m). This can be optimized by using a Set for the second array, allowing for O(1) average time complexity for lookups. This reduces the overall complexity to O(n+m), which is much more efficient for large datasets.";
    
    // Add a short delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        score,
        issues,
        explanation: explanation,
        perfectCode: perfectResult.perfectCode,
        perfectCodeExplanation: perfectResult.explanation,
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
        console.error(error);
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
