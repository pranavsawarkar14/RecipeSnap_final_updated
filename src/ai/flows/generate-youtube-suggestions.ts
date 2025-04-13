'use server';
/**
 * @fileOverview Generates YouTube video suggestions based on a recipe description and specified language.
 *
 * - getYoutubeVideoSuggestions - A function that generates YouTube video suggestions in a given language.
 * - GenerateYoutubeVideoSuggestionsInput - The input type for the getYoutubeVideoSuggestions function.
 * - GenerateYoutubeVideoSuggestionsOutput - The return type for the getYoutubeVideoSuggestions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateYoutubeVideoSuggestionsInputSchema = z.object({
  recipeDescription: z.string().describe('The text description of the recipe to generate YouTube video suggestions for.'),
  language: z.string().describe('The language in which to generate the YouTube video suggestions.').optional().default('English'),
});
export type GenerateYoutubeVideoSuggestionsInput = z.infer<typeof GenerateYoutubeVideoSuggestionsInputSchema>;

const GenerateYoutubeVideoSuggestionsOutputSchema = z.object({
  youtubeVideoSuggestions: z.array(
    z.string().describe('A list of YouTube video IDs that are relevant to the recipe description.')
  ).describe('The YouTube video IDs that are relevant to the recipe description.'),
});
export type GenerateYoutubeVideoSuggestionsOutput = z.infer<typeof GenerateYoutubeVideoSuggestionsOutputSchema>;

export async function getYoutubeVideoSuggestions(input: GenerateYoutubeVideoSuggestionsInput): Promise<GenerateYoutubeVideoSuggestionsOutput> {
  return generateYoutubeVideoSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYoutubeVideoSuggestionsPrompt',
  input: {
    schema: z.object({
      recipeDescription: z.string().describe('The text description of the recipe to generate YouTube video suggestions for.'),
      language: z.string().describe('The language in which to generate the YouTube video suggestions.').optional().default('English'),
    }),
  },
  output: {
    schema: z.object({
      youtubeVideoSuggestions: z.array(
        z.string().describe('A list of YouTube video IDs that are relevant to the recipe description.')
      ).describe('The YouTube video IDs that are relevant to the recipe description.'),
    }),
  },
  prompt: `You are a helpful assistant that suggests YouTube videos based on a recipe description. You must respond in the language requested. The YouTube video suggestions should be in {{{language}}} language.

Recipe Description: {{{recipeDescription}}}

Generate a list of YouTube video IDs that are relevant to the recipe description in {{{language}}}.`,
});

const generateYoutubeVideoSuggestionsFlow = ai.defineFlow<
  typeof GenerateYoutubeVideoSuggestionsInputSchema,
  typeof GenerateYoutubeVideoSuggestionsOutputSchema
>(
  {
    name: 'generateYoutubeVideoSuggestionsFlow',
    inputSchema: GenerateYoutubeVideoSuggestionsInputSchema,
    outputSchema: GenerateYoutubeVideoSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
