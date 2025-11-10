
"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import { retrieveContent } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

type ContentRetrieverProps = {
  onContentRetrieved?: (topic: string, summary: string) => void;
  showSummary?: boolean;
}

export default function ContentRetriever({ onContentRetrieved, showSummary = true }: ContentRetrieverProps) {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to retrieve content.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const topic = formData.get("topic") as string;

    if (!topic) {
      toast({
        title: "No Topic",
        description: "Please enter a topic to retrieve content.",
        variant: "destructive",
      });
      return;
    }
    
    setSummary("");
    startTransition(async () => {
      const result = await retrieveContent({ topic, userId: user.uid });

      if (result && result.summary) {
        setSummary(result.summary);
        if (onContentRetrieved) {
          onContentRetrieved(topic, result.summary);
        } else {
          toast({
            title: "Content Retrieved!",
            description: "A summary for your topic is ready.",
          });
        }
      } else {
        toast({
          title: "Error",
          description: (result as {error: string}).error || "Failed to retrieve content. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className={`grid ${showSummary ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Content Retriever Agent</CardTitle>
          <CardDescription>Enter a topic and the AI will search for and summarize information for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" placeholder="e.g., Binary Trees, Machine Learning basics" required />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Retrieve Content
            </Button>
          </form>
          <div className="mt-6 text-sm text-muted-foreground p-4 bg-secondary/30 rounded-md">
            <p><strong>Note:</strong> This agent synthesizes information from its knowledge base, acting as if it is retrieving and summarizing content from trusted educational sources. A full implementation could integrate with live web search APIs.</p>
          </div>
        </CardContent>
      </Card>
      {showSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Retrieved Summary</CardTitle>
            <CardDescription>A concise summary of the topic you requested.</CardDescription>
          </CardHeader>
          <CardContent className="h-[450px]">
            {isPending && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {summary ? (
              <div className="space-y-4 text-sm bg-secondary/30 p-4 rounded-md h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap font-body text-sm text-foreground">{summary}</pre>
              </div>
            ) : !isPending && (
              <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center bg-secondary/20 rounded-md">
                <Search className="h-12 w-12 mb-4 text-muted-foreground"/>
                <p>Your retrieved content summary will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
