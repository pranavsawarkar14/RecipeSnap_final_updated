'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Clock, Users, Flame, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  category: string;
  calories: number;
  prepTime: string;
  difficulty: string;
  servings: number;
  tips?: string[];
  story?: string;
  cuisine?: string;
  nutrition?: {
    calories: number;
    carbs: number;
    protein: number;
  };
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadRecipe = () => {
      try {
        const recipeId = decodeURIComponent(params.id as string);
        
        // First try to load from generatedRecipes
        const generatedRecipes = localStorage.getItem('generatedRecipes');
        if (generatedRecipes) {
          const recipes = JSON.parse(generatedRecipes);
          const foundRecipe = recipes.find((r: Recipe) => 
            r.id === recipeId || 
            r.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === recipeId
          );
          if (foundRecipe) {
            setRecipe(foundRecipe);
            setIsLoading(false);
            return;
          }
        }

        // Then try to load from recipe-from-text page
        const savedRecipes = localStorage.getItem('savedRecipes');
        if (savedRecipes) {
          const recipes = JSON.parse(savedRecipes);
          const foundRecipe = recipes.find((r: any) => 
            r.id === recipeId || 
            r.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === recipeId
          );
          if (foundRecipe) {
            setRecipe({
              id: foundRecipe.id,
              title: foundRecipe.title,
              description: foundRecipe.description || foundRecipe.story || '',
              ingredients: foundRecipe.ingredients || [],
              instructions: foundRecipe.instructions || [],
              imageUrl: foundRecipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
              category: foundRecipe.category || foundRecipe.cuisine || 'Other',
              calories: foundRecipe.calories || foundRecipe.nutrition?.calories || 0,
              prepTime: foundRecipe.prepTime || '30 minutes',
              difficulty: foundRecipe.difficulty || 'Medium',
              servings: foundRecipe.servings || 4,
              tips: foundRecipe.tips || [],
              story: foundRecipe.story,
              cuisine: foundRecipe.cuisine,
              nutrition: foundRecipe.nutrition
            });
            setIsLoading(false);
            return;
          }
        }

        // Finally check favoriteRecipes
        const favoriteRecipes = localStorage.getItem('favoriteRecipes');
        if (favoriteRecipes) {
          const recipes = JSON.parse(favoriteRecipes);
          const foundRecipe = recipes.find((r: Recipe) => 
            r.id === recipeId || 
            r.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === recipeId
          );
          if (foundRecipe) {
            setRecipe(foundRecipe);
            setIsFavorite(true);
            setIsLoading(false);
            return;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading recipe:', error);
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Get existing favorites from localStorage
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    let favorites = [];
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }

    if (newFavoriteStatus) {
      // Add to favorites if not already there
      if (!favorites.some((r: Recipe) => r.id === recipe?.id)) {
        favorites.push({
          ...recipe,
          ingredients: recipe?.ingredients || [],
          instructions: recipe?.instructions || [],
          tips: recipe?.tips || [],
          prepTime: recipe?.prepTime || 'N/A',
          difficulty: recipe?.difficulty || 'N/A',
          servings: recipe?.servings || 0,
          calories: recipe?.calories || 0
        });
      }
    } else {
      // Remove from favorites
      favorites = favorites.filter((r: Recipe) => r.id !== recipe?.id);
    }

    // Save updated favorites to localStorage
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));

    toast({
      title: newFavoriteStatus ? "Added to favorites" : "Removed from favorites",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pb-20">
          <div className="sticky top-0 bg-white z-10 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-100 rounded-lg" />
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pb-20">
          <div className="sticky top-0 bg-white z-10 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
            <Button variant="outline" onClick={handleBack}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 pb-20">
        <div className="sticky top-0 bg-white z-10 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="ghost" onClick={toggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <h1 className="text-2xl font-bold text-white">{recipe.title}</h1>
              <p className="text-white/80">{recipe.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Prep Time</p>
                  <p className="font-medium">{recipe.prepTime || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-medium">{recipe.servings || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Flame className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-medium">{recipe.calories || recipe.nutrition?.calories || 'N/A'} kcal</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <ChefHat className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium">{recipe.difficulty || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {recipe.story && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">Story</h2>
              <p className="text-gray-600">{recipe.story}</p>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-gray-600"
                >
                  <span className="text-gray-500">•</span>
                  {ingredient}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-gray-600"
                >
                  <span className="font-semibold text-gray-500">{index + 1}.</span>
                  {instruction}
                </motion.li>
              ))}
            </ol>
          </div>

          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">Tips & Tricks</h2>
              <ul className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-gray-500">•</span>
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {recipe.nutrition && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">Nutrition Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-medium">{recipe.nutrition.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carbs</p>
                  <p className="font-medium">{recipe.nutrition.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="font-medium">{recipe.nutrition.protein}g</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}