'use client';

import type { GeneratePerfectCodeOutput } from '@/ai/flows/generate-perfect-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Copy, Diamond, FileCode2 } from 'lucide-react';
import Link from 'next/link';

type PerfectCodeViewProps = {
  code: string;
  result: GeneratePerfectCodeOutput;
}

export default function PerfectCodeView({ code, result }: PerfectCodeViewProps) {
    const { toast } = useToast();

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-yellow-400">
                    Behold, Perfect Code
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    The AI has delivered a masterclass in software engineering.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Original Code */}
                <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle className="flex items-center gap-2">
                                <FileCode2 /> Original Code
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
                            The humble beginnings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            name="code"
                            readOnly
                            value={code}
                            className="min-h-[300px] font-code text-[13px] leading-relaxed bg-transparent"
                        />
                    </CardContent>
                </Card>

                {/* Perfect Code */}
                 <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary shadow-lg shadow-primary/10">
                    <CardHeader>
                         <div className='flex items-center justify-between'>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Diamond /> Perfect Code
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => {
                                navigator.clipboard.writeText(result.perfectCode);
                                toast({ title: "Perfect code copied!" });
                            }}>
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Copy perfect code</span>
                            </Button>
                        </div>
                        <CardDescription>
                            The optimized and flawless version.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            readOnly
                            value={result.perfectCode}
                            className="min-h-[300px] font-code text-[13px] leading-relaxed bg-transparent"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Explanation */}
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot /> AI's Divine Explanation
                    </CardTitle>
                    <CardDescription>
                        Why this code is now perfect, according to the AI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border/50 bg-background/50 p-4 font-body relative">
                      <p>{result.explanation}</p>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                          navigator.clipboard.writeText(result.explanation);
                          toast({ title: "Explanation copied to clipboard!" });
                        }}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy explanation</span>
                      </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                 <Button asChild variant="outline">
                    <Link href="/analyzer">Analyze Another Snippet</Link>
                </Button>
            </div>
        </div>
    )
}
