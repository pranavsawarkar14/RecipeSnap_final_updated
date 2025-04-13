'use client';

import { useState } from 'react';
import { Menu, Home, Book, Heart, Upload, FileText, Youtube, User, Settings } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type Recipe = {
  id: string;
  title: string;
  description: string;
  calories: number;
  imageUrl: string;
  category: string;
  prepTime?: string;
  difficulty?: string;
};

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Chicken Fried Rice',
    description: 'So irresistibly delicious',
    calories: 250,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    category: 'Rice',
    prepTime: '25 min',
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Pasta Bolognese',
    description: 'True Italian classic',
    calories: 200,
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
    category: 'Pasta',
    prepTime: '35 min',
    difficulty: 'Medium',
  },
  {
    id: '3',
    title: 'Garlic Potatoes',
    description: 'Crispy Garlic Roasted Potatoes',
    calories: 150,
    imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf',
    category: 'Vegetable',
    prepTime: '40 min',
    difficulty: 'Easy',
  },
  {
    id: '4',
    title: 'Fruit Salad',
    description: 'Sweet and refreshing mix',
    calories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7',
    category: 'Fruit',
    prepTime: '15 min',
    difficulty: 'Easy',
  },
  {
    id: '5',
    title: 'Avocado Toast',
    description: 'Perfect breakfast option',
    calories: 180,
    imageUrl: 'https://www.simplotfoods.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F0dkgxhks0leg%2FkDuiYdR8XTw15l7lWLDl4%2Fa226c36c3af6960bccf788363eec61f9%2FDecemberDEC_15.jpg%3Ffm%3Dwebp&w=3840&q=75',
    category: 'Breakfast',
    prepTime: '10 min',
    difficulty: 'Easy',
  },
  {
    id: '6',
    title: 'Grilled Salmon',
    description: 'Fresh and healthy seafood',
    calories: 220,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    category: 'Seafood',
    prepTime: '25 min',
    difficulty: 'Medium',
  },
  {
    id: '7',
    title: 'Chocolate Cake',
    description: 'Rich and decadent dessert',
    calories: 350,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    category: 'Dessert',
    prepTime: '50 min',
    difficulty: 'Medium',
  },
  {
    id: '8',
    title: 'Iced Coffee',
    description: 'Refreshing cold brew',
    calories: 90,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    category: 'Beverages',
    prepTime: '5 min',
    difficulty: 'Easy',
  },
  // New recipes added below
  {
    id: '9',
    title: 'Mediterranean Salad',
    description: 'Fresh veggies with feta and olives',
    calories: 180,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Vegetable',
    prepTime: '15 min',
    difficulty: 'Easy',
  },
  {
    id: '10',
    title: 'Mushroom Risotto',
    description: 'Creamy Italian rice dish',
    calories: 320,
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
    category: 'Rice',
    prepTime: '45 min',
    difficulty: 'Hard',
  },
  {
    id: '11',
    title: 'Berry Smoothie Bowl',
    description: 'Packed with antioxidants',
    calories: 210,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    category: 'Fruit',
    prepTime: '10 min',
    difficulty: 'Easy',
  },
  {
    id: '12',
    title: 'Lemon Garlic Shrimp',
    description: 'Zesty and flavorful seafood delight',
    calories: 240,
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975',
    category: 'Seafood',
    prepTime: '20 min',
    difficulty: 'Medium',
  },
  {
    id: '13',
    title: 'Spicy Thai Noodles',
    description: 'Bold flavors with a kick',
    calories: 380,
    imageUrl: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb',
    category: 'Pasta',
    prepTime: '30 min',
    difficulty: 'Medium',
  },
  {
    id: '14',
    title: 'Protein Pancakes',
    description: 'Healthy start to your day',
    calories: 280,
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93',
    category: 'Breakfast',
    prepTime: '20 min',
    difficulty: 'Easy',
  },
  {
    id: '15',
    title: 'Roasted Vegetables',
    description: 'Colorful mix of seasonal veggies',
    calories: 160,
    imageUrl: 'https://images.unsplash.com/photo-1518133683791-0b9de5a055f0',
    category: 'Vegetable',
    prepTime: '35 min',
    difficulty: 'Easy',
  },
  {
    id: '16',
    title: 'Mango Sticky Rice',
    description: 'Traditional Thai dessert',
    calories: 290,
    imageUrl: 'https://images.unsplash.com/photo-1563379091-3208a7995d68',
    category: 'Rice',
    prepTime: '40 min',
    difficulty: 'Medium',
  },
  {
    id: '17',
    title: 'Homemade Granola',
    description: 'Crunchy and nutritious',
    calories: 210,
    imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1',
    category: 'Breakfast',
    prepTime: '25 min',
    difficulty: 'Easy',
  },
  {
    id: '18',
    title: 'Tiramisu',
    description: 'Classic Italian coffee dessert',
    calories: 320,
    imageUrl: 'https://images.unsplash.com/photo-1551404973-761c5756ce73',
    category: 'Dessert',
    prepTime: '30 min',
    difficulty: 'Medium',
  },
];

const categories = ['Vegetable', 'Rice', 'Fruit', 'Pasta', 'Seafood', 'Breakfast', 'Dessert', 'Beverages'];

const RecipesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Vegetable');

  const filteredRecipes = mockRecipes.filter(
    (recipe) => recipe.category === selectedCategory
  );

  // Get popular recipes (those with lowest calories in each category)
  const popularRecipes = categories
    .map(category => {
      const categoryRecipes = mockRecipes.filter(recipe => recipe.category === category);
      return categoryRecipes.length > 0 ? 
        categoryRecipes.reduce((prev, curr) => prev.calories < curr.calories ? prev : curr) : 
        null;
    })
    .filter(recipe => recipe !== null)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navbar */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    aria-label="Menu"
                    className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] sm:w-[350px] pt-12">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8">
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Home className="h-5 w-5"/>
                          <span className="text-lg">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/recipes"
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 transition-colors"
                        >
                          <Book className="h-5 w-5"/>
                          <span className="text-lg">All Recipes</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Heart className="h-5 w-5"/>
                          <span className="text-lg">Favorites</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/create-recipe"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                          <Upload className="h-6 w-6"/>
                          <span className="text-lg">Upload Photo</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/recipe-from-text"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                          <FileText className="h-6 w-6"/>
                          <span className="text-lg">Recipe from Text</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                            href="/youtube-recommendation"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Youtube className="h-6 w-6"/>
                            <span className="text-lg">YouTube Recommendation</span>
                        </Link>
                      </li>
                      <div className="border-t my-4"></div>
                      <li>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <User className="h-5 w-5"/>
                          <span className="text-lg">My Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Settings className="h-5 w-5"/>
                          <span className="text-lg">Settings</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
              
            </div>
            <div>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Discover Recipes</h1>
          <p className="text-gray-500">Healthy and nutritious food recipes for every taste</p>
        </header>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border whitespace-nowrap ${
                selectedCategory === cat ? 'bg-green-600 text-white' : 'text-gray-700 border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="rounded-lg w-full h-40 object-cover"
              />
              <div className="mt-3">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-500">{recipe.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className="text-gray-700">{recipe.calories} Kcal</span>
                    {recipe.prepTime && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
                        {recipe.prepTime}
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className={`text-xs px-2 py-1 rounded ml-2 ${
                        recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                        recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-red-500 text-lg">♡</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Popular Food</h2>
        <div className="space-y-4">
          {popularRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl flex items-center p-4 gap-4 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-500">{recipe.description}</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm font-medium text-gray-800">{recipe.calories} Kcal</p>
                  {recipe.prepTime && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
                      {recipe.prepTime}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className={`text-xs px-2 py-1 rounded ml-2 ${
                      recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                      recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-auto text-gray-400 hover:text-red-500 text-lg">♡</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Trending This Week</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockRecipes.slice(6, 8).map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl flex items-center p-4 gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-500">{recipe.description}</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm font-medium text-gray-800">{recipe.calories} Kcal</p>
                  {recipe.prepTime && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
                      {recipe.prepTime}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-auto text-gray-400 hover:text-red-500 text-lg">♡</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecipesPage;