
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Book, ArrowRight } from 'lucide-react';
import type { QuizData } from './quiz-view';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

type RecentQuizzesProps = {
    onStartQuiz: (quiz: QuizData) => void;
}

type StoredQuiz = {
    id: string;
    title: string;
    topic: string;
    difficulty: string;
    questions: any[];
}

export default function RecentQuizzes({ onStartQuiz }: RecentQuizzesProps) {
    const { user } = useUser();
    const firestore = useFirestore();

    const quizzesQuery = useMemoFirebase(() => {
        if (!user) return null;
        // Query the subcollection under the specific user
        return query(
            collection(firestore, 'users', user.uid, 'quizzes'),
            orderBy('createdAt', 'desc'),
            limit(10)
        );
    }, [firestore, user]);

    const { data: quizzes, isLoading } = useCollection<StoredQuiz>(quizzesQuery);

    const handleQuizSelect = (quiz: StoredQuiz) => {
        onStartQuiz({
            quizId: quiz.id,
            title: quiz.title,
            topic: quiz.topic,
            questions: quiz.questions
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Quizzes</CardTitle>
                <CardDescription>Retake one of your previously generated quizzes.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[450px] pr-4">
                    {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin" /></div>}
                    {!isLoading && (!quizzes || quizzes.length === 0) && (
                        <div className="text-center text-muted-foreground py-8">
                            <Book className="mx-auto h-12 w-12 mb-4" />
                            <p className="font-medium">No Quizzes Found</p>
                            <p className="text-sm">Generate your first quiz to see it here.</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        {quizzes?.map((quiz) => (
                            <div key={quiz.id} className="p-3 rounded-lg border flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-semibold text-sm leading-tight">{quiz.title}</p>
                                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                                       <Badge variant="outline" className="capitalize">{quiz.difficulty}</Badge>
                                       <Badge variant="secondary">{quiz.questions.length} questions</Badge>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => handleQuizSelect(quiz)}>
                                    Start <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
