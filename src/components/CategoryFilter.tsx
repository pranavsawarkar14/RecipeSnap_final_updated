import { useState } from 'react';
import { Salad, UtensilsCrossed, Apple, FilterX, Egg, Fish, Pizza, Cookie, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'All' | 'Vegetable' | 'Rice' | 'Fruit' | 'Breakfast' | 'Seafood' | 'Fast Food' | 'Dessert' | 'Beverages';

interface CategoryFilterProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, setActiveCategory }) => {
  const categories: { name: Category; icon: JSX.Element }[] = [
    { name: 'All', icon: <FilterX className="w-5 h-5" /> },
    { name: 'Vegetable', icon: <Salad className="w-5 h-5" /> },
    { name: 'Rice', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { name: 'Fruit', icon: <Apple className="w-5 h-5" /> },
    { name: 'Breakfast', icon: <Egg className="w-5 h-5" /> },
    { name: 'Seafood', icon: <Fish className="w-5 h-5" /> },
    { name: 'Fast Food', icon: <Pizza className="w-5 h-5" /> },
    { name: 'Dessert', icon: <Cookie className="w-5 h-5" /> },
    { name: 'Beverages', icon: <Coffee className="w-5 h-5" /> },
  ];

  return (
    <div className="py-4">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={cn(
              "flex items-center px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap",
              activeCategory === category.name
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
          >
            <div className="mr-2">
              {category.icon}
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

