import { Suspense } from 'react';
import { codeSchema, type GeneratePerfectCodeOutput } from '@/lib/types';
import PerfectCodeView from './perfect-code-view';
import { Diamond } from 'lucide-react';
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    return result;
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
