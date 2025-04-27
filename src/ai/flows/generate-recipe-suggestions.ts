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
      description: z.string().describe('A detailed description of the recipe.'),
      ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
      instructions: z.array(z.string()).describe('The step-by-step instructions for the recipe.'),
      prepTime: z.string().describe('The preparation time for the recipe.'),
      cookTime: z.string().describe('The cooking time for the recipe.'),
      servings: z.number().describe('The number of servings the recipe makes.'),
      difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the recipe.'),
      calories: z.number().describe('The approximate calories per serving.'),
      tips: z.array(z.string()).describe('Cooking tips and tricks for the recipe.'),
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
      language: z.string().describe('The language in which to generate the recipe suggestions.').optional().default('English'),
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(
        z.object({
          name: z.string().describe('The name of the recipe.'),
          description: z.string().describe('A detailed description of the recipe.'),
          ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
          instructions: z.array(z.string()).describe('The step-by-step instructions for the recipe.'),
          prepTime: z.string().describe('The preparation time for the recipe.'),
          cookTime: z.string().describe('The cooking time for the recipe.'),
          servings: z.number().describe('The number of servings the recipe makes.'),
          difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the recipe.'),
          calories: z.number().describe('The approximate calories per serving.'),
          tips: z.array(z.string()).describe('Cooking tips and tricks for the recipe.'),
          canMake: z.boolean().describe('Whether the recipe can be made based on available ingredients'),
        })
      ).describe('A list of recipe suggestions.'),
    }),
  },
  prompt: `You are a helpful recipe assistant specializing in Indian cuisine. Given the following ingredients, suggest authentic Indian recipes that can be made. You must respond in the language requested. The recipes should be in {{{language}}} language.

Ingredients: {{{ingredients}}}

For each recipe:
1. Generate an authentic Indian recipe name
2. Provide a detailed description including:
   - Regional origin and cultural significance
   - Traditional occasions when this dish is served
   - Regional variations and adaptations
   - Historical context if relevant

3. List all required ingredients with quantities
4. Provide detailed step-by-step instructions including:
   - Traditional Indian cooking techniques
   - Proper spice tempering (tadka) methods
   - Correct order of adding ingredients
   - Traditional cooking times and temperatures
   - Authentic presentation methods

5. Include:
   - Preparation time
   - Cooking time
   - Number of servings
   - Difficulty level (Easy/Medium/Hard)
   - Approximate calories per serving
   - Expert tips and tricks for perfecting the recipe

Focus on popular Indian dishes like:
- Curries (butter chicken, palak paneer, chana masala)
- Biryanis and pulaos
- Dals and sambars
- Indian breads (naan, roti, paratha)
- Snacks (samosas, pakoras, chaat)
- Desserts (gulab jamun, kheer, rasmalai)

Ensure the recipes maintain authentic Indian flavors and cooking methods.`,
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
