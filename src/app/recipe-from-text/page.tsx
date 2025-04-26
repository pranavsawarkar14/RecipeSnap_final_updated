'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, ChefHat, Clock, Utensils, Flame, Info, Book, Plus, Minus, Share2, Printer, Download, Heart, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "@/components/ui/LanguageFilter";
import { useToast } from "@/components/ui/use-toast";
import { generateRecipeFromText } from "@/ai/flows/generate-recipe-from-text";
import Navbar from "@/components/Navbar";
import { v4 as uuidv4 } from 'uuid';
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type DetailedRecipe = {
  id: string;
  title: string;
  description: string;
  story: string;
  ingredients: string[];
  ingredientNotes: Record<string, string>;
  instructions: string[];
  tips: string[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
  };
  dietaryInfo: string[];
  tags: string[];
  variations: string[];
  storage: string;
  equipment: string[];
  rating?: number;
  favorite?: boolean;
};

const languageMapping: Record<string, string> = {
  "en": "en",
  "es": "es",
  "fr": "fr",
  "de": "de",
  "ja": "ja",
  "hi": "hi",
  "mr": "mr"
};

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "any", label: "Any Difficulty" }
];

const cuisineOptions = [
  "Italian", "Mexican", "Chinese", "Indian", "Japanese", 
  "French", "Thai", "Mediterranean", "American", "Fusion"
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", 
  "Keto", "Paleo", "Low-Carb", "Nut-Free"
];

const RecipeFromTextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const recipeRef = useRef<HTMLDivElement>(null);
  
  const [recipeDescription, setRecipeDescription] = useState('');
  const [language, setLanguage] = useState<Languages>("en");
  const [recipes, setRecipes] = useState<DetailedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailLevel, setDetailLevel] = useState<number>(90);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("any");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [servings, setServings] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [savedRecipes, setSavedRecipes] = useState<DetailedRecipe[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (savedRecipes.length > 0) {
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
  }, [savedRecipes]);

  const parseArrayData = (data: any, fallback: string[] = []): string[] => {
    if (!data) return fallback;
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      if (data.includes('\n')) return data.split('\n').filter(Boolean);
      if (data.includes(',')) return data.split(',').map(item => item.trim()).filter(Boolean);
      return [data];
    }
    return fallback;
  };

  const parseIngredientNotes = (notes: any): Record<string, string> => {
    if (!notes) return {};
    if (typeof notes === 'object' && !Array.isArray(notes)) return notes;
    return {};
  };

  const toggleFavorite = (recipeId: string) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === recipeId ? { ...recipe, favorite: !recipe.favorite } : recipe
    ));
    
    setSavedRecipes(prev => {
      const updated = prev.map(recipe => 
        recipe.id === recipeId ? { ...recipe, favorite: !recipe.favorite } : recipe
      );
      return updated;
    });
  };

  const saveRecipe = (recipe: DetailedRecipe) => {
    if (!savedRecipes.some(r => r.id === recipe.id)) {
      setSavedRecipes([...savedRecipes, recipe]);
      toast({
        title: "Recipe saved!",
        description: "You can find this recipe in your saved collection",
      });
    }
  };

  const shareRecipe = async (recipe: DetailedRecipe) => {
    try {
      const shareData = {
        title: recipe.title,
        text: `${recipe.description}\n\nIngredients:\n${recipe.ingredients.slice(0, 5).join('\n')}...`,
        url: window.location.href,
      };

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        try {
          await copyToClipboard(
            `${recipe.title}\n\n${recipe.description}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.join('\n')}`
          );
          toast({
            title: "Copied to clipboard!",
            description: "Recipe details have been copied",
          });
        } catch (err) {
          // Final fallback - show alert with the text
          alert(
            `Share this recipe:\n\n${recipe.title}\n\n${recipe.description}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.join('\n')}`
          );
        }
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast({
        title: "Sharing failed",
        description: "Please try copying the recipe manually",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
      
      // Legacy method for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (!successful) throw new Error('Copy failed');
      } finally {
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      throw err;
    }
  };

  const copyIngredients = async () => {
    if (recipes.length === 0) return;

    try {
      const ingredients = recipes[0].ingredients.join('\n');
      await copyToClipboard(ingredients);
      toast({
        title: "Ingredients copied!",
        description: "All ingredients have been copied to your clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy failed",
        description: "Please manually select and copy the ingredients",
        variant: "destructive"
      });
      
      // Show ingredients in alert as fallback
      alert(`Ingredients:\n\n${recipes[0].ingredients.join('\n')}`);
    }
  };

  const printRecipe = () => {
    window.print();
  };

  const downloadRecipeAsText = () => {
    if (recipes.length > 0) {
      const recipe = recipes[0];
      const content = `
        ${recipe.title}
        ${recipe.description}

        Ingredients:
        ${recipe.ingredients.join('\n')}

        Instructions:
        ${recipe.instructions.join('\n')}

        Nutrition:
        Calories: ${recipe.nutrition.calories}
        Protein: ${recipe.nutrition.protein}
        Carbs: ${recipe.nutrition.carbs}
        Fat: ${recipe.nutrition.fat}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!recipeDescription.trim()) {
      toast({
        title: "Description needed",
        description: "Please describe what you'd like to cook",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationProgress(0);
    
    try {
      const languageCode = languageMapping[language] || "en";
      
      let enhancedDescription = `Create an extremely detailed recipe (detail level: ${detailLevel}%) for: ${recipeDescription}\n`;
      
      if (selectedDifficulty !== "any") {
        enhancedDescription += `Difficulty: ${selectedDifficulty}\n`;
      }
      
      if (selectedCuisines.length > 0) {
        enhancedDescription += `Cuisine: ${selectedCuisines.join(', ')}\n`;
      }
      
      if (selectedDietary.length > 0) {
        enhancedDescription += `Dietary requirements: ${selectedDietary.join(', ')}\n`;
      }
      
      enhancedDescription += `Servings: ${servings}\n`;
      enhancedDescription += "Include: detailed preparation steps, exact measurements, cooking techniques, cultural context, chef's tips, nutrition info, storage instructions, and possible variations.";

      setGenerationProgress(20);
      
      const result = await generateRecipeFromText({
        recipeDescription: enhancedDescription,
        language: languageCode,
        detailLevel: "very_high"
      });

      setGenerationProgress(60);
      
      if (result.recipes?.length > 0) {
        const formattedRecipes = result.recipes.map((recipe) => {
          const formattedRecipe: DetailedRecipe = {
            id: uuidv4(),
            title: recipe.name || recipe.title || "Detailed Recipe",
            description: recipe.description || "A delicious detailed recipe crafted with AI precision",
            story: recipe.story || recipe.background || recipe.history || "This recipe combines traditional techniques with modern flavors for a delightful culinary experience.",
            ingredients: parseArrayData(recipe.ingredients, ["Ingredients not provided"]),
            ingredientNotes: parseIngredientNotes(recipe.ingredientNotes || recipe.notes),
            instructions: parseArrayData(recipe.instructions, ["Instructions not provided"]),
            tips: parseArrayData(recipe.tips || recipe.cookingTips, ["Cook with love and attention to detail"]),
            prepTime: recipe.prepTime || `${Math.floor(Math.random() * 30) + 15} mins`,
            cookTime: recipe.cookTime || `${Math.floor(Math.random() * 45) + 20} mins`,
            totalTime: recipe.totalTime || `${Math.floor(Math.random() * 60) + 40} mins`,
            servings: recipe.servings || servings,
            difficulty: recipe.difficulty || (['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard'),
            cuisine: recipe.cuisine || recipe.cuisineType || selectedCuisines[0] || "Fusion",
            nutrition: {
              calories: recipe.nutrition?.calories || Math.floor(Math.random() * 800) + 200,
              protein: recipe.nutrition?.protein || `${Math.floor(Math.random() * 30) + 5}g`,
              carbs: recipe.nutrition?.carbs || `${Math.floor(Math.random() * 50) + 20}g`,
              fat: recipe.nutrition?.fat || `${Math.floor(Math.random() * 30) + 5}g`,
              fiber: recipe.nutrition?.fiber || `${Math.floor(Math.random() * 10) + 2}g`,
              sugar: recipe.nutrition?.sugar || `${Math.floor(Math.random() * 15) + 2}g`,
              sodium: recipe.nutrition?.sodium || `${Math.floor(Math.random() * 500) + 100}mg`
            },
            dietaryInfo: parseArrayData(recipe.dietaryInfo || recipe.dietary, selectedDietary.length > 0 ? selectedDietary : ["No specific dietary information"]),
            tags: parseArrayData(recipe.tags, ['AI-Generated', 'Detailed Recipe']),
            variations: parseArrayData(recipe.variations || recipe.alternativeVersions, ["This recipe can be customized based on personal preference and ingredient availability."]),
            storage: recipe.storage || recipe.storageInstructions || "Store leftovers in an airtight container in the refrigerator for up to 3 days.",
            equipment: parseArrayData(recipe.equipment || recipe.kitchenTools, ["Basic kitchen equipment"]),
            rating: 0,
            favorite: false
          };
          
          return formattedRecipe;
        });

        setGenerationProgress(95);
        setRecipes(formattedRecipes);
        
        toast({
          title: "Detailed recipe created!",
          description: "Scroll down to see your comprehensive recipe",
        });
      } else {
        toast({
          title: "No recipes generated",
          description: "Try adding more details to your description",
        });
        setError("No recipes were returned from the API. Try adding more specific details to your description.");
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Our kitchen is busy. Please try again!",
      });
      setError("An error occurred while generating your recipe. Please try again.");
    } finally {
      setGenerationProgress(100);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12 text-center">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="absolute left-4 top-24 rounded-full p-2 hover:bg-indigo-50 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-indigo-600" />
          </Button>
          
          <div className="flex flex-col items-center justify-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <ChefHat className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Advanced Recipe Generator
            </h1>
            <p className="text-gray-500 max-w-lg">
              Describe your dream dish and get a professional recipe with comprehensive instructions and nutritional info
            </p>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Recipe Description</TabsTrigger>
              <TabsTrigger value="options">Advanced Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your recipe in detail (be specific for best results):
                  </label>
                  <Textarea
                    placeholder="Example: I want a detailed recipe for authentic Italian lasagna with béchamel sauce, using fresh pasta sheets, ground beef and pork mixture, and proper layering techniques. Include preparation steps for each component and information about its regional origins..."
                    value={recipeDescription}
                    onChange={(e) => setRecipeDescription(e.target.value)}
                    className="min-h-[180px] text-gray-700 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Tip: Include specific ingredients, cooking methods, dietary restrictions, and cultural preferences
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="options">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Detail Level</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[detailLevel]}
                        onValueChange={(value) => setDetailLevel(value[0])}
                        min={10}
                        max={100}
                        step={5}
                      />
                      <span className="text-sm font-medium w-12">{detailLevel}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Servings</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setServings(Math.max(1, servings - 1))}
                        disabled={servings <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={servings} 
                        onChange={(e) => setServings(Math.max(1, Number(e.target.value)))}
                        className="w-16 text-center"
                        min={1}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setServings(servings + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Difficulty</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {difficultyOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedDifficulty === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Cuisine Type</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cuisineOptions.map((cuisine) => (
                      <Button
                        key={cuisine}
                        variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedCuisines.includes(cuisine)) {
                            setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
                          } else {
                            setSelectedCuisines([...selectedCuisines, cuisine]);
                          }
                        }}
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Dietary Requirements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dietaryOptions.map((diet) => (
                      <Button
                        key={diet}
                        variant={selectedDietary.includes(diet) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedDietary.includes(diet)) {
                            setSelectedDietary(selectedDietary.filter(d => d !== diet));
                          } else {
                            setSelectedDietary([...selectedDietary, diet]);
                          }
                        }}
                      >
                        {diet}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Recipe Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleGenerateRecipe} 
                disabled={isLoading}
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Crafting your recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Advanced Recipe
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isLoading && (
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Generating recipe...</span>
                <span className="text-sm font-medium text-gray-700">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {recipes.length > 0 && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Professional Recipe
              </h2>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => saveRecipe(recipes[0])}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save recipe</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => shareRecipe(recipes[0])}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share recipe</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={printRecipe}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Print recipe</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadRecipeAsText}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download as text</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={copyIngredients}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy ingredients</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-12" ref={recipeRef}>
              {recipes.map((recipe) => (
                <article 
                  key={recipe.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant={recipe.difficulty === 'Easy' ? 'easy' : recipe.difficulty === 'Medium' ? 'medium' : 'hard'}>
                              {recipe.difficulty}
                            </Badge>
                            <Badge variant="cuisine">
                              {recipe.cuisine}
                            </Badge>
                            {recipe.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={`${recipe.id}-tag-${idx}`} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleFavorite(recipe.id)}
                            className={recipe.favorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"}
                          >
                            <Heart 
                              className={`h-5 w-5 ${recipe.favorite ? 'fill-current' : ''}`} 
                            />
                          </Button>
                        </div>
                        
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                        <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            <div>
                              <p className="text-xs text-gray-500">Prep Time</p>
                              <p className="font-medium">{recipe.prepTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <Flame className="h-5 w-5 text-indigo-600" />
                            <div>
                              <p className="text-xs text-gray-500">Cook Time</p>
                              <p className="font-medium">{recipe.cookTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <Utensils className="h-5 w-5 text-indigo-600" />
                            <div>
                              <p className="text-xs text-gray-500">Servings</p>
                              <p className="font-medium">{recipe.servings}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            <div>
                              <p className="text-xs text-gray-500">Total Time</p>
                              <p className="font-medium">{recipe.totalTime}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-8">
                          <div className="flex items-center gap-2 mb-3">
                            <Book className="h-5 w-5 text-indigo-600" />
                            <h4 className="font-bold text-gray-900 text-lg">About This Recipe</h4>
                          </div>
                          <p className="text-gray-700">{recipe.story}</p>
                        </div>
                        
                        {recipe.dietaryInfo && recipe.dietaryInfo.length > 0 && recipe.dietaryInfo[0] !== "No specific dietary information" && (
                          <div className="mb-8">
                            <h4 className="font-bold text-gray-900 text-lg mb-3">Dietary Information</h4>
                            <div className="flex flex-wrap gap-2">
                              {recipe.dietaryInfo.map((info, idx) => (
                                <Badge key={`${recipe.id}-diet-${idx}`} variant="dietary">
                                  {info}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg md:w-72">
                        <h4 className="font-bold text-gray-900 text-lg mb-4">Nutrition Facts</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Calories</span>
                            <span className="font-medium">{recipe.nutrition.calories}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Protein</span>
                            <span className="font-medium">{recipe.nutrition.protein}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carbohydrates</span>
                            <span className="font-medium">{recipe.nutrition.carbs}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fat</span>
                            <span className="font-medium">{recipe.nutrition.fat}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fiber</span>
                            <span className="font-medium">{recipe.nutrition.fiber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sugar</span>
                            <span className="font-medium">{recipe.nutrition.sugar}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sodium</span>
                            <span className="font-medium">{recipe.nutrition.sodium}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 mb-10">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                        Equipment Needed
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipe.equipment.map((item, index) => (
                          <li key={`${recipe.id}-equip-${index}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                            <span className="h-3 w-3 bg-indigo-600 rounded-full flex-shrink-0"></span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                      <div>
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                          <h4 className="text-xl font-bold text-gray-900">
                            Ingredients
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={copyIngredients}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Clipboard className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                        <ul className="space-y-4">
                          {recipe.ingredients.map((ingredient, index) => {
                            const hasNote = Object.keys(recipe.ingredientNotes).some(key => 
                              ingredient.includes(key)
                            );
                            const noteKey = Object.keys(recipe.ingredientNotes).find(key => 
                              ingredient.includes(key)
                            );
                            
                            return (
                              <li key={`${recipe.id}-ing-${index}`} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-start">
                                  <span className="inline-block w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-700">{ingredient}</span>
                                </div>
                                {hasNote && noteKey && (
                                  <div className="ml-9 mt-2 text-sm text-gray-500 italic bg-indigo-50 p-2 rounded">
                                    {recipe.ingredientNotes[noteKey]}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                          Instructions
                        </h4>
                        <ol className="space-y-6">
                          {recipe.instructions.map((step, index) => (
                            <li key={`${recipe.id}-step-${index}`} className="flex gap-4">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-medium flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 pt-1">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="mt-12 bg-yellow-50 p-8 rounded-lg border border-yellow-100">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Info className="h-5 w-5 text-yellow-600" />
                        Chef's Tips
                      </h4>
                      <ul className="space-y-5">
                        {recipe.tips.map((tip, index) => (
                          <li key={`${recipe.id}-tip-${index}`} className="flex items-start gap-4">
                            <span className="inline-block w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center justify-center mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 pt-1">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-12">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                        Variations
                      </h4>
                      <ul className="space-y-5">
                        {recipe.variations.map((variation, index) => (
                          <li key={`${recipe.id}-var-${index}`} className="flex items-start gap-4">
                            <span className="inline-block w-6 h-6 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center justify-center mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 pt-1">{variation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-100">
                      <h4 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                        <Info className="h-5 w-5 text-blue-600" />
                        Storage Instructions
                      </h4>
                      <p className="text-gray-700">{recipe.storage}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default RecipeFromTextPage;