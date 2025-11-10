
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProgressChart from "@/components/dashboard/progress-chart";
import KnowledgeGapChart from "@/components/dashboard/knowledge-gap-chart";
import { useUserQuizAttempts } from "@/hooks/use-user-data";
import { Loader2, BarChart3 } from "lucide-react";
import { useMemo } from "react";

export default function MetricsPage() {
    const { attempts, isLoading } = useUserQuizAttempts();

    const chartData = useMemo(() => {
        if (!attempts) {
            return { progress: [], knowledge: [] };
        }

        const progress = attempts.map(attempt => ({
            date: new Date((attempt.attemptTime as any).seconds * 1000).toLocaleDateString(),
            score: (attempt.score / attempt.totalQuestions) * 100
        })).reverse();

        const knowledgeGaps = Object.values(attempts.reduce((acc, attempt) => {
            if (!acc[attempt.topic]) {
                acc[attempt.topic] = { topic: attempt.topic, scores: [], fullMark: 100 };
            }
            acc[attempt.topic].scores.push((attempt.score / attempt.totalQuestions) * 100);
            return acc;
        }, {} as Record<string, { topic: string; scores: number[], fullMark: 100 }>)).map(item => ({
            ...item,
            score: item.scores.reduce((a, b) => a + b, 0) / item.scores.length
        }));

        return { progress, knowledge: knowledgeGaps };

    }, [attempts]);

    return (
        <div className="max-w-7xl mx-auto w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Your Metrics</h1>
                <p className="text-muted-foreground">Track your progress and identify areas for growth.</p>
            </div>
            
            {isLoading && (
                 <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}

            {!isLoading && (!attempts || attempts.length === 0) && (
                 <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg bg-card/50">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4"/>
                    <h3 className="text-xl font-semibold font-headline">No Data Yet</h3>
                    <p className="text-muted-foreground">Take your first quiz to start tracking your metrics.</p>
                </div>
            )}

            {!isLoading && attempts && attempts.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-1 lg:col-span-4 bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="font-headline">Progress Over Time</CardTitle>
                            <CardDescription>Your quiz scores over time.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ProgressChart data={chartData.progress} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-1 lg:col-span-3 bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="font-headline">Knowledge Gaps</CardTitle>
                            <CardDescription>Average scores by topic.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <KnowledgeGapChart data={chartData.knowledge}/>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
