"use client";
import React, { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { provideAdaptiveFeedback } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type QuizData = {
  title: string;
  questions: Question[];
  originalContent: string;
};

type QuizViewProps = {
  quizData: QuizData;
  onRetake: () => void;
};

type Answers = { [key: number]: string };

export default function QuizView({ quizData, onRetake }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestionIndex]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let newScore = 0;
    quizData.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setIsFinished(true);
    generateFeedback(newScore);
  };

  const generateFeedback = (finalScore: number) => {
    startTransition(async () => {
      const quizResults = `Student scored ${finalScore}/${quizData.questions.length}.\nAnswers given:\n${JSON.stringify(answers, null, 2)}\nCorrect Answers:\n${JSON.stringify(quizData.questions.map(q=>q.correctAnswer), null, 2)}`;
      const result = await provideAdaptiveFeedback({
        quizResults,
        studyMaterial: quizData.originalContent,
        studentKnowledgeLevel: 'intermediate', // This could be dynamic in a real app
      });

      if (result && result.feedback) {
        setFeedback(result.feedback);
      } else {
        toast({
          title: "Feedback Error",
          description: "Could not generate adaptive feedback.",
          variant: "destructive",
        });
      }
    });
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold font-headline text-center">{quizData.title} - Results</h2>
        <div className="text-center my-4">
          <p className="text-6xl font-bold text-primary">{score}</p>
          <p className="text-lg text-muted-foreground">out of {quizData.questions.length} correct</p>
        </div>
        <Card className="mb-4 bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/> Adaptive Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
            {feedback ? (
               <div className="space-y-4 text-sm bg-secondary/30 p-4 rounded-md h-full overflow-y-auto">
                 <pre className="whitespace-pre-wrap font-body text-sm text-foreground">{feedback}</pre>
               </div>
            ) : !isPending && (
              <p className="text-muted-foreground">Generating your personalized feedback...</p>
            )}
          </CardContent>
        </Card>
        <Button onClick={onRetake} className="w-full"><RefreshCcw className="mr-2 h-4 w-4"/> Generate a New Quiz</Button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold font-headline text-center mb-2">{quizData.title}</h2>
      <p className="text-center text-muted-foreground mb-4">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
      <Progress value={progress} className="mb-8" />
      
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={answers[currentQuestionIndex]} onValueChange={handleAnswerChange} className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Label htmlFor={`q${currentQuestionIndex}-o${index}`} key={index} className={cn("flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer", answers[currentQuestionIndex] === option ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/50")}>
                <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      <Button onClick={handleNext} disabled={!answers[currentQuestionIndex]} className="w-full mt-6">
        {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </Button>
    </div>
  );
}
