
"use client";
import React, { useState, useTransition, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { provideAdaptiveFeedback, type ProvideAdaptiveFeedbackOutput, saveQuizAttempt } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, RefreshCcw, Flag, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useUser } from '@/firebase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';

type Question = {
  question: string;
  type: 'multiple-choice' | 'short-answer';
  options: string[];
  correctAnswer: string;
};

export type QuizData = {
  title: string;
  questions: Question[];
  quizId: string;
  topic?: string;
};

type QuizViewProps = {
  quizData: QuizData;
  onRetake: () => void;
};

type Answers = { [key: number]: string };
type Flagged = { [key: number]: boolean };
type FeedbackTone = "Encouraging" | "Constructive" | "Gamified";


export default function QuizView({ quizData, onRetake }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<ProvideAdaptiveFeedbackOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [flagged, setFlagged] = useState<Flagged>({});
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>("Encouraging");
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useUser();

  const getFeedback = useCallback((currentScore: number, currentAnswers: Answers, tone: FeedbackTone) => {
    setFeedback(null);
    startTransition(async () => {
      const questionsWithUserAnswers = quizData.questions.map((q, i) => ({
        ...q,
        userAnswer: currentAnswers[i] || "Not answered",
      }));

      const feedbackResult = await provideFeedback({
        quizTitle: quizData.title,
        questions: questionsWithUserAnswers,
        score: currentScore,
        studentKnowledgeLevel: 'intermediate',
        feedbackTone: tone,
      });

      if (feedbackResult && 'overallFeedback' in feedbackResult) {
        setFeedback(feedbackResult);
        // Now save the feedback to the attempt
        if (user && attemptId) {
          saveQuizAttempt({
            attemptId,
            userId: user.uid,
            feedback: feedbackResult,
          });
        }
      } else {
        const error = (feedbackResult as { error: string })?.error || "Could not generate adaptive feedback.";
        toast({
          title: "Feedback Error",
          description: error,
          variant: "destructive",
        });
      }
    });
  }, [quizData, toast, user, attemptId]);
  
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

  const handleToggleFlag = () => {
    setFlagged({ ...flagged, [currentQuestionIndex]: !flagged[currentQuestionIndex] });
  };

  const handleSubmit = async () => {
    let newScore = 0;
    quizData.questions.forEach((q, index) => {
      if (q.type === 'multiple-choice' && answers[index] === q.correctAnswer) {
        newScore++;
      } else if (q.type === 'short-answer' && answers[index]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        newScore++;
      }
    });
    const finalScore = newScore;
    setScore(finalScore);
    setIsFinished(true);

    if (user && quizData.topic) {
      const result = await saveQuizAttempt({
        userId: user.uid,
        quizId: quizData.quizId,
        answers: answers,
        score: finalScore,
        topic: quizData.topic,
        totalQuestions: quizData.questions.length,
      });
      
      if (result.success && result.attemptId) {
        setAttemptId(result.attemptId);
        toast({
          title: "Quiz Finished!",
          description: "Your results have been saved.",
        });
        getFeedback(finalScore, answers, feedbackTone);
      } else {
         toast({
          title: "Save Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } else {
      getFeedback(finalScore, answers, feedbackTone);
    }
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
            <div className='flex justify-between items-center'>
              <div className='flex-1'>
                <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/> Adaptive Feedback</CardTitle>
                <CardDescription>AI-powered suggestions to help you improve.</CardDescription>
              </div>
               <div className="flex items-center gap-2">
                <Label htmlFor="feedback-tone">Tone</Label>
                <Select value={feedbackTone} onValueChange={(value: FeedbackTone) => {
                  setFeedbackTone(value);
                  getFeedback(score, answers, value);
                }}>
                  <SelectTrigger className="w-[140px]" id="feedback-tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Encouraging">Encouraging</SelectItem>
                    <SelectItem value="Constructive">Constructive</SelectItem>
                    <SelectItem value="Gamified">Gamified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(isPending || !feedback) && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {feedback && (
               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                <p className="text-sm bg-secondary/30 p-4 rounded-md">{feedback.overallFeedback}</p>
                
                {feedback.weakConcepts && feedback.weakConcepts.length > 0 && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <h3 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-5 w-5"/> Key Areas to Review</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {feedback.weakConcepts.map((concept, i) => (
                        <Badge key={i} variant="secondary" className="bg-amber-500/20 text-amber-900 dark:text-amber-100">{concept}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
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
            )}
          </CardContent>
        </Card>
        <Button onClick={onRetake} className="w-full"><RefreshCcw className="mr-2 h-4 w-4"/> Generate a New Quiz</Button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quizData.questions.length) * 100;
  const isFlagged = flagged[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-headline text-center mb-2">{quizData.title}</h2>
        <p className="text-center text-muted-foreground">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
      </div>
      <Progress value={progress} className="mb-8 h-2" />
      
      <Card className="bg-card/50 border-none shadow-none">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-xl font-medium leading-relaxed flex-1">{currentQuestion.question}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFlag}
                    className={cn(
                      "shrink-0",
                      isFlagged ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Flag className={isFlagged ? "fill-current" : ""} />
                    <span className="sr-only">Flag question for review</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Flag for review</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'multiple-choice' ? (
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
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`q${currentQuestionIndex}-short`}>Your Answer</Label>
              <Textarea
                id={`q${currentQuestionIndex}-short`}
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[100px]"
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Button onClick={handleNext} disabled={!answers[currentQuestionIndex]} className="w-full mt-8" size="lg">
        {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </Button>
    </div>
  );
}
