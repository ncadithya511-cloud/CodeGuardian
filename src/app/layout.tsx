import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Github, History, ShieldCheck, FileText, LayoutDashboard } from 'lucide-react';
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
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <h1 className="font-headline text-2xl font-semibold tracking-tight">CodeGuardian</h1>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/analyzer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Analyzer
                </Link>
                <Link href="/docs-gen" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Docs Gen
                </Link>
                <Link href="/history" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                  <a href="https://github.com/FirebaseExtended/firebase-studio-prototypers" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="md:hidden">
                    <Link href="/history">
                      <History className="h-4 w-4" />
                      <span className="sr-only">History</span>
                    </Link>
                </Button>
              </div>
            </header>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
