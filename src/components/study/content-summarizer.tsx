"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Paperclip, X } from "lucide-react";
import { summarizeLearningContent } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";

export default function ContentSummarizer() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    // Reset file input value
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get("content") as string;

    if (!content && !file) {
      toast({
        title: "No Content",
        description: "Please paste some content or upload a file to summarize.",
        variant: "destructive",
      });
      return;
    }
    
    setSummary("");

    const processAndSummarize = (photoDataUri?: string) => {
      startTransition(async () => {
        const result = await summarizeLearningContent({ content, photoDataUri });

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

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        processAndSummarize(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      processAndSummarize();
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Summarize Your Content</CardTitle>
          <CardDescription>Paste text or upload an image to get a concise summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content to Summarize</Label>
              <Textarea id="content" name="content" placeholder="Paste your article, notes, or chapter here..." className="min-h-[200px]" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="file-upload">Upload an Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="flex-1"/>
              </div>
              {fileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">
                  <Paperclip className="h-4 w-4"/>
                  <span className="truncate flex-1">{fileName}</span>
                  <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <Button type="submit" disabled={isPending} className="w-full !mt-6">
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
        <CardContent className="h-[420px]">
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
