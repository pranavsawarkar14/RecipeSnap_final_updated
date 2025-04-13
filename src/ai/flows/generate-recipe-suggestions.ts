'use server';
/**
 * @fileOverview Generates recipe suggestions based on identified ingredients and a specified language.
 *
 * - generateRecipeSuggestions - A function that generates recipe suggestions in a given language.
 * - GenerateRecipeSuggestionsInput - The input type for the generateRecipeSuggestions function.
 * - GenerateRecipeSuggestionsOutput - The return type for the generateRecipeSuggestions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeSuggestionsInputSchema = z.object({
  ingredients: z.array(
    z.string().describe('A list of ingredients identified from the image.')
  ).describe('The ingredients identified from the image.'),
  language: z.string().describe('The language in which to generate the recipe suggestions.').optional().default('English'), // Added language input
});
export type GenerateRecipeSuggestionsInput = z.infer<typeof GenerateRecipeSuggestionsInputSchema>;

const GenerateRecipeSuggestionsOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
      instructions: z.string().describe('The instructions for the recipe.'),
      canMake: z.boolean().describe('Whether the recipe can be made based on available ingredients'),
    })
  ).describe('A list of recipe suggestions.'),
});
export type GenerateRecipeSuggestionsOutput = z.infer<typeof GenerateRecipeSuggestionsOutputSchema>;

export async function generateRecipeSuggestions(input: GenerateRecipeSuggestionsInput): Promise<GenerateRecipeSuggestionsOutput> {
  return generateRecipeSuggestionsFlow(input);
}

const canMakeRecipe = ai.defineTool({
  name: 'canMakeRecipe',
  description: 'Determines if a recipe can be made based on a list of available ingredients.',
  inputSchema: z.object({
    recipeIngredients: z.array(z.string()).describe('A list of ingredients required for the recipe'),
    availableIngredients: z.array(z.string()).describe('A list of ingredients available to the user'),
  }),
  outputSchema: z.boolean(),
},
async input => {
    // Check if all recipe ingredients are in available ingredients
    return input.recipeIngredients.every(recipeIngredient =>
      input.availableIngredients.includes(recipeIngredient)
    );
  }
);

const prompt = ai.definePrompt({
  name: 'generateRecipeSuggestionsPrompt',
  input: {
    schema: z.object({
      ingredients: z.array(
        z.string().describe('A list of ingredients identified from the image.')
      ).describe('The ingredients identified from the image.'),
      language: z.string().describe('The language in which to generate the recipe suggestions.').optional().default('English'), // Added language input
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(
        z.object({
          name: z.string().describe('The name of the recipe.'),
          ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
          instructions: z.string().describe('The instructions for the recipe.'),
          canMake: z.boolean().describe('Whether the recipe can be made based on available ingredients'),
        })
      ).describe('A list of recipe suggestions.'),
    }),
  },
  prompt: `You are a helpful recipe assistant. Given the following ingredients, suggest recipes that can be made. You must respond in the language requested. The recipes should be in {{{language}}} language.

Ingredients: {{{ingredients}}}

For each recipe, generate the recipe name, a list of ingredients, and instructions in {{{language}}}. Use the 'canMakeRecipe' tool to determine whether the user can actually make the recipe.`,
  tools: [canMakeRecipe],
});

const generateRecipeSuggestionsFlow = ai.defineFlow<
  typeof GenerateRecipeSuggestionsInputSchema,
  typeof GenerateRecipeSuggestionsOutputSchema
>(
  {
    name: 'generateRecipeSuggestionsFlow',
    inputSchema: GenerateRecipeSuggestionsInputSchema,
    outputSchema: GenerateRecipeSuggestionsOutputSchema,
  },
  async input => {
    const promptResult = await prompt(input);
    const recipes = promptResult.output!.recipes.map(async recipe => {
      const canMake = await canMakeRecipe({
        recipeIngredients: recipe.ingredients,
        availableIngredients: input.ingredients,
      });
      return {
        ...recipe,
        canMake,
      };
    });

    // Wait for all promises to resolve
    const resolvedRecipes = await Promise.all(recipes);

    return {
      recipes: resolvedRecipes,
    };
  }
);
