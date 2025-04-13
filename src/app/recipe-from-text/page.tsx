'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Book, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "@/components/LanguageFilter";
import { useToast } from "@/components/ui/use-toast";
import { generateRecipeFromText } from "@/ai/flows/generate-recipe-from-text";
import Navbar from "@/components/Navbar";
import {Recipe} from "@/components/RecipeCard";

const RecipeFromTextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [recipeDescription, setRecipeDescription] = useState('');
  const [language, setLanguage] = useState<Languages>("en");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    try {
      const result = await generateRecipeFromText({
        recipeDescription: recipeDescription,
        language: language,
      });
      if (result.recipes && result.recipes.length > 0) {
        setRecipes(result.recipes.map(recipe => ({
          id: recipe.name, // Assuming recipe name is unique
          title: recipe.name,
          description: recipe.instructions, // Using instructions as description
          calories: 250, // Placeholder
          imageUrl: 'https://picsum.photos/400/200', // Placeholder
          category: 'Generated', // Placeholder
          instructions: [recipe.instructions],
        })));
      } else {
        toast({
          title: "No recipes generated",
          description: "Could not generate recipes from the provided text.",
        });
        setRecipes([]);
      }
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate recipe. Please try again.",
      });
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-secondary">
      <Navbar />
      <div className="w-full max-w-md bg-card text-card-foreground shadow-md rounded-lg p-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-2xl font-bold mb-4">Generate Recipe from Text</h1>

        <Textarea
          placeholder="Enter recipe description..."
          value={recipeDescription}
          onChange={(e) => setRecipeDescription(e.target.value)}
          className="mb-4"
        />

        <Select value={language} onValueChange={setLanguage} className="mb-4">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
            <SelectItem value="mr">Marathi</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleGenerateRecipe} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Recipe"
          )}
        </Button>

        {recipes.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Generated Recipes:</h2>
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id} className="mb-2 p-2 border rounded-md">
                  <h3 className="font-semibold">{recipe.title}</h3>
                  <p className="text-sm">{recipe.description}</p>
                  {recipe.instructions && recipe.instructions.length > 0 && (
                    <>
                      <h4>Instructions:</h4>
                      <ol className="list-decimal list-inside">
                        {recipe.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeFromTextPage;
