'use server';
/**
 * @fileOverview Creates personalized study plans based on student progress and knowledge gaps.
 *
 * - createPersonalizedStudyPlan - A function that generates a personalized study plan.
 * - CreatePersonalizedStudyPlanInput - The input type for the createPersonalizedStudyPlan function.
 * - CreatePersonalizedStudyPlanOutput - The return type for the createPersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePersonalizedStudyPlanInputSchema = z.object({
  studentProgress: z
    .string()
    .describe('A summary of the student’s progress in the course.'),
  knowledgeGaps: z.string().describe('Identified knowledge gaps of the student.'),
  learningObjectives: z.string().describe('The learning objectives for the student.'),
});
export type CreatePersonalizedStudyPlanInput = z.infer<
  typeof CreatePersonalizedStudyPlanInputSchema
>;

const CreatePersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A personalized study plan for the student.'),
});
export type CreatePersonalizedStudyPlanOutput = z.infer<
  typeof CreatePersonalizedStudyPlanOutputSchema
>;

export async function createPersonalizedStudyPlan(
  input: CreatePersonalizedStudyPlanInput
): Promise<CreatePersonalizedStudyPlanOutput> {
  return createPersonalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPersonalizedStudyPlanPrompt',
  input: {schema: CreatePersonalizedStudyPlanInputSchema},
  output: {schema: CreatePersonalizedStudyPlanOutputSchema},
  prompt: `You are an AI assistant designed to create personalized study plans for students.

  Based on the student's progress, knowledge gaps, and learning objectives, create a study plan that addresses these areas.

  Student Progress: {{{studentProgress}}}
  Knowledge Gaps: {{{knowledgeGaps}}}
  Learning Objectives: {{{learningObjectives}}}

  Create a detailed and actionable study plan that the student can follow to improve their understanding and achieve their learning objectives.
  Response in markdown format.
  `,
});

const createPersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'createPersonalizedStudyPlanFlow',
    inputSchema: CreatePersonalizedStudyPlanInputSchema,
    outputSchema: CreatePersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
