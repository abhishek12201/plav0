
"use client";
import React, { useState } from 'react';
import QuizGenerator from "@/components/quiz/quiz-generator";
import QuizView, { type QuizData } from "@/components/quiz/quiz-view";
import { Card, CardContent } from '@/components/ui/card';
import RecentQuizzes from '@/components/quiz/recent-quizzes';
import { Separator } from '@/components/ui/separator';

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const handleQuizGenerated = (data: QuizData) => {
    setQuizData(data);
  };
  
  const handleStartQuiz = (data: QuizData) => {
    setQuizData(data);
  }

  const handleBackToGenerator = () => {
    setQuizData(null);
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz Center</h1>
        <p className="text-muted-foreground">Generate and take personalized quizzes to test your knowledge.</p>
      </div>

      {!quizData ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <QuizGenerator onQuizGenerated={handleQuizGenerated} />
              </CardContent>
            </Card>
          </div>
          <div>
            <RecentQuizzes onStartQuiz={handleStartQuiz}/>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <QuizView quizData={quizData} onRetake={handleBackToGenerator} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
