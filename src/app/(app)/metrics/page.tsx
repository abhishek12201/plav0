
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProgressChart from "@/components/dashboard/progress-chart";
import KnowledgeGapChart from "@/components/dashboard/knowledge-gap-chart";

export default function MetricsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Your Metrics</h1>
            <p className="text-muted-foreground">Track your progress and identify areas for growth.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Progress Over Time</CardTitle>
                <CardDescription>Your mastery score over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ProgressChart />
            </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Knowledge Gaps</CardTitle>
                <CardDescription>Areas where you can improve.</CardDescription>
            </CardHeader>
            <CardContent>
                <KnowledgeGapChart />
            </CardContent>
            </Card>
        </div>
    </div>
  );
}
