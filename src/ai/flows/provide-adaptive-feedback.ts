'use server';

/**
 * @fileOverview Provides AI-driven, customized feedback on quizzes.
 *
 * - provideAdaptiveFeedback - A function that provides customized feedback on quizzes.
 * - ProvideAdaptiveFeedbackInput - The input type for the provideAdaptiveFeedback function.
 * - ProvideAdaptiveFeedbackOutput - The return type for the provideAdaptiveFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAdaptiveFeedbackInputSchema = z.object({
  quizResults: z.string().describe('The results of the quiz taken by the student.'),
  studyMaterial: z.string().describe('The study material the quiz is based on.'),
  studentKnowledgeLevel: z.string().describe('The current knowledge level of the student.'),
});
export type ProvideAdaptiveFeedbackInput = z.infer<
  typeof ProvideAdaptiveFeedbackInputSchema
>;

const ProvideAdaptiveFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-driven, customized feedback on the quiz.'),
});
export type ProvideAdaptiveFeedbackOutput = z.infer<
  typeof ProvideAdaptiveFeedbackOutputSchema
>;

export async function provideAdaptiveFeedback(
  input: ProvideAdaptiveFeedbackInput
): Promise<ProvideAdaptiveFeedbackOutput> {
  return provideAdaptiveFeedbackFlow(input);
}

const provideAdaptiveFeedbackPrompt = ai.definePrompt({
  name: 'provideAdaptiveFeedbackPrompt',
  input: {schema: ProvideAdaptiveFeedbackInputSchema},
  output: {schema: ProvideAdaptiveFeedbackOutputSchema},
  prompt: `You are an AI mentor providing adaptive feedback to a student based on their quiz results and study material.

  Study Material: {{{studyMaterial}}}
  Quiz Results: {{{quizResults}}}
  Student Knowledge Level: {{{studentKnowledgeLevel}}}

  Provide constructive and individualized feedback to help the student understand their mistakes and improve their learning.
  Focus on specific areas where the student struggled and offer suggestions for further study.
  The feedback should be encouraging and tailored to the student's current knowledge level.
  Make sure to format the feedback in markdown.
  `,
});

const provideAdaptiveFeedbackFlow = ai.defineFlow(
  {
    name: 'provideAdaptiveFeedbackFlow',
    inputSchema: ProvideAdaptiveFeedbackInputSchema,
    outputSchema: ProvideAdaptiveFeedbackOutputSchema,
  },
  async input => {
    const {output} = await provideAdaptiveFeedbackPrompt(input);
    return output!;
  }
);
