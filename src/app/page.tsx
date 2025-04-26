'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import RecipeGrid from '@/components/RecipeGrid';
import PopularRecipes from '@/components/PopularRecipes';
import CameraButton from '@/components/CameraButton';
import { Recipe } from '@/components/RecipeCard';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "@/components/ui/LanguageFilter";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Chicken Fried Rice',
    description: 'So irresistibly delicious',
    calories: 250,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    category: 'Vegetable',
  },
  {
    id: '2',
    title: 'Pasta Bolognese',
    description: 'True Italian classic',
    calories: 200,
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
    category: 'Rice',
  },
  {
    id: '3',
    title: 'Garlic Potatoes',
    description: 'Crispy Garlic Roasted Potatoes',
    calories: 150,
    imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf',
    category: 'Vegetable',
  },
  {
    id: '4',
    title: 'Fruit Salad',
    description: 'Sweet and refreshing mix',
    calories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7',
    category: 'Fruit',
  },
  {
    id: '5',
    title: 'Avocado Toast',
    description: 'Perfect breakfast option',
    calories: 180,
    imageUrl: 'https://www.simplotfoods.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F0dkgxhks0leg%2FkDuiYdR8XTw15l7lWLDl4%2Fa226c36c3af6960bccf788363eec61f9%2FDecemberDEC_15.jpg%3Ffm%3Dwebp&w=3840&q=75',
    category: 'Breakfast',
  },
  {
    id: '6',
    title: 'Grilled Salmon',
    description: 'Fresh and healthy seafood',
    calories: 220,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    category: 'Seafood',
  },
  {
    id: '7',
    title: 'Chocolate Cake',
    description: 'Rich and decadent dessert',
    calories: 350,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    category: 'Dessert',
  },
  {
    id: '8',
    title: 'Iced Coffee',
    description: 'Refreshing cold brew',
    calories: 90,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    category: 'Beverages',
  },
  {
    id: '9',
    title: 'Greek Salad',
    description: 'Fresh Mediterranean flavors',
    calories: 130,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    category: 'Vegetable',
  },
  {
    id: '10',
    title: 'Beef Burger',
    description: 'Classic American favorite',
    calories: 450,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    category: 'Fast Food',
  },
  {
    id: '11',
    title: 'Mushroom Risotto',
    description: 'Creamy Italian comfort food',
    calories: 320,
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
    category: 'Rice',
  },
  {
    id: '12',
    title: 'Berry Smoothie',
    description: 'Antioxidant-rich energy boost',
    calories: 180,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9PrUbij9EajJ26Ocqjo7R8TtFAu05RBpQ3w&s',
    category: 'Beverages',
  },
  {
    id: '13',
    title: 'Shrimp Tacos',
    description: 'Spicy and zesty seafood delight',
    calories: 280,
    imageUrl: 'https://images.unsplash.com/photo-1611250188496-e966043a0629',
    category: 'Seafood',
  },
  {
    id: '14',
    title: 'Pancake Stack',
    description: 'Fluffy morning treat with maple syrup',
    calories: 420,
    imageUrl: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7',
    category: 'Breakfast',
  },
  {
    id: '15',
    title: 'Tiramisu',
    description: 'Classic Italian coffee-flavored dessert',
    calories: 380,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
    category: 'Dessert',
  },
  {
    id: '16',
    title: 'Veggie Stir Fry',
    description: 'Quick and nutritious vegetable medley',
    calories: 220,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Vegetable',
  },
  {
    id: '17',
    title: 'Sushi Platter',
    description: 'Assorted fresh Japanese delicacies',
    calories: 310,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    category: 'Seafood',
  },
  {
    id: '18',
    title: 'Matcha Latte',
    description: 'Antioxidant-rich green tea beverage',
    calories: 140,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a',
    category: 'Beverages',
  },
  {
    id: '19',
    title: 'Apple Pie',
    description: 'Homestyle classic with cinnamon',
    calories: 320,
    imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9',
    category: 'Dessert',
  },
  {
    id: '20',
    title: 'Pizza Margherita',
    description: 'Simple Italian classic with fresh basil',
    calories: 285,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    category: 'Fast Food',
  }
];

type Category = 'All' | 'Vegetable' | 'Rice' | 'Fruit' | 'Breakfast' | 'Seafood' | 'Fast Food' | 'Dessert' | 'Beverages';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const {toast} = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    // In a real app, we would fetch from an API
    setRecipes(mockRecipes);

    // Display welcome toast on initial load
    toast({
      title: "Welcome to Pic 2 Plate!",
      description: "Discover healthy and delicious recipes",
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    // Mock API call for search
    const fetchSearchResults = async () => {
      if (searchTerm) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const results = mockRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const featuredRecipes = activeCategory === 'All'
    ? recipes
    : recipes.filter(r => r.category === activeCategory);

  const popularRecipes = recipes.filter(r => r.calories > 200);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 bg-secondary min-h-screen">
      <Navbar onSearch={handleSearch}/>

      <div className="mb-4">
        <h1 className="text-4xl font-bold">Pic 2 Plate</h1>
        <p className="text-gray-400">Healthy and nutritious food recipes</p>
      </div>

    

      <CategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {searchTerm && searchResults.length > 0 && (
        <RecipeGrid
          recipes={searchResults}
          category="Search Results"
          title={`Search Results for "${searchTerm}"`}
        />
      )}

      {searchTerm && searchResults.length === 0 && (
        <div className="mb-4">
          <p>No recipes found for "{searchTerm}".</p>
        </div>
      )}

      {!searchTerm && featuredRecipes.length > 0 && (
        <RecipeGrid
          recipes={featuredRecipes}
          category={activeCategory}
          title={`${activeCategory} Recipes`}
        />
      )}

      {!searchTerm && <PopularRecipes recipes={popularRecipes}/>}

      <CameraButton/>
    </div>
  );
};

export default Index;