'use client';

import { Recipe } from './RecipeCard';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
  category: string;
  title?: string;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, category, title }) => {
  const filteredRecipes = category === 'All' 
    ? recipes 
    : recipes.filter(recipe => {
        const recipeCategory = recipe.category?.toLowerCase() || '';
        const recipeCuisine = recipe.cuisine?.toLowerCase() || '';
        const targetCategory = category.toLowerCase();
        return recipeCategory === targetCategory || recipeCuisine === targetCategory;
      });

  return (
    <div className="mb-10">
      {title && (
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-black">{title.split(' ')[0]}</span>
          {' '}
          <span className="text-gray-300">{title.split(' ').slice(1).join(' ')}</span>
        </h2>
      )}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No recipes found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;
