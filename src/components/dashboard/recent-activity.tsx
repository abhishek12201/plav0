'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpenText, ClipboardCheck, FileText, Loader2 } from "lucide-react";
import { useUserQuizAttempts } from "@/hooks/use-user-data";
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
    quiz: <ClipboardCheck className="h-5 w-5 text-primary-foreground" />,
    study: <BookOpenText className="h-5 w-5 text-primary-foreground" />,
    summary: <FileText className="h-5 w-5 text-primary-foreground" />,
}

export default function RecentActivity() {
    const { attempts, isLoading } = useUserQuizAttempts();

    return (
        <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>Your recent quiz history.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading && <div className="flex justify-center items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
                
                {!isLoading && (!attempts || attempts.length === 0) && (
                    <div className="text-center text-muted-foreground py-8">
                        <ClipboardCheck className="mx-auto h-12 w-12 mb-4" />
                        <p className="font-medium">No Activity Yet</p>
                        <p className="text-sm">Take your first quiz to see your activity here.</p>
                    </div>
                )}
                
                {!isLoading && attempts && attempts.length > 0 && (
                    <div className="space-y-4">
                        {attempts.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4">
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                    <AvatarFallback className='bg-primary'>
                                        {iconMap['quiz' as keyof typeof iconMap]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">{activity.topic} Quiz</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(activity.attemptTime.seconds * 1000), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    <Badge variant="outline">{activity.score}/{activity.totalQuestions}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
