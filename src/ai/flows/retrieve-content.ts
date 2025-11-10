'use server';
/**
 * @fileOverview A content retrieval AI agent.
 *
 * - retrieveContent - A function that handles the content retrieval process.
 * - RetrieveContentInput - The input type for the retrieveContent function.
 * - RetrieveContentOutput - The return type for the retrieveContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveContentInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic to retrieve content for (e.g., "Binary Trees").'),
});
export type RetrieveContentInput = z.infer<typeof RetrieveContentInputSchema>;

const RetrieveContentOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, tailored summary of the content on the chosen topic.'
    ),
});
export type RetrieveContentOutput = z.infer<
  typeof RetrieveContentOutputSchema
>;

export async function retrieveContent(
  input: RetrieveContentInput
): Promise<RetrieveContentOutput> {
  return retrieveContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retrieveContentPrompt',
  input: {schema: RetrieveContentInputSchema},
  output: {schema: RetrieveContentOutputSchema},
  prompt: `You are a Content Retriever Agent. Your task is to provide a comprehensive and easy-to-understand summary on a given topic.

  Your response should be structured as if you have fetched and synthesized information from trusted educational sources like Wikipedia, GeeksforGeeks, and TutorialsPoint.

  The summary must be understandable, concise, and tailored to the chosen topic.

  Topic: {{{topic}}}

  Generate the summary now.
  `,
});

const retrieveContentFlow = ai.defineFlow(
  {
    name: 'retrieveContentFlow',
    inputSchema: RetrieveContentInputSchema,
    outputSchema: RetrieveContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
