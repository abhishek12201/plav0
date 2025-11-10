import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpenText, ClipboardCheck, FileText } from "lucide-react";

const activities = [
    { type: 'quiz', title: 'Calculus Basics Quiz', score: '8/10', time: '10m ago' },
    { type: 'study', title: 'Generated new plan for Statistics', time: '1h ago' },
    { type: 'summary', title: 'Summarized "The Art of War"', time: '3h ago' },
    { type: 'quiz', title: 'Algebra Fundamentals Quiz', score: '9/10', time: '1d ago' },
    { type: 'study', title: 'Completed "Geometry Foundations"', time: '2d ago' },
]

const iconMap = {
    quiz: <ClipboardCheck className="h-5 w-5 text-primary-foreground" />,
    study: <BookOpenText className="h-5 w-5 text-primary-foreground" />,
    summary: <FileText className="h-5 w-5 text-primary-foreground" />,
}

export default function RecentActivity() {
    return (
        <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>What you've been up to recently.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarFallback className={`${activity.type === 'quiz' ? 'bg-primary' : 'bg-accent text-accent-foreground'}`}>
                                    {iconMap[activity.type as keyof typeof iconMap]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.time}</p>
                            </div>
                            {activity.score && <div className="ml-auto font-medium"><Badge variant="outline">{activity.score}</Badge></div>}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
