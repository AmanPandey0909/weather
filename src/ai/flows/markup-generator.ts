// src/ai/flows/markup-generator.ts
'use server';

/**
 * @fileOverview Generates UI markup (HTML/CSS) from a description.
 *
 * - generateMarkup - A function that generates UI markup based on a text description.
 * - GenerateMarkupInput - The input type for the generateMarkup function.
 * - GenerateMarkupOutput - The return type for the generateMarkup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarkupInputSchema = z.object({
  description: z
    .string()
    .describe('A description of the UI element or layout to generate.'),
});
export type GenerateMarkupInput = z.infer<typeof GenerateMarkupInputSchema>;

const GenerateMarkupOutputSchema = z.object({
  markup: z.string().describe('The generated HTML/CSS markup.'),
});
export type GenerateMarkupOutput = z.infer<typeof GenerateMarkupOutputSchema>;

export async function generateMarkup(input: GenerateMarkupInput): Promise<GenerateMarkupOutput> {
  return generateMarkupFlow(input);
}

const generateMarkupPrompt = ai.definePrompt({
  name: 'generateMarkupPrompt',
  input: {schema: GenerateMarkupInputSchema},
  output: {schema: GenerateMarkupOutputSchema},
  prompt: `You are a UI markup generator. Generate HTML and CSS markup based on the following description: {{{description}}}. Return only the HTML and CSS code. Enclose CSS code within <style> tags.`,
});

const generateMarkupFlow = ai.defineFlow(
  {
    name: 'generateMarkupFlow',
    inputSchema: GenerateMarkupInputSchema,
    outputSchema: GenerateMarkupOutputSchema,
  },
  async input => {
    const {output} = await generateMarkupPrompt(input);
    return output!;
  }
);
