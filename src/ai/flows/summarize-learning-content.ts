'use server';

/**
 * @fileOverview A flow that summarizes learning content for students.
 *
 * - summarizeLearningContent - A function that summarizes the learning content.
 * - SummarizeLearningContentInput - The input type for the summarizeLearningContent function.
 * - SummarizeLearningContentOutput - The return type for the summarizeLearningContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLearningContentInputSchema = z.object({
  content: z.string().describe('The learning content to be summarized.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the learning material, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeLearningContentInput = z.infer<
  typeof SummarizeLearningContentInputSchema
>;

const SummarizeLearningContentOutputSchema = z.object({
  summary: z.string().describe('The summary of the learning content.'),
});
export type SummarizeLearningContentOutput = z.infer<
  typeof SummarizeLearningContentOutputSchema
>;

export async function summarizeLearningContent(
  input: SummarizeLearningContentInput
): Promise<SummarizeLearningContentOutput> {
  return summarizeLearningContentFlow(input);
}

const summarizeLearningContentPrompt = ai.definePrompt({
  name: 'summarizeLearningContentPrompt',
  input: {schema: SummarizeLearningContentInputSchema},
  output: {schema: SummarizeLearningContentOutputSchema},
  prompt: `Summarize the following learning content for a student. Be concise and focus on the key concepts.
  {{#if photoDataUri}}
  Also consider the content from the following image.
  Image: {{media url=photoDataUri}}
  {{/if}}
  Content: {{{content}}}`,
});

const summarizeLearningContentFlow = ai.defineFlow(
  {
    name: 'summarizeLearningContentFlow',
    inputSchema: SummarizeLearningContentInputSchema,
    outputSchema: SummarizeLearningContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeLearningContentPrompt(input);
    return output!;
  }
);
