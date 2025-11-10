
"use server";
import {
  createPersonalizedStudyPlan as createPlan,
  type CreatePersonalizedStudyPlanInput,
  type CreatePersonalizedStudyPlanOutput,
} from "@/ai/flows/create-personalized-study-plan";
import {
  generatePersonalizedQuiz as generateQuiz,
  type GeneratePersonalizedQuizInput,
  type GeneratePersonalizedQuizOutput,
} from "@/ai/flows/generate-personalized-quiz";
import {
  provideAdaptiveFeedback as provideFeedback,
  type ProvideAdaptiveFeedbackInput,
  type ProvideAdaptiveFeedbackOutput,
} from "@/ai/flows/provide-adaptive-feedback";
import {
  summarizeLearningContent as summarize,
  type SummarizeLearningContentInput,
  type SummarizeLearningContentOutput,
} from "@/ai/flows/summarize-learning-content";
import {
  retrieveContent as retrieve,
  type RetrieveContentInput,
  type RetrieveContentOutput,
} from "@/ai/flows/retrieve-content";
// Server-side Firestore SDK should not be used in actions called from client without auth context.
// Client-side SDK will be used in the components instead.

type Answer = {
  answer: string;
  confidence?: number;
}

export type UserQuizAttempt = {
  quizId?: string;
  userId: string;
  answers?: { [key: number]: Answer };
  score?: number;
  topic?: string;
  totalQuestions?: number;
  feedback?: ProvideAdaptiveFeedbackOutput;
  attemptId?: string;
};

export async function createPersonalizedStudyPlan(
  input: CreatePersonalizedStudyPlanInput
): Promise<CreatePersonalizedStudyPlanOutput | { error: string }> {
  try {
    return await createPlan(input);
  } catch (error) {
    console.error("Error creating study plan:", error);
    return { error: "Sorry, I couldn't generate a study plan at the moment. Please try again later." };
  }
}

export async function generatePersonalizedQuiz(
  input: GeneratePersonalizedQuizInput
): Promise<GeneratePersonalizedQuizOutput | { error: string }> {
  try {
    const result = await generateQuiz(input);
    
    if (result && 'questions' in result && result.questions) {
        return result;
    }
    
    const errorMessage = (result as { error: string })?.error || "The AI failed to generate a valid quiz structure.";
    return { error: errorMessage };

  } catch (error) {
    console.error("Error generating quiz:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during quiz generation.";
    return { error: "Sorry, I couldn't generate a quiz at the moment. " + errorMessage };
  }
}

export async function provideAdaptiveFeedback(
  input: ProvideAdaptiveFeedbackInput
): Promise<ProvideAdaptiveFeedbackOutput | {error: string}> {
  try {
    return await provideFeedback(input);
  } catch (error) {
    console.error("Error providing feedback:", error);
    return { error: "Sorry, I couldn't provide feedback at the moment. Please try again later." };
  }
}

export async function summarizeLearningContent(
  input: SummarizeLearningContentInput
): Promise<SummarizeLearningContentOutput | { error: string }> {
  try {
    return await summarize(input);
  } catch (error) {
    console.error("Error summarizing content:", error);
    return { error: "Sorry, I couldn't summarize the content at the moment. Please try again later." };
  }
}

export async function retrieveContent(
  input: RetrieveContentInput & { userId: string }
): Promise<RetrieveContentOutput | { error: string }> {
  try {
    const result = await retrieve({ topic: input.topic });
    return result;
  } catch (error) {
    console.error("Error retrieving content:", error);
    return { error: "Sorry, I couldn't retrieve content at the moment. Please try again later." };
  }
}


export type { ProvideAdaptiveFeedbackOutput };

    