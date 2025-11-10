"use client";
import React, { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { provideAdaptiveFeedback, type ProvideAdaptiveFeedbackOutput } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type QuizData = {
  title: string;
  questions: Question[];
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
  const [feedback, setFeedback] = useState<ProvideAdaptiveFeedbackOutput | null>(null);
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
      const questionsWithUserAnswers = quizData.questions.map((q, i) => ({
        ...q,
        userAnswer: answers[i] || "Not answered",
      }));

      const result = await provideAdaptiveFeedback({
        quizTitle: quizData.title,
        questions: questionsWithUserAnswers,
        score: finalScore,
        studentKnowledgeLevel: 'intermediate', // This could be dynamic in a real app
      });

      if (result && result.overallFeedback) {
        setFeedback(result);
      } else {
        const error = (result as { error: string })?.error || "Could not generate adaptive feedback.";
        toast({
          title: "Feedback Error",
          description: error,
          variant: "destructive",
        });
      }
    });
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-headline">{quizData.title} - Results</h2>
          <p className="text-muted-foreground mt-1">Here's how you did.</p>
        </div>
        <div className="text-center my-6">
          <p className="text-6xl font-bold text-primary">{score}</p>
          <p className="text-lg text-muted-foreground">out of {quizData.questions.length} correct</p>
        </div>
        <Card className="mb-4 bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/> Adaptive Feedback</CardTitle>
            <CardDescription>AI-powered suggestions to help you improve.</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {feedback ? (
               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                <p className="text-sm bg-secondary/30 p-4 rounded-md">{feedback.overallFeedback}</p>
                {feedback.detailedFeedback.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    {feedback.detailedFeedback.map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className='font-medium'>Review: {item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="prose prose-sm dark:prose-invert max-w-none space-y-2">
                            <p><strong>Your Answer:</strong> <span className="text-destructive">{item.userAnswer}</span></p>
                            <p><strong>Correct Answer:</strong> <span className="text-green-500">{item.correctAnswer}</span></p>
                            <div className="p-3 bg-secondary/50 rounded-md">
                              <p className='font-semibold'>Explanation:</p>
                              <p>{item.explanation}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
               </div>
            ) : !isPending && (
              <p className="text-muted-foreground text-center py-8">Generating your personalized feedback...</p>
            )}
          </CardContent>
        </Card>
        <Button onClick={onRetake} className="w-full"><RefreshCcw className="mr-2 h-4 w-4"/> Generate a New Quiz</Button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quizData.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-headline text-center mb-2">{quizData.title}</h2>
        <p className="text-center text-muted-foreground">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
      </div>
      <Progress value={progress} className="mb-8 h-2" />
      
      <Card className="bg-card/50 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-medium leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={answers[currentQuestionIndex]} onValueChange={handleAnswerChange} className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Label 
                htmlFor={`q${currentQuestionIndex}-o${index}`} 
                key={index} 
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer",
                  "hover:border-primary/60 hover:bg-primary/5",
                  answers[currentQuestionIndex] === option 
                    ? "border-primary bg-primary/10" 
                    : "border-border"
                )}
              >
                <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} className="h-5 w-5"/>
                <span className="text-base flex-1">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      <Button onClick={handleNext} disabled={!answers[currentQuestionIndex]} className="w-full mt-8" size="lg">
        {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </Button>
    </div>
  );
}
