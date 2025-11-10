
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
import { getSdks } from "@/firebase/server-actions";
import { addDoc, collection, doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";

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
  input: GeneratePersonalizedQuizInput & { userId: string }
): Promise<(GeneratePersonalizedQuizOutput & { quizId: string }) | { error: string }> {
  try {
    const result = await generateQuiz(input);
    
    if (result && 'questions' in result && result.questions) {
        const { firestore } = getSdks();
        const quizzesCol = collection(firestore, "users", input.userId, "quizzes");
        const newQuizRef = doc(quizzesCol); // Create a new document reference with an auto-generated ID
        
        await setDoc(newQuizRef, {
          userId: input.userId,
          topic: input.topic,
          difficulty: input.difficulty,
          title: result.title,
          questions: result.questions,
          createdAt: Timestamp.now(),
        });
        return { ...result, quizId: newQuizRef.id };
    }
    
    // If result is not valid, treat as an error.
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

export async function saveQuizAttempt(
  input: UserQuizAttempt
): Promise<{ success: boolean; attemptId?: string; error?: string }> {
  try {
    const { firestore } = getSdks();
    const attemptsCol = collection(firestore, "users", input.userId, "quizAttempts");
    
    if (input.attemptId && input.feedback) {
      // This is an update to add feedback to an existing attempt
      const attemptRef = doc(attemptsCol, input.attemptId);
      await setDoc(attemptRef, { feedback: input.feedback }, { merge: true });
      return { success: true, attemptId: input.attemptId };
    } else {
      // This is a new attempt to be created
      const newAttemptRef = await addDoc(attemptsCol, {
        quizId: input.quizId,
        userId: input.userId,
        answers: input.answers,
        score: input.score,
        topic: input.topic,
        totalQuestions: input.totalQuestions,
        attemptTime: serverTimestamp(),
      });
      return { success: true, attemptId: newAttemptRef.id };
    }
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: "Sorry, I couldn't save your quiz attempt. " + errorMessage };
  }
}


export type { ProvideAdaptiveFeedbackOutput };
