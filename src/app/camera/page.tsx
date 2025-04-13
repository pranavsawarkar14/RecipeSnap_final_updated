'use client';

import {useState, useEffect, useRef} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from "@/hooks/use-toast";
import {identifyIngredients} from '@/ai/flows/identify-ingredients';
import {generateRecipeSuggestions} from '@/ai/flows/generate-recipe-suggestions';
import {generateDetailedRecipe} from '@/ai/flows/generate-detailed-recipe';
import {Recipe} from "@/components/RecipeCard";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Languages} from "@/components/LanguageFilter";
import {Camera } from "lucide-react";
import {useRouter} from "next/navigation";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

const CameraPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const [language, setLanguage] = useState<Languages>("en");
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [generatedRecipesHeading, setGeneratedRecipesHeading] = useState("Generated Recipes:"); // Default English

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, []);

  useEffect(() => {
    const updateHeading = () => {
      switch (language) {
        case "mr":
          setGeneratedRecipesHeading("व्युत्पन्न पाककृती:"); // Marathi
          break;
        case "hi":
          setGeneratedRecipesHeading("उत्पन्न व्यंजन:"); // Hindi
          break;
        case "es":
          setGeneratedRecipesHeading("Recetas generadas:"); // Spanish
          break;
        case "fr":
          setGeneratedRecipesHeading("Recettes générées:"); // French
          break;
        case "de":
          setGeneratedRecipesHeading("Generierte Rezepte:"); // German
          break;
        case "ja":
          setGeneratedRecipesHeading("生成されたレシピ:"); // Japanese
          break;
        default:
          setGeneratedRecipesHeading("Generated Recipes:"); // English
          break;
      }
    };

    updateHeading();
  }, [language]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRecipes = async () => {
    if (!image) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please upload an image to generate recipes.',
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Identify ingredients
      const ingredientResult = await identifyIngredients({photoUrl: image});
      const identifiedIngredients = ingredientResult.ingredients;
      setIngredients(identifiedIngredients);

      // 2. Generate recipe suggestions
      const recipeResult = await generateRecipeSuggestions({ingredients: identifiedIngredients, language: language});
      const recipeSuggestions = recipeResult.recipes;

      // 3. Generate detailed instructions for each recipe
      const recipesWithInstructions = await Promise.all(recipeSuggestions.map(async recipe => {
        try {
          const detailedRecipeResult = await generateDetailedRecipe({
            recipeName: recipe.name,
            ingredients: recipe.ingredients,
            language: language,
          });
          return {
            ...recipe,
            instructions: detailedRecipeResult.instructions,
            description: detailedRecipeResult.description,
            tipsAndTricks: detailedRecipeResult.tipsAndTricks,
          };
        } catch (error: any) {
          console.error(`Error generating detailed recipe for ${recipe.name}:`, error);
          toast({
            variant: 'destructive',
            title: 'Error Generating Detailed Recipe',
            description: `Failed to generate detailed recipe for ${recipe.name}. Please try again.`,
          });
          return {
            ...recipe,
            instructions: [],
            description: 'Failed to generate description.',
            tipsAndTricks: [],
          };
        }
      }));

      setRecipes(recipesWithInstructions.map(recipe => ({
        id: recipe.name, // Use recipe name as ID (assuming unique)
        title: recipe.name,
        description: recipe.description || 'No description available.',
        instructions: recipe.instructions,
        tipsAndTricks: recipe.tipsAndTricks,
        calories: 200, // Replace with actual data if available
        imageUrl: 'https://picsum.photos/400/200', // Dummy image
        category: 'Generated',
        canMake: recipe.canMake,
        href: `/recipe/${encodeURIComponent(recipe.name)}`, // Add href
      })));

      toast({
        title: 'Recipes Generated!',
        description: 'Check out the delicious recipes we found for you.',
      });
    } catch (error: any) {
      console.error('Error generating recipes:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Recipes',
        description: error.message || 'Failed to generate recipes. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-secondary">
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-md">
        <CardHeader>
          <CardTitle>Generate Recipes from Image</CardTitle>
          <CardDescription>Upload an image of ingredients to get recipe suggestions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            asChild={false}
            disabled={isLoading}
            className="mt-2 bg-accent text-primary-foreground hover:bg-accent-foreground"
            onClick={() => document.getElementById('image-upload')?.click()}
            htmlFor = "image-upload"
          >

              {isLoading ? 'Loading...' : (
                  <>
                    <Camera className="mr-2 h-4 w-4"/>
                      Upload Image
                  </>
              )}

          </Button>

          {image && (
            <img src={image} alt="Uploaded ingredients" className="max-w-full h-auto rounded-md mt-4"/>
          )}

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language"/>
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

          <Button
            onClick={generateRecipes}
            disabled={isLoading || !image}
            className="mt-4 bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            {isLoading ? 'Generating Recipes...' : 'Generate Recipes'}
          </Button>

          {ingredients.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Identified Ingredients:</h3>
              <ul>
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {recipes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{generatedRecipesHeading}</h3>
              <ul>
                {recipes.map((recipe, index) => (
                  <li key={index}>
                    <Button variant="link" onClick={() => router.push(`/recipe/${encodeURIComponent(recipe.title)}`)}>{recipe.title}</Button>
                    <p>{recipe.description}</p>
                    {recipe.tipsAndTricks && recipe.tipsAndTricks.length > 0 && (
                      <>
                        <h4>Tips and Tricks:</h4>
                        <ul>
                          {recipe.tipsAndTricks.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {recipe.instructions && recipe.instructions.length > 0 && (
                      <>
                        <h4>Instructions:</h4>
                        <ol>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraPage;
