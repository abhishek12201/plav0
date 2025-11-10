"use server";
import {
  createPersonalizedStudyPlan as createPlan,
  type CreatePersonalizedStudyPlanInput,
} from "@/ai/flows/create-personalized-study-plan";
import {
  generatePersonalizedQuiz as generateQuiz,
  type GeneratePersonalizedQuizInput,
} from "@/ai/flows/generate-personalized-quiz";
import {
  provideAdaptiveFeedback as provideFeedback,
  type ProvideAdaptiveFeedbackInput,
} from "@/ai/flows/provide-adaptive-feedback";
import {
  summarizeLearningContent as summarize,
  type SummarizeLearningContentInput,
} from "@/ai/flows/summarize-learning-content";

export async function createPersonalizedStudyPlan(
  input: CreatePersonalizedStudyPlanInput
) {
  try {
    return await createPlan(input);
  } catch (error) {
    console.error("Error creating study plan:", error);
    return { studyPlan: "Sorry, I couldn't generate a study plan at the moment. Please try again later." };
  }
}

export async function generatePersonalizedQuiz(
  input: GeneratePersonalizedQuizInput
) {
  try {
    return await generateQuiz(input);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { quiz: "Sorry, I couldn't generate a quiz at the moment. Please try again later." };
  }
}

export async function provideAdaptiveFeedback(
  input: ProvideAdaptiveFeedbackInput
) {
  try {
    return await provideFeedback(input);
  } catch (error) {
    console.error("Error providing feedback:", error);
    return { feedback: "Sorry, I couldn't provide feedback at the moment. Please try again later." };
  }
}

export async function summarizeLearningContent(
  input: SummarizeLearningContentInput
) {
  try {
    return await summarize(input);
  } catch (error) {
    console.error("Error summarizing content:", error);
    return { summary: "Sorry, I couldn't summarize the content at the moment. Please try again later." };
  }
}
