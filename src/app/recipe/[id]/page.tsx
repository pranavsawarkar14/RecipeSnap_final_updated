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
  '5': {
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
  },
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
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const decodedId = decodeURIComponent(id);
      
      // First check mock recipes
      const foundMock = mockRecipes.find(r => r.id === decodedId);
      if (foundMock) {
        setRecipe(foundMock);
        setRecipeDetails(mockRecipeDetails[decodedId]);
        return;
      }

      // Then check generated recipes from localStorage
      const generatedRecipes = localStorage.getItem('generatedRecipes');
      if (generatedRecipes) {
        try {
          const parsedRecipes = JSON.parse(generatedRecipes);
          const foundGenerated = parsedRecipes.find((r: Recipe) => r.id === decodedId);
          if (foundGenerated) {
            setRecipe(foundGenerated);
            // For generated recipes, use the recipe itself as the details
            setRecipeDetails({
              ...foundGenerated,
              prepTime: foundGenerated.prepTime || '30 minutes',
              servings: foundGenerated.servings || 4,
              ingredients: foundGenerated.ingredients || [],
              instructions: foundGenerated.instructions || [],
              nutrition: foundGenerated.nutrition || {
                calories: foundGenerated.calories || 0,
                carbs: 0,
                protein: 0
              }
            });
          }
        } catch (error) {
          console.error('Error parsing generated recipes:', error);
          toast({
            title: "Error",
            description: "Failed to load recipe details",
            variant: "destructive",
          });
        }
      }

      // Check recipes from recipe-from-text page
      const savedRecipes = localStorage.getItem('savedRecipes');
      if (savedRecipes) {
        try {
          const parsedRecipes = JSON.parse(savedRecipes);
          const foundRecipe = parsedRecipes.find((r: any) => r.id === decodedId);
          if (foundRecipe) {
            setRecipe({
              id: foundRecipe.id,
              title: foundRecipe.title,
              description: foundRecipe.description || foundRecipe.story || '',
              calories: foundRecipe.nutrition?.calories || 0,
              imageUrl: foundRecipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
              category: foundRecipe.cuisine || 'Other'
            });
            setRecipeDetails(foundRecipe);
          }
        } catch (error) {
          console.error('Error parsing saved recipes:', error);
        }
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

  if (!recipe || !recipeDetails) {
    return (
      <div className="max-w-md mx-auto px-4 pb-20 bg-secondary min-h-screen">
        <div className="sticky top-0 bg-secondary z-10 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="ghost" onClick={toggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center justify-center h-64">
          <p>Loading recipe details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-20 bg-secondary min-h-screen">
      <div className="sticky top-0 bg-secondary z-10 py-4 flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="ghost" onClick={toggleFavorite}>
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

        <div className="space-y-6">
          <div className="relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <h1 className="text-2xl font-bold text-white">{recipe.title}</h1>
              <p className="text-white/80">{recipe.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">Prep Time</p>
              <p className="font-medium">{recipeDetails.prepTime || 'N/A'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">Servings</p>
              <p className="font-medium">{recipeDetails.servings || 'N/A'}</p>
            </div>
          </div>

          {recipeDetails.instructions && (
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Instructions</h2>
              <ol className="space-y-2">
                {Array.isArray(recipeDetails.instructions) ? (
                  recipeDetails.instructions.map((step: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-bold">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))
                ) : (
                  <li>{recipeDetails.instructions}</li>
                )}
              </ol>
            </div>
          )}

          {recipeDetails.ingredients && (
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {Array.isArray(recipeDetails.ingredients) ? (
                  recipeDetails.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))
                ) : (
                  <li>{recipeDetails.ingredients}</li>
                )}
              </ul>
            </div>
          )}

          {recipeDetails.tipsAndTricks && (
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Tips & Tricks</h2>
              <ul className="space-y-2">
                {Array.isArray(recipeDetails.tipsAndTricks) ? (
                  recipeDetails.tipsAndTricks.map((tip: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))
                ) : (
                  <li>{recipeDetails.tipsAndTricks}</li>
                )}
              </ul>
            </div>
          )}
        </div>
    </div>
  );
};

export default RecipeDetail;