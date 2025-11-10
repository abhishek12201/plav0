"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { createPersonalizedStudyPlan } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function StudyPlanGenerator() {
  const [isPending, startTransition] = useTransition();
  const [studyPlan, setStudyPlan] = useState("");
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentProgress = formData.get("studentProgress") as string;
    const knowledgeGaps = formData.get("knowledgeGaps") as string;
    const learningObjectives = formData.get("learningObjectives") as string;

    if (!studentProgress || !knowledgeGaps || !learningObjectives) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to generate a study plan.",
        variant: "destructive",
      });
      return;
    }
    
    setStudyPlan("");
    startTransition(async () => {
      const result = await createPersonalizedStudyPlan({
        studentProgress,
        knowledgeGaps,
        learningObjectives,
      });

      if (result && result.studyPlan) {
        setStudyPlan(result.studyPlan);
        toast({
          title: "Study Plan Generated!",
          description: "Your personalized study plan is ready.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate study plan. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generate Your Study Plan</CardTitle>
          <CardDescription>Tell us about your learning journey, and we'll create a personalized plan for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentProgress">Your Progress So Far</Label>
              <Textarea id="studentProgress" name="studentProgress" placeholder="e.g., I'm comfortable with basic algebra but struggle with quadratic equations." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="knowledgeGaps">Identified Knowledge Gaps</Label>
              <Textarea id="knowledgeGaps" name="knowledgeGaps" placeholder="e.g., Factoring polynomials, understanding logarithms." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learningObjectives">Learning Objectives</Label>
              <Textarea id="learningObjectives" name="learningObjectives" placeholder="e.g., I want to be able to solve complex calculus problems for my upcoming exam." required />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Plan
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Personalized Plan</CardTitle>
          <CardDescription>Follow these steps to achieve your learning goals.</CardDescription>
        </CardHeader>
        <CardContent className="h-[450px]">
          {isPending && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {studyPlan ? (
             <div className="space-y-4 text-sm bg-secondary/30 p-4 rounded-md h-full overflow-y-auto">
              <pre className="whitespace-pre-wrap font-body text-sm text-foreground">{studyPlan}</pre>
            </div>
          ) : !isPending && (
            <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center bg-secondary/20 rounded-md">
              <Sparkles className="h-12 w-12 mb-4 text-muted-foreground"/>
              <p>Your study plan will appear here once generated.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
