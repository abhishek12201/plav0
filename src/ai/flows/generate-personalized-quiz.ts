
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized quizzes based on user-provided learning content.
 *
 * It generates a structured quiz object with multiple-choice questions and relevant image generation prompts.
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
  type: z
    .string()
    .describe("The type of question. This must always be 'multiple-choice'."),
  options: z
    .array(z.string())
    .describe('An array of 4 possible answers for multiple-choice questions.'),
  correctAnswer: z
    .string()
    .describe('The correct answer from the provided options.'),
  imagePrompt: z
    .string()
    .optional()
    .describe(
      'A detailed, descriptive text prompt for a text-to-image model to generate a photorealistic and relevant image for this question. This should be a full sentence.'
    ),
  imageUrl: z.string().optional(),
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

  Your task is to generate a quiz based on the provided learning content, topic, and difficulty level. The quiz must have exactly {{{numberOfQuestions}}} questions.
  
  All questions MUST be of type 'multiple-choice'. Each question must have exactly 4 options, and one of them must be the correct answer.

  For each question, also generate a detailed, descriptive text prompt for a text-to-image model to create a relevant, photorealistic image. This prompt should be stored in the 'imagePrompt' field.

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
    // Step 1: Generate the quiz structure and image prompts with Gemini.
    const {output: quizOutput} = await generateQuizPrompt(input);
    if (!quizOutput) {
      throw new Error('Failed to generate quiz content.');
    }

    // Step 2: For each question with an image prompt, generate an image with Imagen.
    const imageGenerationPromises = quizOutput.questions.map(async question => {
      if (question.imagePrompt) {
        try {
          const {media} = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: question.imagePrompt,
          });
          question.imageUrl = media.url;
        } catch (error) {
          console.warn(
            `Image generation failed for prompt: "${question.imagePrompt}". Skipping image for this question.`,
            error
          );
          // Don't block the whole quiz if one image fails.
          question.imageUrl = undefined;
        }
      }
      return question;
    });

    // Wait for all image generations to complete.
    const questionsWithImages = await Promise.all(imageGenerationPromises);
    quizOutput.questions = questionsWithImages;

    return quizOutput;
  }
);
