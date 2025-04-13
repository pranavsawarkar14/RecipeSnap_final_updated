'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Upload, Play } from 'lucide-react';
import { Recipe } from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  }
];

// Mock recipe details data
const mockRecipeDetails: Record<string, {
  prepTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition?: {
    calories: number;
    carbs: number;
    protein: number;
  }
}> = {
  '1': {
    prepTime: '30 minutes',
    servings: 2,
    ingredients: [
      '2 boneless chicken breasts',
      '2 cups cooked rice',
      '2 eggs',
      '1 cup mixed vegetables',
      '3 tbsp soy sauce',
      'Salt and pepper to taste',
    ],
    instructions: [
      'Dice chicken and season with salt and pepper.',
      'Cook chicken in a pan until golden brown.',
      'Add mixed vegetables and stir-fry for 3 minutes.',
      'Push contents to one side, scramble eggs on the other side.',
      'Add rice and soy sauce, mix everything together.',
      'Cook for another 3-5 minutes until heated through.',
    ],
  },
  '2': {
    prepTime: '45 minutes',
    servings: 4,
    ingredients: [
      '1 lb ground beef',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1 can crushed tomatoes',
      '1 tbsp tomato paste',
      '1 lb pasta',
      'Parmesan cheese for serving',
    ],
    instructions: [
      'Brown the ground beef in a large pot.',
      'Add onion and garlic, cook until softened.',
      'Add crushed tomatoes and tomato paste.',
      'Simmer for 30 minutes, stirring occasionally.',
      'Cook pasta according to package instructions.',
      'Serve sauce over pasta with grated parmesan.',
    ],
  },
  '3': {
    prepTime: '50 minutes',
    servings: 4,
    ingredients: [
      '2 lbs baby potatoes',
      '4 cloves garlic, minced',
      '3 tbsp olive oil',
      '1 tsp dried rosemary',
      'Salt and pepper to taste',
    ],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Cut potatoes into halves or quarters depending on size.',
      'Mix potatoes with garlic, olive oil, and seasonings.',
      'Spread on a baking sheet in a single layer.',
      'Roast for 30-40 minutes, turning halfway through.',
      'Potatoes should be golden and crispy when done.',
    ],
  },
  '4': {
    prepTime: '15 minutes',
    servings: 4,
    ingredients: [
      '1 cup strawberries, sliced',
      '1 cup pineapple chunks',
      '2 bananas, sliced',
      '1 cup grapes',
      '2 tbsp honey',
      'Mint leaves for garnish',
    ],
    instructions: [
      'Wash all fruit thoroughly.',
      'Cut fruit into bite-sized pieces.',
      'Combine all fruit in a large bowl.',
      'Drizzle with honey and toss gently to coat.',
      'Chill in refrigerator for at least 30 minutes before serving.',
      'Garnish with mint leaves just before serving.',
    ],
  },
};

// Adding the new Asparagus recipe from the image
mockRecipes.push({
  id: '5',
  title: 'Asparagus',
  description: 'White Onion, Fennel, and watercress Salad',
  calories: 190,
  imageUrl: '/lovable-uploads/c99bb49b-d3cf-4015-a35e-d3b1303413e8.png',
  category: 'Vegetable',
});

mockRecipeDetails['5'] = {
  prepTime: '30 minutes',
  servings: 2,
  nutrition: {
    calories: 190,
    carbs: 35,
    protein: 12,
  },
  ingredients: [
    '2 cups pecans, divided',
    '1 tablespoon unsalted butter, melted',
    '1/4 teaspoon kosher salt, plus more',
    '3 tablespoons fresh lemon juice',
    '2 tablespoons olive oil',
    '1/2 teaspoon honey'
  ],
  instructions: [
    'In a medium bowl, combine the marinade ingredients and mix well. Chop the chicken into bite-sized pieces and toss with the marinade. Cover and chill in the fridge for 1 hr or overnight.',
    'Preheat oven to 425°F (220°C).',
    'Arrange asparagus on a baking sheet, drizzle with olive oil, and season with salt and pepper.',
    'Roast for 12-15 minutes until tender but still crisp.',
    'Plate with salmon and garnish with fresh herbs.'
  ],
};

interface RecipeDetailProps {
  params: {
    id: string;
  }
}

const RecipeDetail = ({ params }: RecipeDetailProps) => {
  const { id } = params;
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeDetails, setRecipeDetails] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      // In a real app, fetch from API
      const found = mockRecipes.find(r => r.id === id);
      if (found) {
        setRecipe(found);
        setRecipeDetails(mockRecipeDetails[id]);
      }
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      duration: 2000,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadFoodImage(file);
      
      toast({
        title: "Image uploaded successfully!",
        description: "Generating recipe from your food photo...",
        duration: 3000,
      });
      
      // Generate recipe from image
      const recipe = await generateRecipeFromImage(imageUrl);
      
      // Navigate to the new recipe page
      router.push('/recipe/1'); // In a real app, navigate to the new recipe ID
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      setShowFileInput(false);
    }
  };

  if (!recipe || !recipeDetails) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <p>Loading recipe details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-20 bg-white min-h-screen">
      <div className="py-4 flex items-center justify-between">
        <Link href="/" className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <button 
          onClick={toggleFavorite}
          className="p-2"
        >
          <Heart 
            className={`h-6 w-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-1">{recipe.title}</h1>
        <p className="text-gray-400 mb-6">{recipe.description}</p>
        
        {/* Nutrition Section */}
        <h2 className="text-2xl font-bold mb-4">Nutritions</h2>
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
            <div className="text-2xl font-bold">{recipeDetails.nutrition?.calories || recipe.calories}</div>
            <div className="text-gray-400">Calories</div>
            <div className="text-gray-300 text-sm">Kcal</div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
            <div className="text-2xl font-bold">{recipeDetails.nutrition?.carbs || 25}</div>
            <div className="text-gray-400">Carbo</div>
            <div className="text-gray-300 text-sm">g</div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
            <div className="text-2xl font-bold">{recipeDetails.nutrition?.protein || 15}</div>
            <div className="text-gray-400">Protein</div>
            <div className="text-gray-300 text-sm">g</div>
          </div>
        </div>
        
        <div className="relative mb-8">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-64 object-cover rounded-3xl"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <input 
              type="file"
              accept="image/*"
              className="hidden"
              id="photo-upload"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100"
              onClick={() => setShowFileInput(!showFileInput)}
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Similar
            </Button>
            {showFileInput && (
              <div className="absolute right-0 top-10 bg-white p-4 rounded-lg shadow-lg z-10">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Button className="w-full">
                    {uploading ? "Uploading..." : "Choose Photo"}
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <ul className="space-y-2">
          {recipeDetails.ingredients.map((ingredient: string, index: number) => (
            <li key={index} className="text-gray-400">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Recipe Preparation */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recipe preparation</h2>
        <ol className="space-y-6">
          {recipeDetails.instructions.map((instruction: string, index: number) => (
            <li key={index} className="relative">
              <div className="text-gray-300 mb-1">STEP {index + 1}</div>
              <p className="text-gray-400">{instruction}</p>
              {index === 0 && (
                <Button className="mt-4 bg-green-500 hover:bg-green-600">
                  <Play className="h-5 w-5 mr-2" /> Watch Video
                </Button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetail;