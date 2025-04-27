'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  category: string;
  calories: number;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  tips: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  isLoading?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  favorite?: boolean;
  tags?: string[];
  cuisine?: string;
  story?: string;
  ingredients?: string[];
  ingredientNotes?: Record<string, string>;
  instructions?: string[];
  tips?: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: number;
  difficulty?: string;
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
  };
  dietaryInfo?: string[];
  variations?: string[];
  storage?: string;
  equipment?: string[];
  rating?: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  variation?: 'horizontal' | 'vertical';
  onImageLoad?: () => void;
  isLoading?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
}

interface TypingTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const TypingText: React.FC<TypingTextProps> = ({ text, delay = 0, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust typing speed here

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={className}
    >
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-1 h-4 bg-current align-middle ml-1"
        />
      )}
    </motion.span>
  );
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, variation = 'vertical', onImageLoad, isLoading = false, isFavorite = false, onFavoriteClick }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteStatus = !localIsFavorite;
    setLocalIsFavorite(newFavoriteStatus);
    
    // Update localStorage
    const storedRecipes = localStorage.getItem('favoriteRecipes');
    let recipes = [];
    if (storedRecipes) {
      recipes = JSON.parse(storedRecipes);
    }
    
    if (newFavoriteStatus) {
      // Add to favorites if not already there
      if (!recipes.some((r: Recipe) => r.id === recipe.id)) {
        recipes.push({
          ...recipe,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          tips: recipe.tips || [],
          prepTime: recipe.prepTime || 'N/A',
          difficulty: recipe.difficulty || 'N/A',
          servings: recipe.servings || 0,
          calories: recipe.calories || 0
        });
      }
    } else {
      // Remove from favorites
      recipes = recipes.filter((r: Recipe) => r.id !== recipe.id);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipes));
    onFavoriteClick?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClicked(true);
    
    // Store the complete recipe data in localStorage before navigation
    const storedRecipes = localStorage.getItem('generatedRecipes');
    let recipes = [];
    if (storedRecipes) {
      try {
        recipes = JSON.parse(storedRecipes);
      } catch (error) {
        console.error('Error parsing stored recipes:', error);
      }
    }
    
    // Ensure we have the complete recipe data with all required fields
    const completeRecipe = {
      id: recipe.id || recipe.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: recipe.title,
      description: recipe.description || '',
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      imageUrl: recipe.imageUrl || '',
      category: recipe.category || '',
      calories: recipe.calories || recipe.nutrition?.calories || 0,
      prepTime: recipe.prepTime || '30 mins',
      cookTime: recipe.cookTime || '30 mins',
      difficulty: recipe.difficulty || 'Medium',
      servings: recipe.servings || 4,
      tips: recipe.tips || [],
      story: recipe.story || '',
      cuisine: recipe.cuisine || '',
      nutrition: recipe.nutrition || {
        calories: recipe.calories || 0,
        protein: '0g',
        carbs: '0g',
        fat: '0g',
        fiber: '0g',
        sugar: '0g',
        sodium: '0g'
      }
    };
    
    // Check if recipe already exists
    const existingRecipeIndex = recipes.findIndex((r: Recipe) => r.id === completeRecipe.id);
    if (existingRecipeIndex === -1) {
      recipes.push(completeRecipe);
    } else {
      recipes[existingRecipeIndex] = completeRecipe;
    }
    
    localStorage.setItem('generatedRecipes', JSON.stringify(recipes));
    router.push(`/recipe/${encodeURIComponent(completeRecipe.id)}`);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    onImageLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
    onImageLoad?.();
  };

  const renderLoadingState = () => (
    <>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
    </>
  );

  const renderContent = () => (
    <>
      <motion.h3 
        className="text-xl font-bold mb-1"
        whileHover={{ color: "#3B82F6" }}
        transition={{ duration: 0.2 }}
      >
        {recipe.title}
      </motion.h3>
      <motion.p 
        className="text-gray-400 text-sm mb-2 line-clamp-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {recipe.description}
      </motion.p>
      <div className="flex justify-between items-center">
        <motion.span 
          className="font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {recipe.calories} Kcal
        </motion.span>
        <motion.button 
          onClick={handleFavoriteClick}
          className="p-1"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${localIsFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </motion.button>
      </div>
    </>
  );

  if (variation === 'horizontal') {
    return (
      <motion.div
        className="bg-white rounded-3xl p-4 shadow-sm flex gap-4 mb-4 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <motion.div 
          className="w-24 h-24 flex-shrink-0 relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 animate-pulse rounded-full" />
          )}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 animate-pulse rounded-full" />
          )}
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          ) : (
            <img 
              src={recipe.imageUrl}
              alt={recipe.title}
              className={`w-full h-full object-cover rounded-full ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </motion.div>
        <div className="flex-1">
          {isLoading ? renderLoadingState() : renderContent()}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-3xl p-4 shadow-sm cursor-pointer relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <motion.div 
        className="relative h-48 mb-4 overflow-hidden rounded-2xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 animate-pulse" />
        )}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 animate-pulse" />
        )}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        ) : (
          <img 
            src={recipe.imageUrl}
            alt={recipe.title}
            className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        <AnimatePresence>
          {isHovered && !isClicked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
              transition={{ duration: 0.2 }}
            >
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="text-white text-xl font-bold px-4 text-center"
              >
                {recipe.title}
              </motion.span>
            </motion.div>
          )}
          {isClicked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <div className="text-white text-center p-4">
                <span className="text-lg font-medium">Loading recipe details...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {isLoading ? renderLoadingState() : renderContent()}
    </motion.div>
  );
};

export default RecipeCard;
