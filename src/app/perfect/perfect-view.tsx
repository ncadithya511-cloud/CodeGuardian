'use client';

import type { GeneratePerfectCodeOutput } from '@/lib/types';
import { Diamond, FileCode2, Copy, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type PerfectViewProps = {
  originalCode: string;
  perfectCodeResult: GeneratePerfectCodeOutput;
}

export default function PerfectView({ originalCode, perfectCodeResult }: PerfectViewProps) {
    const { toast } = useToast();

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-2"><Diamond className="text-primary"/>"Perfect" Code</h1>
                    <p className="text-muted-foreground">
                        The AI's attempt at a flawless version of your code.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/analyzer">Analyze Another Snippet</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="flex flex-col gap-8">
                    <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCode2 /> Original Code
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => {
                                    navigator.clipboard.writeText(originalCode);
                                    toast({ title: "Code copied to clipboard!" });
                                }}>
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy code</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={originalCode}
                                className="min-h-[400px] font-code text-[13px] leading-relaxed bg-transparent"
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-8">
                     <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary shadow-lg shadow-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles /> Explanation
                            </CardTitle>
                             <CardDescription>
                                Why this version is considered "perfect".
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border/50 bg-background/50 p-4 font-body mb-4 relative">
                                <p>{perfectCodeResult.explanation}</p>
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                    navigator.clipboard.writeText(perfectCodeResult.explanation);
                                    toast({ title: "Explanation copied!" });
                                }}>
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy explanation</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary shadow-lg shadow-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Diamond /> Perfect Code
                            </CardTitle>
                             <CardDescription>
                                The generated flawless code.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Textarea
                                    readOnly
                                    value={perfectCodeResult.perfectCode}
                                    className="min-h-[300px] font-code text-[13px] leading-relaxed bg-transparent"
                                />
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                    navigator.clipboard.writeText(perfectCodeResult.perfectCode);
                                    toast({ title: "Perfect code copied!" });
                                }}>
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy perfect code</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
