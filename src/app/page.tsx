'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, Code } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <main className="flex-1">
       <section className="py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                    AI-Powered Analysis
                 </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                  Your Guardian for Clean and Efficient Code
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                  Get instant analysis, technical debt scoring, and intelligent refactoring suggestions to write clean, efficient, and secure code.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <Button asChild size="lg">
                  <Link href="/analyzer">
                    Start Analyzing
                  </Link>
                </Button>
                 <Button asChild size="lg" variant="outline">
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
             <div className="relative w-full h-64 mx-auto overflow-hidden rounded-xl sm:w-full lg:h-auto lg:order-last animate-in fade-in zoom-in-50 duration-500 delay-200">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                        priority
                    />
                )}
             </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CodeGuardian provides a powerful suite of tools to enhance your development workflow.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 text-center flex flex-col items-center">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Instant Code Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Get a comprehensive analysis of your code in seconds, including a technical debt score and a list of code smells.
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 text-center flex flex-col items-center">
              <CardHeader className="items-center">
                <div className="p-4 bg-accent/10 rounded-full">
                    <ShieldCheck className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="mt-4">AI-Powered Refactoring</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Leverage generative AI to automatically refactor your code, improving readability, performance, and maintainability.
              </CardContent>
            </Card>
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5 text-center flex flex-col items-center">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Code className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Git Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Simulate a pre-commit hook that prevents bad code from being committed based on its quality score.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
