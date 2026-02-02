'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFirebase, useDoc, useMemoFirebase, type WithId } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { Loader2, AlertCircle } from 'lucide-react';
import ResultsView from '@/app/analyzer/results/results-view';
import type { Issue, AnalysisResult, SecurityVulnerability } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AnalysisDoc {
    technicalDebtScore: number;
    timestamp: Timestamp;
    issues: Issue[];
    code: string;
    explanation: string;
    securityVulnerabilities: SecurityVulnerability[];
}

export default function HistoricAnalysisPage() {
    const params = useParams();
    const analysisId = params.analysisId as string;
    const { user, firestore, isUserLoading } = useFirebase();

    const analysisDocRef = useMemoFirebase(() => {
        if (!user || !firestore || !analysisId) return null;
        return doc(firestore, `users/${user.uid}/code_analyses/${analysisId}`);
    }, [user, firestore, analysisId]);

    const { data: analysisDoc, isLoading, error } = useDoc<AnalysisDoc>(analysisDocRef);

    const renderContent = () => {
        if (isUserLoading || isLoading) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <h2 className="text-xl font-semibold">Loading Analysis Report...</h2>
                </div>
            );
        }

        if (error) {
            return (
                <Card className="bg-destructive/10 border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle /> Error Loading Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive/80">Could not fetch this analysis report. You may not have permission or it may not exist.</p>
                    </CardContent>
                </Card>
            );
        }

        if (!analysisDoc) {
             return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle /> Report Not Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The requested analysis report could not be found.</p>
                    </CardContent>
                </Card>
            );
        }

        const analysisResult: AnalysisResult = {
            score: analysisDoc.technicalDebtScore,
            issues: analysisDoc.issues,
            explanation: analysisDoc.explanation,
            securityVulnerabilities: analysisDoc.securityVulnerabilities || [],
        };

        return <ResultsView code={analysisDoc.code} analysisResult={analysisResult} isHistoric={true} />
    }

    return (
        <main className="flex-1 p-4 md:p-8">
            {renderContent()}
        </main>
    );
}
