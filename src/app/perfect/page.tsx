import { Suspense } from 'react';
import Link from 'next/link';
import { codeSchema, type GeneratePerfectCodeOutput } from '@/lib/types';
import PerfectView from './perfect-view';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePerfectCode } from '@/ai/flows/generate-perfect-code';

async function performPerfection(code: string): Promise<GeneratePerfectCodeOutput> {
    const result = await generatePerfectCode({ code });
    return result;
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
        console.error(error);
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
