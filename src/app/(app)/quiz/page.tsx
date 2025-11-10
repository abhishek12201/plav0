"use client";
import React, { useState } from 'react';
import QuizGenerator from "@/components/quiz/quiz-generator";
import QuizView, { type QuizData } from "@/components/quiz/quiz-view";
import { Card, CardContent } from '@/components/ui/card';

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const handleQuizGenerated = (data: QuizData) => {
    setQuizData(data);
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz Center</h1>
        <p className="text-muted-foreground">Generate and take personalized quizzes to test your knowledge.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {!quizData ? (
            <QuizGenerator onQuizGenerated={handleQuizGenerated} />
          ) : (
            <QuizView quizData={quizData} onRetake={() => setQuizData(null)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
