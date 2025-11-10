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


export async function createPersonalizedStudyPlan(
  input: CreatePersonalizedStudyPlanInput
): Promise<CreatePersonalizedStudyPlanOutput> {
  try {
    return await createPlan(input);
  } catch (error) {
    console.error("Error creating study plan:", error);
    return { studyPlan: "Sorry, I couldn't generate a study plan at the moment. Please try again later." };
  }
}

export async function generatePersonalizedQuiz(
  input: GeneratePersonalizedQuizInput
): Promise<GeneratePersonalizedQuizOutput | { error: string }> {
  try {
    const result = await generateQuiz(input);
    // Add original content to pass to feedback later
    return { ...result, originalContent: input.learningContent };
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: "Sorry, I couldn't generate a quiz at the moment. Please try again later." };
  }
}

export async function provideAdaptiveFeedback(
  input: ProvideAdaptiveFeedbackInput
): Promise<ProvideAdaptiveFeedbackOutput> {
  try {
    return await provideFeedback(input);
  } catch (error) {
    console.error("Error providing feedback:", error);
    return { feedback: "Sorry, I couldn't provide feedback at the moment. Please try again later." };
  }
}

export async function summarizeLearningContent(
  input: SummarizeLearningContentInput
): Promise<SummarizeLearningContentOutput> {
  try {
    return await summarize(input);
  } catch (error) {
    console.error("Error summarizing content:", error);
    return { summary: "Sorry, I couldn't summarize the content at the moment. Please try again later." };
  }
}

export async function retrieveContent(
  input: RetrieveContentInput
): Promise<RetrieveContentOutput> {
  try {
    return await retrieve(input);
  } catch (error) {
    console.error("Error retrieving content:", error);
    return { summary: "Sorry, I couldn't retrieve content at the moment. Please try again later." };
  }
}
