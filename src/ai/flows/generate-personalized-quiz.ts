'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized quizzes based on user-provided learning content.
 *
 * It generates a structured quiz object with multiple-choice questions.
 *
 * @interface GeneratePersonalizedQuizInput - Defines the input schema for the quiz generation flow.
 * @interface GeneratePersonalizedQuizOutput - Defines the output schema for the quiz generation flow.
 * @function generatePersonalizedQuiz - The main function to trigger the quiz generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedQuizInputSchema = z.object({
  learningContent: z
    .string()
    .describe('The learning content to generate a quiz from.'),
  topic: z.string().describe('The topic of the learning content.'),
  numberOfQuestions: z
    .number()
    .default(5)
    .describe('The number of questions to generate for the quiz.'),
  difficulty: z
    .string()
    .describe('The desired difficulty of the quiz (e.g., easy, medium, hard).'),
});
export type GeneratePersonalizedQuizInput = z.infer<
  typeof GeneratePersonalizedQuizInputSchema
>;

const QuestionSchema = z.object({
  question: z.string().describe('The text of the question.'),
  options: z
    .array(z.string())
    .describe('An array of 4 possible answers (multiple choice).'),
  correctAnswer: z
    .string()
    .describe('The correct answer from the options array.'),
});

const GeneratePersonalizedQuizOutputSchema = z.object({
  title: z.string().describe('A creative title for the quiz.'),
  questions: z
    .array(QuestionSchema)
    .describe('An array of quiz questions.'),
});
export type GeneratePersonalizedQuizOutput = z.infer<
  typeof GeneratePersonalizedQuizOutputSchema
>;

export async function generatePersonalizedQuiz(
  input: GeneratePersonalizedQuizInput
): Promise<GeneratePersonalizedQuizOutput> {
  return generatePersonalizedQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GeneratePersonalizedQuizInputSchema},
  output: {schema: GeneratePersonalizedQuizOutputSchema},
  prompt: `You are an expert quiz generator for students, specializing in educational content.

  Your task is to generate a multiple-choice quiz based on the provided learning content, topic, and difficulty level. The quiz must have exactly {{{numberOfQuestions}}} questions.

  Each question must have exactly 4 options, and one of them must be the correct answer.

  The difficulty should align with Bloom's Taxonomy:
  - 'easy': Focus on Remembering and Understanding (e.g., definitions, facts, explaining concepts).
  - 'medium': Focus on Applying and Analyzing (e.g., using information in new situations, drawing connections).
  - 'hard': Focus on Evaluating and Creating (e.g., justifying a stance, producing new or original work).

  Topic: {{{topic}}}
  Difficulty: {{{difficulty}}}
  Learning Content:
  ---
  {{{learningContent}}}
  ---
  `,
});

const generatePersonalizedQuizFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedQuizFlow',
    inputSchema: GeneratePersonalizedQuizInputSchema,
    outputSchema: GeneratePersonalizedQuizOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
