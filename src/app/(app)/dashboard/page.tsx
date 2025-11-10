
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenText, Target, ClipboardCheck, BarChartHorizontalBig } from "lucide-react";
import RecentActivity from "@/components/dashboard/recent-activity";
import { useUserQuizAttempts } from "@/hooks/use-user-data";
import { useMemo } from "react";

export default function DashboardPage() {
  const { attempts } = useUserQuizAttempts();

  const stats = useMemo(() => {
    if (!attempts || attempts.length === 0) {
      return {
        topicsMastered: 0,
        averageScore: 0,
        quizzesTaken: 0,
        latestScoreIncrease: 0
      };
    }

    const topics = new Set(attempts.map(a => a.topic));
    const totalScore = attempts.reduce((acc, a) => acc + (a.score / a.totalQuestions) * 100, 0);
    const averageScore = totalScore / attempts.length;

    let latestScoreIncrease = 0;
    if (attempts.length >= 2) {
      const lastScore = (attempts[0].score / attempts[0].totalQuestions) * 100;
      const secondLastScore = (attempts[1].score / attempts[1].totalQuestions) * 100;
      latestScoreIncrease = lastScore - secondLastScore;
    }

    return {
      topicsMastered: topics.size,
      averageScore: Math.round(averageScore),
      quizzesTaken: attempts.length,
      latestScoreIncrease: Math.round(latestScoreIncrease),
    };
  }, [attempts]);


  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Welcome Back, Learner!</h1>
        <p className="mt-2 text-lg text-muted-foreground">Ready to unlock your potential today?</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Explored</CardTitle>
            <BookOpenText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topicsMastered}</div>
            <p className="text-xs text-muted-foreground">Across all your quizzes</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
                {stats.latestScoreIncrease > 0 ? `+${stats.latestScoreIncrease}%` : `${stats.latestScoreIncrease}%`} from last quiz
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quizzesTaken}</div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <BarChartHorizontalBig className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
      </div>
       <div className="mt-6">
          <RecentActivity />
       </div>
    </div>
  );
}
