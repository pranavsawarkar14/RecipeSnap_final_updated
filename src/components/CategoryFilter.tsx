import { useState } from 'react';
import { 
  Salad, 
  UtensilsCrossed, 
  Apple, 
  FilterX, 
  Egg, 
  Fish, 
  Pizza, 
  Cookie, 
  Coffee,
  Soup,
  Sandwich,
  IceCream,
  Cake,
  Drumstick,
  Beef,
  Milk,
  Beer,
  Wine,
  Leaf,
  Vegan
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Category = 
  | 'All' 
  | 'Vegetable' 
  | 'Rice' 
  | 'Fruit' 
  | 'Breakfast' 
  | 'Seafood' 
  | 'Fast Food' 
  | 'Dessert' 
  | 'Beverages'
  | 'Soup'
  | 'Sandwich'
  | 'Ice Cream'
  | 'Cake'
  | 'Chicken'
  | 'Beef'
  | 'Dairy'
  | 'Beer'
  | 'Wine'
  | 'Vegan'
  | 'Healthy';

interface CategoryFilterProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, setActiveCategory }) => {
  const categories: { name: Category; icon: JSX.Element; color: string; hoverColor: string }[] = [
    { name: 'All', icon: <FilterX className="w-5 h-5" />, color: 'bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300',
      hoverColor: 'hover:from-blue-400 hover:via-indigo-400 hover:to-purple-400'
       },
    { name: 'Vegetable', icon: <Salad className="w-5 h-5" />, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', hoverColor: 'hover:from-emerald-600 hover:to-emerald-700' },
    { name: 'Rice', icon: <UtensilsCrossed className="w-5 h-5" />, color: 'bg-gradient-to-r from-amber-400 to-amber-500', hoverColor: 'hover:from-amber-500 hover:to-amber-600' },
    { name: 'Fruit', icon: <Apple className="w-5 h-5" />, color: 'bg-gradient-to-r from-rose-500 to-rose-600', hoverColor: 'hover:from-rose-600 hover:to-rose-700' },
    { name: 'Breakfast', icon: <Egg className="w-5 h-5" />, color: 'bg-gradient-to-r from-yellow-400 to-yellow-500', hoverColor: 'hover:from-yellow-500 hover:to-yellow-600' },
    { name: 'Seafood', icon: <Fish className="w-5 h-5" />, color: 'bg-gradient-to-r from-cyan-500 to-cyan-600', hoverColor: 'hover:from-cyan-600 hover:to-cyan-700' },
    { name: 'Fast Food', icon: <Pizza className="w-5 h-5" />, color: 'bg-gradient-to-r from-orange-500 to-orange-600', hoverColor: 'hover:from-orange-600 hover:to-orange-700' },
    { name: 'Dessert', icon: <Cookie className="w-5 h-5" />, color: 'bg-gradient-to-r from-pink-400 to-pink-500', hoverColor: 'hover:from-pink-500 hover:to-pink-600' },
    { name: 'Beverages', icon: <Coffee className="w-5 h-5" />, color: 'bg-gradient-to-r from-amber-700 to-amber-800', hoverColor: 'hover:from-amber-800 hover:to-amber-900' },
    { name: 'Soup', icon: <Soup className="w-5 h-5" />, color: 'bg-gradient-to-r from-teal-400 to-teal-500', hoverColor: 'hover:from-teal-500 hover:to-teal-600' },
    { name: 'Sandwich', icon: <Sandwich className="w-5 h-5" />, color: 'bg-gradient-to-r from-amber-300 to-amber-400', hoverColor: 'hover:from-amber-400 hover:to-amber-500' },
    { name: 'Ice Cream', icon: <IceCream className="w-5 h-5" />, color: 'bg-gradient-to-r from-indigo-300 to-indigo-400', hoverColor: 'hover:from-indigo-400 hover:to-indigo-500' },
    { name: 'Cake', icon: <Cake className="w-5 h-5" />, color: 'bg-gradient-to-r from-purple-400 to-purple-500', hoverColor: 'hover:from-purple-500 hover:to-purple-600' },
    { name: 'Chicken', icon: <Drumstick className="w-5 h-5" />, color: 'bg-gradient-to-r from-red-400 to-red-500', hoverColor: 'hover:from-red-500 hover:to-red-600' },
    { name: 'Beef', icon: <Beef className="w-5 h-5" />, color: 'bg-gradient-to-r from-red-600 to-red-700', hoverColor: 'hover:from-red-700 hover:to-red-800' },
    { name: 'Dairy', icon: <Milk className="w-5 h-5" />, color: 'bg-gradient-to-r from-blue-300 to-blue-400', hoverColor: 'hover:from-blue-400 hover:to-blue-500' },
    { name: 'Beer', icon: <Beer className="w-5 h-5" />, color: 'bg-gradient-to-r from-yellow-300 to-yellow-400', hoverColor: 'hover:from-yellow-400 hover:to-yellow-500' },
    { name: 'Wine', icon: <Wine className="w-5 h-5" />, color: 'bg-gradient-to-r from-purple-500 to-purple-600', hoverColor: 'hover:from-purple-600 hover:to-purple-700' },
    { name: 'Vegan', icon: <Leaf className="w-5 h-5" />, color: 'bg-gradient-to-r from-green-400 to-green-500', hoverColor: 'hover:from-green-500 hover:to-green-600' },
    { name: 'Healthy', icon: <Vegan className="w-5 h-5" />, color: 'bg-gradient-to-r from-lime-400 to-lime-500', hoverColor: 'hover:from-lime-500 hover:to-lime-600' },
  ];

  return (
    <div className="py-4">
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-4 no-scrollbar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={cn(
              "flex items-center px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg",
              activeCategory === category.name
                ? `${category.color} ${category.hoverColor} text-white border-transparent`
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.05,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
          >
            <motion.div 
              className="mr-2"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {category.icon}
            </motion.div>
            <span className="text-sm font-medium">{category.name}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryFilter;

