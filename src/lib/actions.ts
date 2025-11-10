
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
import { getSdks } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";


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
  input: GeneratePersonalizedQuizInput & { userId: string }
): Promise<GeneratePersonalizedQuizOutput | { error: string }> {
  try {
    const result = await generateQuiz(input);
    
    // Save the generated quiz to Firestore
    if (result && 'questions' in result && result.questions) {
        const { firestore } = getSdks();
        const quizzesCol = collection(firestore, "quizzes");
        await addDoc(quizzesCol, {
          userId: input.userId,
          topic: input.topic,
          difficulty: input.difficulty,
          title: result.title,
          questions: result.questions,
          createdAt: serverTimestamp(),
        });
    }
    
    return result;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: "Sorry, I couldn't generate a quiz at the moment. Please try again later." };
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
    if (result.summary && input.userId) {
      const { firestore } = getSdks();
      const summariesCol = collection(firestore, "users", input.userId, "summaries");
      await addDoc(summariesCol, {
        userId: input.userId,
        topic: input.topic,
        summary: result.summary,
        createdAt: serverTimestamp(),
      });
    }
    return result;
  } catch (error) {
    console.error("Error retrieving content:", error);
    return { error: "Sorry, I couldn't retrieve content at the moment. Please try again later." };
  }
}

export type { ProvideAdaptiveFeedbackOutput };
