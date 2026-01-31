'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, Code } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center p-4 md:p-8">
      <div className="flex flex-col items-center justify-center">
        <ShieldCheck className="w-24 h-24 text-primary mb-4 animate-in fade-in zoom-in-50 duration-500" />
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          Welcome to CodeGuardian
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          Your AI-powered partner for writing clean, efficient, and secure code. Get instant analysis, technical debt scoring, and intelligent refactoring suggestions.
        </p>
        <Link href="/analyzer" passHref>
          <Button size="lg" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            Start Analyzing Your Code
          </Button>
        </Link>

        <div className="mt-20 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-5 duration-500 delay-400">
          <h2 className="text-3xl font-bold font-headline mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 text-left">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Instant Code Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                Get a comprehensive analysis of your code in seconds, including a technical debt score and a list of code smells.
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 text-left">
              <CardHeader className="items-center">
                <div className="p-4 bg-accent/10 rounded-full">
                    <ShieldCheck className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="mt-4">AI-Powered Refactoring</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                Leverage generative AI to automatically refactor your code, improving readability, performance, and maintainability.
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 text-left">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Code className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Git Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                Simulate a pre-commit hook that prevents bad code from being committed based on its quality score.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
