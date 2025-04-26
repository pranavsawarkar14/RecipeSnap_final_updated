'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  calories: number;
  imageUrl: string;
  category: string;
  favorite?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  variation?: 'horizontal' | 'vertical';
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, variation = 'vertical' }) => {
  const [isFavorite, setIsFavorite] = useState(recipe.favorite || false);

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

  if (variation === 'horizontal') {
    return (
      <Link href={`/recipe/${encodeURIComponent(recipe.id)}`} className="block">
        <div className="bg-white rounded-3xl p-4 shadow-sm flex gap-4 mb-4 animate-fade-in">
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{recipe.title}</h3>
            <p className="text-gray-400 text-sm mb-2">{recipe.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-medium">{recipe.calories} Kcal</span>
              <button 
                onClick={toggleFavorite}
                className="p-1"
              >
                <Heart 
                  className={`h-6 w-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/recipe/${encodeURIComponent(recipe.id)}`} className="block">
      <div className="bg-white rounded-3xl p-4 shadow-sm animate-fade-in">
        <div className="mb-3">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-48 object-cover rounded-2xl"
          />
        </div>
        <h3 className="text-xl font-bold mb-1">{recipe.title}</h3>
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{recipe.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-medium">{recipe.calories} Kcal</span>
          <button 
            onClick={toggleFavorite}
            className="p-1"
          >
            <Heart 
              className={`h-6 w-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
