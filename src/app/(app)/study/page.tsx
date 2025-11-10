
import StudyPlanGenerator from "@/components/study/study-plan-generator";
import ContentSummarizer from "@/components/study/content-summarizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenText, FileText } from "lucide-react";

export default function StudyPage() {
  return (
    <div className="max-w-7xl mx-auto w-full">
       <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Study Hub</h1>
        <p className="text-muted-foreground">Your personal AI-powered study tools.</p>
      </div>

      <Tabs defaultValue="study-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg">
          <TabsTrigger value="study-plan">
            <BookOpenText className="mr-2 h-4 w-4" />
            Study Plan
          </TabsTrigger>
          <TabsTrigger value="summarizer">
            <FileText className="mr-2 h-4 w-4" />
            Summarizer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="study-plan" className="mt-4">
          <StudyPlanGenerator />
        </TabsContent>
        <TabsContent value="summarizer" className="mt-4">
          <ContentSummarizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
