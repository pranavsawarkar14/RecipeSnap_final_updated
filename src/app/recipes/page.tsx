'use client';

import { useState } from 'react';
import { Menu, Home, Book, Heart, Upload, FileText, Youtube, User, Settings, Search, ChevronRight } from 'lucide-react';
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
  // ... (keep your existing mockRecipes array)
];

const categories = ['Vegetable', 'Rice', 'Fruit', 'Pasta', 'Seafood', 'Breakfast', 'Dessert', 'Beverages'];

const RecipesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Vegetable');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = mockRecipes.filter(
    (recipe) => 
      recipe.category === selectedCategory &&
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Modern Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    aria-label="Menu"
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px] pt-12">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-gray-800">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8">
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                          <Home className="h-5 w-5"/>
                          <span className="text-base font-medium">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/recipes"
                          className="flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-600 transition-colors"
                        >
                          <Book className="h-5 w-5"/>
                          <span className="text-base font-medium">All Recipes</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                          <Heart className="h-5 w-5"/>
                          <span className="text-base font-medium">Favorites</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/create-recipe"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                          <Upload className="h-5 w-5"/>
                          <span className="text-base font-medium">Upload Photo</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/recipe-from-text"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                          <FileText className="h-5 w-5"/>
                          <span className="text-base font-medium">Recipe from Text</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                            href="/youtube-recommendation"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                            <Youtube className="h-5 w-5"/>
                            <span className="text-base font-medium">YouTube</span>
                        </Link>
                      </li>
                      <div className="border-t border-gray-200 my-3"></div>
                      <li>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                          <User className="h-5 w-5"/>
                          <span className="text-base font-medium">Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                        >
                          <Settings className="h-5 w-5"/>
                          <span className="text-base font-medium">Settings</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
              
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">RecipeFinder</h1>
            </div>
            
            {/* Modern Search Bar */}
            <div className="relative w-full max-w-md mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search recipes..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Discover Delicious Recipes</h1>
          <p className="text-green-100 mb-4">Healthy and nutritious food recipes for every taste</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all">
            Explore Now
          </button>
        </section>

        {/* Category Chips */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">{selectedCategory} Recipes</h2>
            <Link href="#" className="text-green-600 text-sm font-medium flex items-center">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recipes found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-gray-800">{recipe.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                        {recipe.calories} Kcal
                      </span>
                      {recipe.prepTime && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {recipe.prepTime}
                        </span>
                      )}
                      {recipe.difficulty && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                          recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Popular Food */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Choices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularRecipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex"
              >
                <div className="w-1/3 relative">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="font-semibold text-gray-800">{recipe.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{recipe.description}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                      {recipe.calories} Kcal
                    </span>
                    {recipe.prepTime && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {recipe.prepTime}
                      </span>
                    )}
                  </div>
                  <button className="mt-3 text-xs font-medium text-green-600 hover:text-green-700 flex items-center">
                    View Recipe <ChevronRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Trending This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRecipes.slice(6, 8).map((recipe) => (
              <div 
                key={recipe.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="font-semibold text-white">{recipe.title}</h3>
                  <p className="text-sm text-white/80 mb-2">{recipe.description}</p>
                  <div className="flex items-center">
                    <span className="text-xs text-white bg-black/30 px-2 py-1 rounded-full mr-2">
                      {recipe.calories} Kcal
                    </span>
                    {recipe.prepTime && (
                      <span className="text-xs text-white bg-black/30 px-2 py-1 rounded-full">
                        {recipe.prepTime}
                      </span>
                    )}
                  </div>
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800">RecipeFinder</h2>
              <p className="text-gray-500 text-sm">Delicious recipes for every occasion</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">About</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Contact</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Privacy</Link>
              <Link href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Terms</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} RecipeFinder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecipesPage;