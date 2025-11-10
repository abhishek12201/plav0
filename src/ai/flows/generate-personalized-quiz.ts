// This is a server-side code.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized quizzes based on user-provided learning content.
 *
 * The flow uses a tool to retrieve relevant information and then formulates a quiz based on that content.
 *
 * @interface GeneratePersonalizedQuizInput - Defines the input schema for the quiz generation flow.
 * @interface GeneratePersonalizedQuizOutput - Defines the output schema for the quiz generation flow.
 * @function generatePersonalizedQuiz - The main function to trigger the quiz generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the quiz generation flow.
const GeneratePersonalizedQuizInputSchema = z.object({
  learningContent: z.string().describe('The learning content to generate a quiz from.'),
  topic: z.string().describe('The topic of the learning content.'),
  numberOfQuestions: z.number().default(5).describe('The number of questions to generate for the quiz.'),
});
export type GeneratePersonalizedQuizInput = z.infer<typeof GeneratePersonalizedQuizInputSchema>;

// Define the output schema for the quiz generation flow.
const GeneratePersonalizedQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in a readable format.'),
});
export type GeneratePersonalizedQuizOutput = z.infer<typeof GeneratePersonalizedQuizOutputSchema>;

// Define a tool to retrieve relevant information based on the learning content.
const getRelevantContent = ai.defineTool(
  {
    name: 'getRelevantContent',
    description: 'Retrieves relevant information from the learning content for quiz generation.',
    inputSchema: z.object({
      learningContent: z.string().describe('The learning content to retrieve information from.'),
      topic: z.string().describe('The topic of the learning content.'),
    }),
    outputSchema: z.string().describe('The relevant information retrieved from the learning content.'),
  },
  async (input) => {
    // In a real application, this would involve a more sophisticated retrieval mechanism.
    // For example, querying a vector database or using a more advanced information retrieval technique.
    // This is a placeholder implementation that simply returns the learning content itself.
    return input.learningContent;
  }
);

// Define the prompt for generating the personalized quiz.
const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GeneratePersonalizedQuizInputSchema},
  output: {schema: GeneratePersonalizedQuizOutputSchema},
  tools: [getRelevantContent],
  prompt: `You are an expert quiz generator.

  Generate a quiz based on the following learning content. Use the getRelevantContent tool to retrieve the most important information from the learning content.

  Topic: {{{topic}}}
  Learning Content: {{{learningContent}}}
  Number of Questions: {{{numberOfQuestions}}}

  Make sure the quiz is in a readable format and includes the correct answers.
  `,
});

// Define the Genkit flow for generating personalized quizzes.
const generatePersonalizedQuizFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedQuizFlow',
    inputSchema: GeneratePersonalizedQuizInputSchema,
    outputSchema: GeneratePersonalizedQuizOutputSchema,
  },
  async (input) => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);

/**
 * Generates a personalized quiz based on the provided learning content.
 * @param input - The input containing the learning content, topic and the number of questions for the quiz.
 * @returns The generated quiz.
 */
export async function generatePersonalizedQuiz(input: GeneratePersonalizedQuizInput): Promise<GeneratePersonalizedQuizOutput> {
  return generatePersonalizedQuizFlow(input);
}
