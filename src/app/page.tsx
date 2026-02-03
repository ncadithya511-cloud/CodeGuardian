'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, Code, History, Diamond, ShieldAlert, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1">
       <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--primary-rgb),0.1),_transparent_40%)] z-0"></div>
        
        <div className="container mx-auto px-4 md:px-6 z-10">
            <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        AI-Powered Engineering
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none font-headline animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                        Unlock Peak Code Quality with <span className="text-primary">AI</span>.
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-250">
                        Your partner for writing clean, efficient, and secure code. Get instant analysis, debt scoring, security scans, and professional documentation.
                    </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-350">
                    <Button asChild size="lg">
                        <Link href="/analyzer">
                            Analyze Code Now
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/docs-gen">
                            Generate Documentation
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">The CodeGuardian Suite</h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
                Comprehensive tools to enhance your development workflow and maintain code integrity.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader className="items-center text-center gap-3 p-6">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Instant Analysis</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Get deep insights into complexity, performance, and best practices with a quantifiable Technical Debt Score.
                    </p>
                    <Button variant="link" asChild className="mt-4">
                        <Link href="/analyzer">Start Scan</Link>
                    </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-destructive/5 transition-all">
                <CardHeader className="items-center text-center gap-3 p-6">
                    <div className="p-2.5 bg-destructive/10 rounded-xl">
                        <ShieldAlert className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-xl">Security Scan</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Harden your code with AI scans for OWASP vulnerabilities and security misconfigurations.
                    </p>
                     <Button variant="link" asChild className="mt-4">
                        <Link href="/analyzer">Check Safety</Link>
                    </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader className="items-center text-center gap-3 p-6">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">AI Docs Gen</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Automatically generate professional JSDoc/TSDoc for any code block in seconds.
                    </p>
                    <Button variant="link" asChild className="mt-4">
                        <Link href="/docs-gen">Generate Docs</Link>
                    </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader className="items-center text-center gap-3 p-6">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Intelligent Refactor</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Leverage generative AI to automatically refactor your code for maximum clarity and efficiency.
                    </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader className="items-center text-center gap-3 p-6">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Diamond className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">"Perfect" Mode</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        See the AI's version of a 100% debt-free, production-ready implementation of your code.
                    </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader className="items-center text-center gap-3 p-6">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <History className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Report History</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Every analysis is saved. Track your code quality improvements and maintain a record of your progress.
                    </p>
                     <Button variant="link" asChild className="mt-4">
                        <Link href="/history">View History</Link>
                    </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
