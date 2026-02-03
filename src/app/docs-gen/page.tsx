'use client';

import { useState } from 'react';
import { generateDocumentation, type GenerateDocumentationOutput } from '@/ai/flows/generate-documentation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileText, Copy, Sparkles, Wand2, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function DocsGenPage() {
    const { toast } = useToast();
    const [code, setCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<GenerateDocumentationOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!code || code.length < 10) {
            toast({ variant: "destructive", title: "Code too short", description: "Please enter at least 10 characters of code." });
            return;
        }

        setIsGenerating(true);
        setError(null);
        try {
            const data = await generateDocumentation({ code });
            setResult(data);
        } catch (err: any) {
            console.error("Documentation generation failed:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <main className="flex-1 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ChevronLeft className="h-4 w-4" /> Back to Home
                        </Link>
                        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-2">
                            <FileText className="text-primary" /> AI Documentation Generator
                        </h1>
                        <p className="text-muted-foreground">
                            Instantly generate professional JSDoc/TSDoc for your source code.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" /> Input Code
                                </CardTitle>
                                <CardDescription>
                                    Paste the code block you want to document.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="paste function or class here..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="min-h-[400px] font-code text-[13px] leading-relaxed bg-transparent"
                                />
                                <Button 
                                    onClick={handleGenerate} 
                                    disabled={isGenerating || !code} 
                                    className="w-full mt-4"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating Docs...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2 h-4 w-4" />
                                            Generate Documentation
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        {isGenerating ? (
                             <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[500px] bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <h2 className="text-xl font-semibold">Writing Documentation...</h2>
                                <p className="max-w-md text-muted-foreground">
                                    The AI is analyzing your code's intent and drafting professional comments.
                                </p>
                            </Card>
                        ) : result ? (
                            <>
                                <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary shadow-lg shadow-primary/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary" /> Documented Code
                                        </CardTitle>
                                        <CardDescription>
                                            Code with professional JSDoc/TSDoc comments added.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative">
                                            <Textarea
                                                readOnly
                                                value={result.documentedCode}
                                                className="min-h-[400px] font-code text-[13px] leading-relaxed bg-transparent"
                                            />
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                                navigator.clipboard.writeText(result.documentedCode);
                                                toast({ title: "Documented code copied!" });
                                            }}>
                                                <Copy className="h-4 w-4" />
                                                <span className="sr-only">Copy</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg">AI Explanation</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{result.explanation}</p>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[500px] bg-card/70 backdrop-blur-xl border-border/50 border-dashed">
                                <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                                <h2 className="text-xl font-semibold text-muted-foreground">No Result Yet</h2>
                                <p className="max-w-md text-muted-foreground/60">
                                    Enter some code on the left and click generate to see the documented version.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
