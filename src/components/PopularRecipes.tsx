'use client';

import { Recipe } from './RecipeCard';
import RecipeCard from './RecipeCard';

interface PopularRecipesProps {
  recipes: Recipe[];
}

const PopularRecipes: React.FC<PopularRecipesProps> = ({ recipes }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">
        <span className="text-black">Popular</span>
        {' '}
        <span className="text-gray-300">Food</span>
      </h2>
      <div className="space-y-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} variation="horizontal" />
        ))}
      </div>
    </div>
  );
};

export default PopularRecipes;
