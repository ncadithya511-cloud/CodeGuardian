import { Suspense } from 'react';
import Link from 'next/link';
import { codeSchema, type GeneratePerfectCodeOutput } from '@/lib/types';
import PerfectView from './perfect-view';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function performPerfection(code: string): Promise<GeneratePerfectCodeOutput> {
    // MOCK IMPLEMENTATION to prevent API errors
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    return {
        perfectCode: `/**
 * @function findCommonElementsFlawless
 * @description Finds common elements between two arrays with optimal performance and robust validation.
 * This implementation is "perfect" because:
 * 1.  **Optimal Performance (O(n + m))**: It uses a Set for the lookup table, providing O(1) average time complexity for checks.
 * 2.  **Input Validation**: It rigorously checks if inputs are actual arrays, preventing runtime errors.
 * 3.  **Memory Efficiency**: It uses a Set to store common elements to prevent duplicates from the second array.
 * 4.  **Clarity & Readability**: The code is well-structured with clear variable names and comments.
 * 5.  **No Side Effects**: It returns a new array, preserving the original input arrays.
 * 
 * @param {Array<any>} arr1 The first array.
 * @param {Array<any>} arr2 The second array.
 * @returns {Array<any>} An array containing elements common to both arr1 and arr2.
 * @throws {TypeError} If either input is not an array.
 */
function findCommonElementsFlawless(arr1, arr2) {
  // 1. Robust Input Validation
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new TypeError("Both inputs must be arrays.");
  }

  // 2. Optimal Data Structure for Lookups
  const lookupSet = new Set(arr1);
  const commonElements = new Set();

  // 3. Single Pass Through Second Array
  for (const element of arr2) {
    if (lookupSet.has(element)) {
      commonElements.add(element);
    }
  }

  // 4. Return Clean, Unique Array
  return Array.from(commonElements);
}`,
        explanation: 'This is a mock response for "perfect" code. This version is superior due to its O(n+m) time complexity achieved by using a Set for lookups, comprehensive input validation to prevent runtime errors, and clear, commented code that is highly maintainable. It avoids the performance pitfalls of nested loops entirely.'
    };
}


export default function PerfectCodePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    const code = typeof searchParams.code === 'string' ? searchParams.code : '';

    const validation = codeSchema.safeParse(code);

    if (!validation.success) {
        return (
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-4xl text-center">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Invalid Input</AlertTitle>
                        <AlertDescription>
                            The provided code was not valid. Please go back and try again.
                        </AlertDescription>
                    </Alert>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/analyzer"><Home className="mr-2" /> Go Back to Analyzer</Link>
                    </Button>
                </div>
            </main>
        )
    }
    
    return (
        <main className="flex-1 p-4 md:p-8">
            <Suspense fallback={<LoadingState />}>
                {/* @ts-expect-error Async Server Component */}
                <PerfectCodeResults code={validation.data} />
            </Suspense>
        </main>
    );
}

async function PerfectCodeResults({ code }: { code: string }) {
    try {
        const perfectResult = await performPerfection(code);
        return <PerfectView originalCode={code} perfectCodeResult={perfectResult} />;
    } catch (error) {
        return (
             <div className="mx-auto max-w-4xl">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Generation Failed</AlertTitle>
                    <AlertDescription>
                        An unexpected error occurred while generating the perfect code. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }
}

function LoadingState() {
    return (
        <div className="mx-auto max-w-4xl">
            <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px] bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Crafting Perfection...</h2>
                <p className="max-w-md text-muted-foreground">
                    The AI Guardian is rewriting your code to be flawless. This requires intense digital focus. Please wait.
                </p>
            </Card>
        </div>
    )
}
