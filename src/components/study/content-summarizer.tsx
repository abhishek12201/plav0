"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { summarizeLearningContent } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function ContentSummarizer() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get("content") as string;

    if (!content) {
      toast({
        title: "No Content",
        description: "Please paste some content to summarize.",
        variant: "destructive",
      });
      return;
    }
    
    setSummary("");
    startTransition(async () => {
      const result = await summarizeLearningContent({ content });

      if (result && result.summary) {
        setSummary(result.summary);
        toast({
          title: "Content Summarized!",
          description: "Your summary is ready.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to summarize content. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Summarize Your Content</CardTitle>
          <CardDescription>Paste any text-based learning material to get a concise summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content to Summarize</Label>
              <Textarea id="content" name="content" placeholder="Paste your article, notes, or chapter here..." required className="min-h-[250px]" />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Summarize
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Key Takeaways</CardTitle>
          <CardDescription>The most important points from your content.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          {isPending && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {summary ? (
            <div className="space-y-4 text-sm bg-secondary/30 p-4 rounded-md h-full overflow-y-auto">
              <p>{summary}</p>
            </div>
          ) : !isPending && (
            <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center bg-secondary/20 rounded-md">
              <Sparkles className="h-12 w-12 mb-4 text-muted-foreground"/>
              <p>Your summary will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
