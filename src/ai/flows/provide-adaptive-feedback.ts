'use server';

/**
 * @fileOverview Provides AI-driven, customized feedback on quizzes.
 *
 * - provideAdaptiveFeedback - A function that provides customized feedback on quizzes.
 * - ProvideAdaptiveFeedbackInput - The input type for the provideAdaptiveFeedback function.
 * - ProvideAdaptiveFeedbackOutput - The return type for the provideAdaptivefeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAdaptiveFeedbackInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  questions: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.string(),
        userAnswer: z.string().optional(),
      })
    )
    .describe('The list of questions, their correct answers, and the user’s answers.'),
  score: z.number().describe('The user’s final score.'),
  studentKnowledgeLevel: z
    .string()
    .describe('The current knowledge level of the student.'),
});
export type ProvideAdaptiveFeedbackInput = z.infer<
  typeof ProvideAdaptiveFeedbackInputSchema
>;

const FeedbackItemSchema = z.object({
  question: z.string().describe('The question the user answered incorrectly.'),
  userAnswer: z.string().describe('The answer the user provided.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  explanation: z
    .string()
    .describe(
      'A clear and concise explanation of why the correct answer is right and where the user might have gone wrong.'
    ),
});

const ProvideAdaptiveFeedbackOutputSchema = z.object({
  overallFeedback: z
    .string()
    .describe(
      'A general, encouraging summary of the student’s performance on the quiz.'
    ),
  detailedFeedback: z
    .array(FeedbackItemSchema)
    .describe(
      'An array of specific feedback for each question the user answered incorrectly.'
    ),
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
  prompt: `You are an AI mentor providing adaptive feedback to a student based on their quiz results.

  Quiz: {{{quizTitle}}}
  Score: {{{score}}} out of {{{questions.length}}}
  Student's Knowledge Level: {{{studentKnowledgeLevel}}}
  Questions and Answers:
  {{#each questions}}
  - Question: "{{this.question}}"
    User Answer: "{{this.userAnswer}}"
    Correct Answer: "{{this.correctAnswer}}"
  {{/each}}

  Your task is to provide constructive, individualized, and encouraging feedback.

  1.  **Overall Feedback**: Start with a general summary of the student's performance. Be encouraging and positive, regardless of the score.
  2.  **Detailed Feedback**: For EACH question the user answered incorrectly, provide a detailed explanation. Explain why their answer was incorrect and why the correct answer is right. Offer a clear, easy-to-understand concept review.

  Generate the structured feedback now.
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
