import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpenText, Target, ClipboardCheck, BarChartHorizontalBig } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import ProgressChart from "@/components/dashboard/progress-chart";
import KnowledgeGapChart from "@/components/dashboard/knowledge-gap-chart";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  const welcomeImage = PlaceHolderImages.find(p => p.id === 'dashboard-welcome');
  return (
    <>
      <div className="relative w-full rounded-lg overflow-hidden h-64 mb-6">
        {welcomeImage && (
          <Image
            src={welcomeImage.imageUrl}
            alt={welcomeImage.description}
            fill
            className="object-cover"
            data-ai-hint={welcomeImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 p-6">
          <h1 className="text-4xl font-bold tracking-tight text-white font-headline">Welcome Back, Learner!</h1>
          <p className="mt-2 text-lg text-gray-300">Ready to unlock your potential today?</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Mastered</CardTitle>
            <BookOpenText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">+5% from last quiz</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
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
       <div className="mt-6">
          <RecentActivity />
       </div>
    </>
  );
}
