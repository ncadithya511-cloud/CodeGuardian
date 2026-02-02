'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useFirebase, useCollection, useMemoFirebase, type WithId } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, AlertCircle, FileCode2, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Issue, SecurityVulnerability } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AnalysisDoc {
    technicalDebtScore: number;
    timestamp: Timestamp;
    issues: Issue[];
    securityVulnerabilities?: SecurityVulnerability[];
}

const scoreColor = (score: number) => {
    if (score >= 80) return 'bg-accent/20 text-accent';
    if (score >= 50) return 'bg-yellow-400/20 text-yellow-400';
    return 'bg-destructive/20 text-destructive';
};

export default function HistoryPage() {
    const { user, firestore, isUserLoading } = useFirebase();

    const analysesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/code_analyses`),
            orderBy('timestamp', 'desc')
        );
    }, [user, firestore]);

    const { data: analyses, isLoading, error } = useCollection<AnalysisDoc>(analysesQuery);

    const renderContent = () => {
        if (isUserLoading || (isLoading && !analyses)) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <h2 className="text-xl font-semibold">Loading Analysis History...</h2>
                    <p className="max-w-md text-muted-foreground">
                        Please wait while we fetch your past reports.
                    </p>
                </div>
            );
        }

        if (error) {
            return (
                <Card className="bg-destructive/10 border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle /> Error Loading History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive/80">Could not fetch your analysis history. You may not have the required permissions.</p>
                    </CardContent>
                </Card>
            );
        }
        
        if (!analyses || analyses.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[400px] border-2 border-dashed rounded-lg">
                    <FileCode2 className="h-12 w-12 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">No History Found</h2>
                    <p className="max-w-md text-muted-foreground">
                        You haven't analyzed any code yet. Get started now!
                    </p>
                     <Button asChild>
                        <Link href="/analyzer">Analyze Code</Link>
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid gap-6">
                {analyses.map((analysis) => {
                    const hasCritical = analysis.securityVulnerabilities?.some(v => v.severity === 'Critical');
                    return (
                        <Link href={`/history/${analysis.id}`} key={analysis.id}>
                            <Card className="hover:border-primary/80 hover:bg-card-foreground/5 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1.5">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {hasCritical && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <ShieldAlert className="h-5 w-5 text-red-500" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Critical vulnerability detected!</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                                Analysis from {analysis.timestamp?.toDate().toLocaleString()}
                                            </CardTitle>
                                            <CardDescription>
                                                Found {analysis.issues.length} issues. Click to view the full report.
                                            </CardDescription>
                                        </div>
                                        <div className={`flex items-center justify-center font-bold text-lg size-16 rounded-full ${scoreColor(analysis.technicalDebtScore)}`}>
                                            {analysis.technicalDebtScore}
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        );
    }


    return (
        <main className="flex-1 p-4 md:p-8">
            <div className="mx-auto max-w-4xl">
                 <div className="mb-8">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Analysis History</h1>
                    <p className="text-muted-foreground">
                        Review your past code analysis reports.
                    </p>
                </div>
                {renderContent()}
            </div>
        </main>
    );
}
