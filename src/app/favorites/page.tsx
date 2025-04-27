'use client';

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleImageLoad = (index: string) => {
    setImageLoading(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const handleRemoveFavorite = (recipeId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    toast({
      title: "Removed from Favorites",
      description: "Recipe has been removed from your favorites",
    });
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
            <Heart className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Your Favorite Recipes
            </h1>
            <Heart className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All your saved Recipes in one place. Click on a recipe to view more details.
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Suggestions
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Heart className="h-16 w-16 text-orange-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Favorites Yet
              </h3>
              <p className="text-gray-600">
                Save your favorite recipes from the suggestions page to see them here.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {favorites.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard
                    recipe={{
                      id: recipe.id,
                      title: recipe.title,
                      description: recipe.description,
                      ingredients: recipe.ingredients,
                      imageUrl: recipe.imageUrl,
                      category: "Indian",
                      calories: recipe.calories,
                      prepTime: recipe.prepTime,
                      difficulty: recipe.difficulty,
                      servings: recipe.servings
                    }}
                    onImageLoad={() => handleImageLoad(recipe.id)}
                    isLoading={imageLoading[recipe.id]}
                    isFavorite={true}
                    onFavoriteClick={() => handleRemoveFavorite(recipe.id)}
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