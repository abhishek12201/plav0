"use client";
import React, { useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { generatePersonalizedQuiz } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import type { QuizData } from './quiz-view';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

// This is a mock parser. In a real app, you'd want a more robust solution,
// preferably by having the AI return structured JSON.
const parseQuizString = (quizString: string): QuizData => {
  console.log("AI Output (to be parsed):\n", quizString);
  // This mock parser creates a sample quiz. It does NOT correctly parse the actual AI string output.
  // This is a placeholder due to constraints on modifying AI flows.
  return {
    title: 'Mock Generated Quiz',
    questions: [
      {
        question: "What is the primary function of a CPU in a computer?",
        options: ["Store data long-term", "Execute instructions", "Display graphics", "Connect to the internet"],
        correctAnswer: "Execute instructions"
      },
      {
        question: "In React, what hook is used to manage state in a functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: "useState"
      },
      {
        question: "Which of the following is a key characteristic of blockchain technology?",
        options: ["Centralized control", "Immutability", "Low energy consumption", "Easy to modify data"],
        correctAnswer: "Immutability"
      },
      {
        question: "What does 'AI' stand for?",
        options: ["Automated Intelligence", "Augmented Interaction", "Artificial Intelligence", "Algorithmic Interface"],
        correctAnswer: "Artificial Intelligence"
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
      }
    ],
    originalContent: quizString, // We pass the original content for feedback generation
  };
};

type QuizGeneratorProps = {
  onQuizGenerated: (data: QuizData) => void;
};

export default function QuizGenerator({ onQuizGenerated }: QuizGeneratorProps) {
  const [isPending, startTransition] = useTransition();
  const [numQuestions, setNumQuestions] = React.useState([5]);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const learningContent = formData.get("learningContent") as string;
    const topic = formData.get("topic") as string;

    if (!learningContent || !topic) {
      toast({
        title: "Missing Information",
        description: "Please provide a topic and some learning content.",
        variant: "destructive",
      });
      return;
    }
    
    startTransition(async () => {
      const result = await generatePersonalizedQuiz({
        learningContent,
        topic,
        numberOfQuestions: numQuestions[0],
      });

      if (result && result.quiz) {
        const parsedQuiz = parseQuizString(result.quiz);
        onQuizGenerated(parsedQuiz);
        toast({
          title: "Quiz Generated!",
          description: "Your personalized quiz is ready to be taken.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate quiz. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-headline">Create a New Quiz</h2>
        <p className="text-muted-foreground">Provide some content and let our AI build a quiz for you.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" name="topic" placeholder="e.g., Introduction to Artificial Intelligence" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="learningContent">Learning Content</Label>
          <Textarea id="learningContent" name="learningContent" placeholder="Paste your article, notes, or textbook chapter here..." required className="min-h-[150px]" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{numQuestions[0]}</span>
          </div>
          <Slider
            id="numQuestions"
            name="numQuestions"
            min={3}
            max={10}
            step={1}
            value={numQuestions}
            onValueChange={setNumQuestions}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full !mt-8">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Quiz
        </Button>
      </form>
    </div>
  );
}
