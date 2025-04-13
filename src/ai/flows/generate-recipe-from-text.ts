'use server';
/**
 * @fileOverview Generates recipe from text description.
 *
 * - generateRecipeFromText - A function that generates recipe from text in a given language.
 * - GenerateRecipeFromTextInput - The input type for the generateRecipeFromText function.
 * - GenerateRecipeFromTextOutput - The return type for the generateRecipeFromText function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeFromTextInputSchema = z.object({
  recipeDescription: z.string().describe('The text description of the recipe to generate.'),
  language: z.string().describe('The language in which to generate the recipe instructions.').optional().default('English'),
});
export type GenerateRecipeFromTextInput = z.infer<typeof GenerateRecipeFromTextInputSchema>;

const GenerateRecipeFromTextOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
      instructions: z.string().describe('The instructions for the recipe.'),
    })
  ).describe('A list of recipe suggestions.'),
});
export type GenerateRecipeFromTextOutput = z.infer<typeof GenerateRecipeFromTextOutputSchema>;

export async function generateRecipeFromText(input: GenerateRecipeFromTextInput): Promise<GenerateRecipeFromTextOutput> {
  return generateRecipeFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeFromTextPrompt',
  input: {
    schema: z.object({
      recipeDescription: z.string().describe('The text description of the recipe to generate.'),
      language: z.string().describe('The language in which to generate the recipe instructions.').optional().default('English'),
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(
        z.object({
          name: z.string().describe('The name of the recipe.'),
          ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
          instructions: z.string().describe('The instructions for the recipe.'),
        })
      ).describe('A list of recipe suggestions.'),
    }),
  },
  prompt: `You are a recipe assistant. Given the following recipe description, generate a recipe. You must respond in the language requested. The recipes should be in {{{language}}} language.

Recipe Description: {{{recipeDescription}}}

Generate the recipe name, a list of ingredients, and instructions in {{{language}}}.`,
});

const generateRecipeFromTextFlow = ai.defineFlow<
  typeof GenerateRecipeFromTextInputSchema,
  typeof GenerateRecipeFromTextOutputSchema
>(
  {
    name: 'generateRecipeFromTextFlow',
    inputSchema: GenerateRecipeFromTextInputSchema,
    outputSchema: GenerateRecipeFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
