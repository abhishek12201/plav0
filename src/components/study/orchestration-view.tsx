
'use client';
import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bot, Loader2, User, Sparkles, BookOpenCheck } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { retrieveContent, generatePersonalizedQuiz } from '@/lib/actions';
import QuizView from '../quiz/quiz-view';
import type { QuizData } from '../quiz/quiz-view';

type Message = {
  sender: 'user' | 'agent';
  agentName?: string;
  content: string;
  icon?: React.ReactNode;
};

export default function OrchestrationView() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const { user } = useUser();
  const { toast } = useToast();

  const handleStart = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast({ title: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    if (!topic) {
      toast({ title: 'Please enter a topic.', variant: 'destructive' });
      return;
    }

    setIsOrchestrating(true);
    setQuizData(null);
    const userMessage: Message = { sender: 'user', content: `Generate a quiz about ${topic}.`, icon: <User /> };
    setMessages([userMessage]);

    // Agent 1: Content Retriever
    const retrieverMessage: Message = {
      sender: 'agent',
      agentName: 'Content Retriever',
      content: 'On it! Searching my knowledge base for content about your topic...',
      icon: <Loader2 className="animate-spin" />,
    };
    setMessages((prev) => [...prev, retrieverMessage]);

    const retrieveResult = await retrieveContent({ topic, userId: user.uid });

    if (retrieveResult.error || !retrieveResult.summary) {
      const errorMessage: Message = {
        sender: 'agent',
        agentName: 'System',
        content: `I had trouble finding content on "${topic}". Please try another topic.`,
        icon: <Bot />,
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
      setIsOrchestrating(false);
      return;
    }
    
    const retrieverDoneMessage: Message = {
      sender: 'agent',
      agentName: 'Content Retriever',
      content: `I've found and summarized the content for "${topic}". Passing it to the Quiz Generator agent.`,
      icon: <BookOpenCheck />,
    };
    setMessages((prev) => [...prev.slice(0, -1), retrieverDoneMessage]);
    
    // Agent 2: Quiz Generator
    const quizzerMessage: Message = {
        sender: 'agent',
        agentName: 'Quiz Generator',
        content: 'Thanks! I am now generating a personalized quiz based on the provided content. This might take a moment.',
        icon: <Loader2 className="animate-spin" />,
    };
    setMessages((prev) => [...prev, quizzerMessage]);
    
    const quizResult = await generatePersonalizedQuiz({
        learningContent: retrieveResult.summary,
        topic,
        numberOfQuestions: 5,
        difficulty: 'medium',
        userId: user.uid,
    });
    
    if (quizResult.error || !quizResult.questions) {
      const errorMessage: Message = {
        sender: 'agent',
        agentName: 'System',
        content: `I had trouble generating a quiz for "${topic}". Please try again.`,
        icon: <Bot />,
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
      setIsOrchestrating(false);
      return;
    }

    const finalMessage: Message = {
        sender: 'agent',
        agentName: 'Quiz Generator',
        content: `Your quiz is ready! Good luck.`,
        icon: <Sparkles />,
    };
    setMessages((prev) => [...prev.slice(0,-1), finalMessage]);
    setIsOrchestrating(false);
    setQuizData({
        title: quizResult.title,
        questions: quizResult.questions,
        quizId: quizResult.quizId,
        topic: topic,
    });
  };
  
  const handleRetake = () => {
    setQuizData(null);
    setMessages([]);
    setTopic('');
  }

  if (quizData) {
    return (
        <Card>
            <CardContent className="p-6">
                <QuizView quizData={quizData} onRetake={handleRetake} />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Agent Team-Up</CardTitle>
        <CardDescription>
          Watch the AI agents work together to create a personalized quiz for you from scratch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Start a New Task</h3>
            <form onSubmit={handleStart} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">What topic do you want a quiz on?</Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder="e.g., Photosynthesis"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isOrchestrating}
                  required
                />
              </div>
              <Button type="submit" disabled={isOrchestrating} className="w-full">
                {isOrchestrating ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                Start Agent Team
              </Button>
            </form>
          </div>
          <div className="bg-secondary/30 p-4 rounded-lg h-[400px] flex flex-col">
            <h3 className="font-semibold mb-4 text-center">Live Agent Feed</h3>
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center">
                    <Bot size={48} className="mb-4" />
                    <p className="font-medium">The agent feed is quiet for now.</p>
                    <p className="text-sm">Enter a topic to see them work!</p>
                </div>
            ) : (
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'agent' && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            {msg.icon || <Bot />}
                        </div>
                        )}
                        <div className={`p-3 rounded-lg max-w-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                        {msg.agentName && <p className="font-bold text-xs mb-1">{msg.agentName}</p>}
                        <p className="text-sm">{msg.content}</p>
                        </div>
                         {msg.sender === 'user' && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                           <User />
                        </div>
                        )}
                    </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
