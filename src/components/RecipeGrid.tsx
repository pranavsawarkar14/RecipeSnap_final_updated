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
    : recipes.filter(recipe => recipe.category === category);

  return (
    <div className="mb-10">
      {title && (
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-black">{title.split(' ')[0]}</span>
          {' '}
          <span className="text-gray-300">{title.split(' ').slice(1).join(' ')}</span>
        </h2>
      )}
      <div className="grid grid-cols-2 gap-4">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;
