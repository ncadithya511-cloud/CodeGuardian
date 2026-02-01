'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, Code } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1">
       <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--primary-rgb),0.1),_transparent_40%)] z-0"></div>
        
        <div className="container px-4 md:px-6 z-10">
            <div className="grid gap-6 lg:grid-cols-1 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-4">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            AI-Powered Analysis
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none font-headline animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            Ship Flawless Code, Faster.
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-250">
                            CodeGuardian is your AI partner for writing clean, efficient, and secure code. Get instant analysis, debt scoring, and intelligent refactoring.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-350">
                        <Button asChild size="lg">
                            <Link href="/analyzer">
                                Analyze Code Now
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="#features">
                                Explore Features
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Features</h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CodeGuardian provides a powerful suite of tools to enhance your development workflow.
              </p>
            </div>
          </div>
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-8 py-12">
            <Card className="w-full bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 sm:w-80">
                <CardHeader className="items-center text-center gap-2 p-4">
                    <div className="p-3 bg-primary/10 rounded-full w-fit h-fit">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Instant Code Analysis</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground text-center">
                    Get a comprehensive analysis of your code in seconds, including a technical debt score and a list of code smells.
                    </p>
              </CardContent>
            </Card>
            <Card className="w-full bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 sm:w-80">
                <CardHeader className="items-center text-center gap-2 p-4">
                    <div className="p-3 bg-primary/10 rounded-full w-fit h-fit">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">AI-Powered Refactoring</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground text-center">
                    Leverage generative AI to automatically refactor your code, improving readability, performance, and maintainability.
                    </p>
              </CardContent>
            </Card>
            <Card className="w-full bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 sm:w-80">
                <CardHeader className="items-center text-center gap-2 p-4">
                    <div className="p-3 bg-primary/10 rounded-full w-fit h-fit">
                        <Code className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Git Integration</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground text-center">
                    Simulate a pre-commit hook that prevents bad code from being committed based on its quality score.
                    </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
