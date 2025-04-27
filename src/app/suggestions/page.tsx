'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { generateRecipeSuggestions } from "@/ai/flows/generate-recipe-suggestions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ChefHat, Utensils, CookingPot, Sparkles, Heart, Share2, Filter } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

// Indian ingredients for suggestions
const indianIngredients = [
  "basmati rice", "chickpeas", "lentils", "turmeric", "cumin", "coriander",
  "garam masala", "ginger", "garlic", "onions", "tomatoes", "potatoes",
  "cauliflower", "spinach", "paneer", "yogurt", "coconut milk", "tamarind",
  "mustard seeds", "curry leaves", "fenugreek", "cardamom", "cloves",
  "cinnamon", "chili powder", "mint", "cilantro", "ghee", "coconut",
  "cashews", "almonds", "raisins", "mango", "lime", "tamarind"
];

export default function SuggestionsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<any[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavorite = (recipe: any) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === recipe.id);
    
    if (isAlreadyFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== recipe.id));
      toast({
        title: "Removed from Favorites",
        description: "Recipe has been removed from your favorites",
      });
    } else {
      setFavorites([...favorites, recipe]);
      toast({
        title: "Added to Favorites",
        description: "Recipe has been added to your favorites",
      });
    }
  };

  const getRandomIngredients = () => {
    const shuffled = [...indianIngredients].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const getUnsplashImageUrl = (query: string) => {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.error('Unsplash API key not found');
      return `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(query + " indian food")}`;
    }
    return `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query + " indian food")}&client_id=${accessKey}`;
  };

  const generateRandomSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    setImageLoading({});

    try {
      const randomIngredients = getRandomIngredients();
      
      const result = await generateRecipeSuggestions({
        ingredients: randomIngredients,
        language: "English"
      });

      if (result.recipes && result.recipes.length > 0) {
        // Initialize image loading state for each recipe
        const loadingStates = result.recipes.reduce((acc: any, _, index) => {
          acc[index] = true;
          return acc;
        }, {});
        setImageLoading(loadingStates);
        
        // Fetch images for each recipe
        const recipesWithImages = await Promise.all(
          result.recipes.map(async (recipe: any, index: number) => {
            try {
              const imageUrl = getUnsplashImageUrl(recipe.name);
              if (imageUrl.includes('api.unsplash.com')) {
                const response = await fetch(imageUrl);
                const data = await response.json();
                return {
                  ...recipe,
                  imageUrl: data.urls.regular
                };
              }
              return {
                ...recipe,
                imageUrl
              };
            } catch (error) {
              console.error('Error fetching image:', error);
              return {
                ...recipe,
                imageUrl: `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(recipe.name + " indian food")}`
              };
            }
          })
        );
        
        setSuggestions(recipesWithImages);
      } else {
        toast({
          title: "No suggestions found",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = (index: string) => {
    setImageLoading(prev => ({
      ...prev,
      [index]: false
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Indian Recipe Suggestions
            </h1>
            <ChefHat className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Discover delicious Indian recipes with our AI-powered suggestion system. 
            Get inspired with new culinary ideas every time you refresh!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-orange-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">AI-Powered</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Our AI analyzes thousands of recipes to suggest the perfect Indian dishes for you.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-orange-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <Utensils className="h-6 w-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">Authentic Flavors</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Experience the true taste of India with traditional ingredients and cooking methods.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-orange-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <CookingPot className="h-6 w-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">Easy to Make</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Step-by-step instructions make it easy to recreate these delicious dishes at home.
              </p>
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={generateRandomSuggestions}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Get Recipe Suggestions
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => {
                // Navigate to favorites page
                window.location.href = '/favorites';
              }}
            >
              <Heart className="h-4 w-4 mr-2" />
              View Favorites
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-orange-50/95 to-amber-50/95 backdrop-blur-md flex flex-col items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-center max-w-md mx-auto px-6"
              >
                <motion.div
                  className="relative mb-8 flex justify-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute -top-4 -left-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-orange-400/40" />
                  </motion.div>
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <CookingPot className="h-16 w-16 text-orange-500" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-4 -right-4"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-amber-400/40" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-orange-600 mb-2">Preparing Your Recipes</h2>
                  <p className="text-gray-600 mb-4">Discovering authentic Indian flavors...</p>
                </motion.div>

                <motion.div
                  className="flex items-center justify-center gap-2 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-orange-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-orange-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-orange-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </motion.div>

                <motion.div
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Utensils className="h-4 w-4" />
                    <span>Curating the perfect Indian culinary experience</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {suggestions.map((recipe, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard
                    recipe={{
                      id: index.toString(),
                      title: recipe.name,
                      description: recipe.description,
                      ingredients: recipe.ingredients,
                      instructions: recipe.instructions,
                      imageUrl: recipe.imageUrl,
                      category: "Indian",
                      calories: recipe.calories,
                      prepTime: recipe.prepTime,
                      cookTime: recipe.cookTime,
                      difficulty: recipe.difficulty,
                      servings: recipe.servings,
                      tips: recipe.tips
                    }}
                    onImageLoad={() => handleImageLoad(index.toString())}
                    isLoading={imageLoading[index.toString()]}
                    isFavorite={favorites.some(fav => fav.id === index.toString())}
                    onFavoriteClick={() => handleFavorite({
                      id: index.toString(),
                      title: recipe.name,
                      description: recipe.description,
                      ingredients: recipe.ingredients,
                      instructions: recipe.instructions,
                      imageUrl: recipe.imageUrl,
                      category: "Indian",
                      calories: recipe.calories,
                      prepTime: recipe.prepTime,
                      cookTime: recipe.cookTime,
                      difficulty: recipe.difficulty,
                      servings: recipe.servings,
                      tips: recipe.tips
                    })}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 