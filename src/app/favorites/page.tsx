'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/components/RecipeCard';

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load favorite recipes from localStorage
    const loadFavoriteRecipes = () => {
      const allRecipes = localStorage.getItem('generatedRecipes');
      const mockRecipes = localStorage.getItem('mockRecipes');
      
      let recipes: Recipe[] = [];
      
      if (allRecipes) {
        try {
          recipes = JSON.parse(allRecipes);
        } catch (error) {
          console.error('Error parsing generated recipes:', error);
        }
      }
      
      if (mockRecipes) {
        try {
          recipes = [...recipes, ...JSON.parse(mockRecipes)];
        } catch (error) {
          console.error('Error parsing mock recipes:', error);
        }
      }
      
      // Filter recipes that are marked as favorite
      const favorites = recipes.filter(recipe => recipe.favorite);
      setFavoriteRecipes(favorites);
    };

    loadFavoriteRecipes();
    
    // Listen for changes in localStorage
    window.addEventListener('storage', loadFavoriteRecipes);
    return () => window.removeEventListener('storage', loadFavoriteRecipes);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredRecipes = favoriteRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen p-4 bg-secondary">
      <Navbar onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">Favorite Recipes</h1>
        
        {searchTerm && (
          <p className="text-gray-600 mb-4">
            Showing results for "{searchTerm}"
          </p>
        )}

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm 
                ? "No favorite recipes match your search."
                : "You haven't liked any recipes yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
                variation="vertical"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;