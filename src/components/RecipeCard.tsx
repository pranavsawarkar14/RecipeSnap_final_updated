'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  calories: number;
  imageUrl: string;
  category: string;
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

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, variation = 'vertical' }) => {
  const [isFavorite, setIsFavorite] = useState(recipe.favorite || false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Load favorite status from localStorage
    const storedRecipes = localStorage.getItem('generatedRecipes');
    if (storedRecipes) {
      try {
        const recipes = JSON.parse(storedRecipes);
        const storedRecipe = recipes.find((r: Recipe) => r.id === recipe.id);
        if (storedRecipe) {
          setIsFavorite(storedRecipe.favorite || false);
        }
      } catch (error) {
        console.error('Error parsing stored recipes:', error);
      }
    }
  }, [recipe.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Update localStorage
    const storedRecipes = localStorage.getItem('generatedRecipes');
    if (storedRecipes) {
      try {
        const recipes = JSON.parse(storedRecipes);
        const updatedRecipes = recipes.map((r: Recipe) => 
          r.id === recipe.id ? { ...r, favorite: newFavoriteStatus } : r
        );
        localStorage.setItem('generatedRecipes', JSON.stringify(updatedRecipes));
      } catch (error) {
        console.error('Error updating favorite status:', error);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClicked(true);
    // Navigate after animation
    setTimeout(() => {
      window.location.href = `/recipe/${encodeURIComponent(recipe.id)}`;
    }, 1000);
  };

  if (variation === 'horizontal') {
    return (
      <Link href={`/recipe/${encodeURIComponent(recipe.id)}`} className="block">
        <motion.div
          className="bg-white rounded-3xl p-4 shadow-sm flex gap-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div 
            className="w-24 h-24 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
          <div className="flex-1">
            <motion.h3 
              className="text-xl font-bold mb-1"
              whileHover={{ color: "#3B82F6" }}
              transition={{ duration: 0.2 }}
            >
              {recipe.title}
            </motion.h3>
            <motion.p 
              className="text-gray-400 text-sm mb-2"
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
                onClick={toggleFavorite}
                className="p-1"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  className={`h-6 w-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-3xl p-4 shadow-sm"
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
      style={{ cursor: 'pointer' }}
    >
      <motion.div 
        className="relative h-48 mb-4 overflow-hidden rounded-2xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <AnimatePresence>
          {isHovered && !isClicked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
              transition={{ duration: 0.2 }}
            >
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="text-white font-medium"
              >
                Click to view recipe
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
                <TypingText 
                  text="Loading recipe details..." 
                  className="text-lg font-medium"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <motion.h3 
        className="text-xl font-bold mb-1"
        whileHover={{ color: "#3B82F6" }}
        transition={{ duration: 0.2 }}
      >
        <TypingText text={recipe.title} delay={0.1} />
      </motion.h3>
      
      <motion.p 
        className="text-gray-400 text-sm mb-2 line-clamp-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <TypingText text={recipe.description} delay={0.2} />
      </motion.p>
      
      <div className="flex justify-between items-center">
        <motion.span 
          className="font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TypingText text={`${recipe.calories} Kcal`} delay={0.3} />
        </motion.span>
        <motion.button 
          onClick={toggleFavorite}
          className="p-1"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            className={`h-6 w-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
