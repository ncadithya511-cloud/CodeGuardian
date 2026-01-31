import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Github, ShieldCheck } from 'lucide-react';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'CodeGuardian',
  description: 'A Hybrid Static-AI System for Algorithmic Optimization and Code Integrity',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
              <Link href="/" className="flex items-center gap-2">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <h1 className="font-headline text-2xl font-semibold">CodeGuardian</h1>
              </Link>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/FirebaseExtended/firebase-studio-prototypers" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            </header>
            {children}
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
