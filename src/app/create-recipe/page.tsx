'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Camera, Loader2, ChefHat, Salad, Sparkles, Info, Plus, X, Wand2, Utensils, Flame, Clock, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { identifyIngredients } from '@/ai/flows/identify-ingredients';
import { generateRecipeSuggestions } from '@/ai/flows/generate-recipe-suggestions';
import { generateDetailedRecipe } from '@/ai/flows/generate-detailed-recipe';
import { Languages } from "@/components/ui/LanguageFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recipe } from "@/components/RecipeCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

const CreateRecipe = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [manualIngredients, setManualIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Languages>("en");
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');
  const [dietaryPreference, setDietaryPreference] = useState<string>('none');
  const [cookingTime, setCookingTime] = useState<string>('any');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [showMagicEffect, setShowMagicEffect] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [cuisineType, setCuisineType] = useState<string>('any');
  const [cookingMethod, setCookingMethod] = useState<string>('any');
  const [spiceLevel, setSpiceLevel] = useState<string>('any');
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "ja", label: "日本語" },
    { value: "hi", label: "हिन्दी" },
    { value: "mr", label: "मराठी" },
  ];

  const dietaryOptions = [
    { value: 'none', label: 'No restrictions' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-free' },
    { value: 'keto', label: 'Keto' },
    { value: 'low-carb', label: 'Low-carb' },
  ];

  const timeOptions = [
    { value: 'any', label: 'Any time' },
    { value: '15', label: 'Quick (15 mins)' },
    { value: '30', label: 'Medium (30 mins)' },
    { value: '60', label: 'Long (60+ mins)' },
  ];

  const cuisineOptions = [
    { value: 'any', label: 'Any Cuisine' },
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'american', label: 'American' },
    { value: 'thai', label: 'Thai' },
    { value: 'french', label: 'French' },
  ];

  const cookingMethodOptions = [
    { value: 'any', label: 'Any Method' },
    { value: 'baking', label: 'Baking' },
    { value: 'grilling', label: 'Grilling' },
    { value: 'frying', label: 'Frying' },
    { value: 'steaming', label: 'Steaming' },
    { value: 'slow-cooking', label: 'Slow Cooking' },
    { value: 'stir-fry', label: 'Stir Fry' },
    { value: 'roasting', label: 'Roasting' },
    { value: 'boiling', label: 'Boiling' },
  ];

  const spiceLevelOptions = [
    { value: 'any', label: 'Any Spice Level' },
    { value: 'mild', label: 'Mild' },
    { value: 'medium', label: 'Medium' },
    { value: 'hot', label: 'Hot' },
    { value: 'extra-hot', label: 'Extra Hot' },
  ];

  const translations = {
    en: {
      title: "Create Recipe",
      description: "Upload an image of your ingredients to generate delicious recipes",
      noImage: "No Image Uploaded",
      uploadPrompt: "Please upload an image of your ingredients",
      uploadBtn: "Upload Image",
      cameraBtn: "Take Photo",
      generateBtn: "Generate Recipes",
      identified: "Identified Ingredients",
      recipes: "Generated Recipes",
      back: "Back",
      loadingRecipes: "Generating Recipes...",
      analyzing: "Analyzing Ingredients...",
      tips: "Tips & Tricks",
      instructions: "Instructions",
      poweredBy: "Powered by AI",
      addIngredients: "Add ingredients manually",
      addIngredient: "Add Ingredient",
      dietary: "Dietary Preferences",
      cookingTime: "Cooking Time",
      or: "OR",
      allIngredients: "All Ingredients",
      manualIngredients: "Manual Ingredients",
      addManually: "Add manually",
      viewRecipe: "View Full Recipe",
      proTip: "Pro Tip",
      proTipContent: "For best results, take a clear photo of all your ingredients arranged neatly with good lighting.",
      noRecipes: "No Recipes Yet",
      noRecipesContent: "Upload an image of your ingredients and generate some delicious recipes!",
    },
    es: {
      title: "Crear Receta",
      description: "Sube una imagen de tus ingredientes para generar recetas deliciosas",
      noImage: "No hay imagen cargada",
      uploadPrompt: "Por favor sube una imagen de tus ingredientes",
      uploadBtn: "Subir Imagen",
      cameraBtn: "Tomar Foto",
      generateBtn: "Generar Recetas",
      identified: "Ingredientes Identificados",
      recipes: "Recetas Generadas",
      back: "Atrás",
      loadingRecipes: "Generando Recetas...",
      analyzing: "Analizando Ingredientes...",
      tips: "Consejos y Trucos",
      instructions: "Instrucciones",
      poweredBy: "Impulsado por IA",
      addIngredients: "Añadir ingredientes manualmente",
      addIngredient: "Añadir Ingrediente",
      dietary: "Preferencias Dietéticas",
      cookingTime: "Tiempo de Cocción",
      or: "O",
      allIngredients: "Todos los Ingredientes",
      manualIngredients: "Ingredientes Manuales",
      addManually: "Añadir manualmente",
      viewRecipe: "Ver Receta Completa",
      proTip: "Consejo Profesional",
      proTipContent: "Para obtener los mejores resultados, toma una foto clara de todos tus ingredientes ordenados con buena iluminación.",
      noRecipes: "Aún No Hay Recetas",
      noRecipesContent: "¡Sube una imagen de tus ingredientes y genera algunas recetas deliciosas!",
    },
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(timer);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [isLoading]);

  useEffect(() => {
    // Hide initial animation after 3 seconds
    const timer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addManualIngredient = () => {
    if (newIngredient.trim() && !manualIngredients.includes(newIngredient.trim())) {
      setManualIngredients([...manualIngredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeManualIngredient = (ingredientToRemove: string) => {
    setManualIngredients(manualIngredients.filter(ing => ing !== ingredientToRemove));
  };

  const generateRecipes = async () => {
    if (!imagePreview && manualIngredients.length === 0) {
      toast({
        variant: 'destructive',
        title: t.noImage,
        description: 'Please upload an image or add ingredients manually to generate recipes.',
      });
      return;
    }

    // Reset state before generating new recipes
    setRecipes([]);
    setHasGenerated(false);
    setIsLoading(true);
    setProgress(10);
    setIsGenerating(true);
    setCurrentRecipeIndex(0);
    setShowFullScreenLoader(true);
    
    try {
      let identifiedIngredients: string[] = [];
      
      if (imagePreview) {
        setProgress(30);
        const ingredientResult = await identifyIngredients({photoUrl: imagePreview});
        identifiedIngredients = ingredientResult.ingredients;
      }

      const allIngredients = [...new Set([...identifiedIngredients, ...manualIngredients])];
      setIngredients(allIngredients);

      if (allIngredients.length === 0) {
        throw new Error("No ingredients identified");
      }

      setProgress(50);
      const recipeResult = await generateRecipeSuggestions({
        ingredients: allIngredients, 
        language: language,
        dietaryRestrictions: dietaryPreference !== 'none' ? dietaryPreference : undefined,
        maxPrepTime: cookingTime !== 'any' ? parseInt(cookingTime) : undefined,
        cuisineType: cuisineType !== 'any' ? cuisineType : undefined,
        cookingMethod: cookingMethod !== 'any' ? cookingMethod : undefined,
        spiceLevel: spiceLevel !== 'any' ? spiceLevel : undefined,
      });

      setProgress(70);
      const recipesWithDetails = await Promise.all(recipeResult.recipes.map(async recipe => {
        const detailedRecipe = await generateDetailedRecipe({
          recipeName: recipe.name,
          ingredients: recipe.ingredients,
          language: language,
        });
        return {
          ...recipe,
          ...detailedRecipe,
          imageUrl: imagePreview || 'https://source.unsplash.com/random/600x400/?food,recipe,' + encodeURIComponent(recipe.name)
        };
      }));

      const formattedRecipes = recipesWithDetails.map(recipe => ({
        id: recipe.name,
        title: recipe.name,
        description: recipe.description || '',
        instructions: recipe.instructions,
        tipsAndTricks: recipe.tipsAndTricks || [],
        calories: recipe.calories || 200,
        prepTime: recipe.prepTime || '30 mins',
        difficulty: recipe.difficulty || 'Medium',
        imageUrl: recipe.imageUrl,
        category: 'Generated',
        canMake: recipe.canMake,
        href: `/recipe/${encodeURIComponent(recipe.name)}`,
      }));

      // Only set recipes if we haven't generated them yet
      if (!hasGenerated) {
        setRecipes(formattedRecipes);
        setHasGenerated(true);

        // Save generated recipes to localStorage
        const existingRecipes = localStorage.getItem('generatedRecipes');
        const allGeneratedRecipes = existingRecipes 
          ? [...JSON.parse(existingRecipes), ...formattedRecipes]
          : formattedRecipes;
        localStorage.setItem('generatedRecipes', JSON.stringify(allGeneratedRecipes));
      }

      setActiveTab('results');
      toast({
        title: 'Success!',
        description: 'Recipes generated successfully!',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate recipes. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
      setTimeout(() => {
        setShowFullScreenLoader(false);
        setShowMagicEffect(false);
      }, 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 relative"
    >
      <AnimatePresence>
        {showInitialAnimation && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.2
                }}
                className="mb-8"
              >
                <ChefHat className="h-24 w-24 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-bold text-white mb-4"
              >
                Create Your Recipe
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/80 mb-8 text-xl"
              >
                Transform ingredients into culinary masterpieces
              </motion.p>

              {/* Floating cooking elements */}
              {[Utensils, Flame, Clock, Book].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 - 50,
                    y: -100,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  animate={{ 
                    y: 100,
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="absolute text-white/50"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>
              ))}

              {/* Loading dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center gap-2 mt-8"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
        {showFullScreenLoader && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-emerald-500/90 to-teal-500/90 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center space-y-8 max-w-md mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative mx-auto w-40 h-40"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    rotate: [0, -360],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <ChefHat className="w-full h-full text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Wand2 className="h-10 w-10 text-emerald-200" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -left-2"
                  animate={{
                    rotate: [0, -360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Salad className="h-8 w-8 text-emerald-100" />
                </motion.div>
              </motion.div>

              <div className="space-y-4">
                <motion.h2
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {progress < 50 ? "Analyzing Ingredients..." : "Generating Recipes..."}
                </motion.h2>

                <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <motion.p
                  className="text-4xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {progress}%
                </motion.p>
              </div>

              <motion.div
                className="flex justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  className="h-2 w-2 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0,
                  }}
                />
                <motion.div
                  className="h-2 w-2 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                />
                <motion.div
                  className="h-2 w-2 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6 hover:bg-emerald-100/50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Button>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3 text-emerald-800">
              <ChefHat className="text-emerald-600" size={36} />
              {t.title}
            </h1>
            <p className="text-emerald-700 max-w-2xl mx-auto text-lg">{t.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload Section */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full border border-emerald-200 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Upload size={20} className="text-emerald-500" />
                    {activeTab === 'upload' ? 'Your Ingredients' : 'Ingredients Used'}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {activeTab === 'upload' 
                      ? 'Upload an image or add ingredients manually' 
                      : 'These are the ingredients we used'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upload" className="mb-4">
                    <TabsList className="grid w-full grid-cols-2 bg-emerald-100 rounded-lg p-1">
                      <TabsTrigger 
                        value="upload" 
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 rounded-md transition-all duration-200"
                      >
                        Upload
                      </TabsTrigger>
                      <TabsTrigger 
                        value="manual" 
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 rounded-md transition-all duration-200"
                      >
                        Manual
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Uploaded ingredients"
                            className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-200 shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-white/80 hover:bg-white shadow-sm"
                              onClick={() => setImagePreview(null)}
                            >
                              <X className="h-4 w-4"/>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors bg-gray-50 hover:bg-gray-100/50"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="mx-auto h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="h-6 w-6 text-emerald-500" />
                          </div>
                          <p className="text-gray-700 font-medium">{t.uploadPrompt}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Supports JPG, PNG, WEBP
                          </p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 text-gray-700"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="mr-2 h-4 w-4" />
                          )}
                          {t.uploadBtn}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 text-gray-700"
                          onClick={() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.removeAttribute('capture');
                              fileInputRef.current.click();
                            }
                          }}
                          disabled={uploading}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          {t.cameraBtn}
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="manual">
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add ingredient (e.g. chicken)"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addManualIngredient()}
                            className="border-gray-300 focus:border-emerald-400 focus-visible:ring-emerald-200"
                          />
                          <Button 
                            onClick={addManualIngredient}
                            className="bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {manualIngredients.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">{t.manualIngredients}</h4>
                            <div className="flex flex-wrap gap-2">
                              {manualIngredients.map((ingredient, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline"
                                  className="flex items-center gap-1 border-gray-300 bg-gray-100 text-gray-700 rounded-full px-3 py-1"
                                >
                                  {ingredient}
                                  <button 
                                    onClick={() => removeManualIngredient(ingredient)}
                                    className="ml-1 hover:text-red-500 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {activeTab === 'results' && (
                    <div className="space-y-4 mt-4">
                      <h3 className="font-medium flex items-center gap-2 text-gray-700">
                        <Salad className="h-4 w-4 text-emerald-500" />
                        {t.allIngredients}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="border-gray-300 bg-gray-100 text-gray-700 rounded-full px-3 py-1"
                          >
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 text-gray-700"
                        onClick={() => setActiveTab('upload')}
                      >
                        Change Ingredients
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Results Section */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full border border-emerald-200 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Sparkles className="text-emerald-500" size={20} />
                    {activeTab === 'upload' ? 'Recipe Options' : t.recipes}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {activeTab === 'upload' 
                      ? 'Configure and generate your recipes' 
                      : 'These recipes were generated just for you'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeTab === 'upload' ? (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                            {t.dietary}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border border-gray-200 shadow-lg text-gray-700">
                                  <p>Select dietary restrictions to filter recipes</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </h3>
                          <Select 
                            value={dietaryPreference} 
                            onValueChange={setDietaryPreference}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-emerald-400 focus:ring-emerald-200 text-gray-700">
                              <SelectValue placeholder="Select dietary preference" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                              {dietaryOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  className="focus:bg-gray-100 text-gray-700"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2 text-gray-700">{t.cookingTime}</h3>
                          <Select 
                            value={cookingTime} 
                            onValueChange={setCookingTime}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-emerald-400 focus:ring-emerald-200 text-gray-700">
                              <SelectValue placeholder="Select cooking time" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                              {timeOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  className="focus:bg-gray-100 text-gray-700"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                            Cuisine Type
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border border-gray-200 shadow-lg text-gray-700">
                                  <p>Select a specific cuisine type for your recipe</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </h3>
                          <Select 
                            value={cuisineType} 
                            onValueChange={setCuisineType}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-emerald-400 focus:ring-emerald-200 text-gray-700">
                              <SelectValue placeholder="Select cuisine type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                              {cuisineOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  className="focus:bg-gray-100 text-gray-700"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                            Cooking Method
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border border-gray-200 shadow-lg text-gray-700">
                                  <p>Choose your preferred cooking method</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </h3>
                          <Select 
                            value={cookingMethod} 
                            onValueChange={setCookingMethod}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-emerald-400 focus:ring-emerald-200 text-gray-700">
                              <SelectValue placeholder="Select cooking method" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                              {cookingMethodOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  className="focus:bg-gray-100 text-gray-700"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                            Spice Level
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border border-gray-200 shadow-lg text-gray-700">
                                  <p>Select your preferred spice level</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </h3>
                          <Select 
                            value={spiceLevel} 
                            onValueChange={setSpiceLevel}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-emerald-400 focus:ring-emerald-200 text-gray-700">
                              <SelectValue placeholder="Select spice level" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                              {spiceLevelOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  className="focus:bg-gray-100 text-gray-700"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2 text-gray-700">Language</h3>
                        <Select 
                          value={language} 
                          onValueChange={setLanguage}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-emerald-400 focus:ring-emerald-200 text-gray-700">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg">
                            {languageOptions.map((lang) => (
                              <SelectItem 
                                key={lang.value} 
                                value={lang.value}
                                className="focus:bg-gray-100 text-gray-700"
                              >
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator className="bg-gray-200" />

                      <div className="space-y-6">
                        <Button
                          onClick={generateRecipes}
                          disabled={isLoading || (!imagePreview && manualIngredients.length === 0)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                          size="lg"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="font-medium">{t.loadingRecipes}</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5" />
                                <span className="font-medium">{t.generateBtn}</span>
                              </>
                            )}
                          </div>
                        </Button>

                        {isLoading && (
                          <motion.div 
                            className="mt-2 space-y-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative h-2 bg-emerald-100 rounded-full overflow-hidden">
                              <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                              <motion.div
                                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                animate={{
                                  x: ['-100%', '100%'],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                              />
                            </div>
                            <motion.p 
                              className="text-xs text-emerald-600 text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {progress < 50 ? t.analyzing : t.loadingRecipes}
                            </motion.p>
                          </motion.div>
                        )}

                        {showMagicEffect && (
                          <motion.div
                            className="fixed inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 1 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20"
                              initial={{ scale: 0 }}
                              animate={{ scale: 2 }}
                              transition={{ duration: 1 }}
                            />
                            <motion.div
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              initial={{ scale: 0, rotate: 0 }}
                              animate={{ scale: [0, 1.5, 0], rotate: 360 }}
                              transition={{ duration: 1 }}
                            >
                              <Wand2 className="h-12 w-12 text-emerald-500" />
                            </motion.div>
                          </motion.div>
                        )}
                      </div>

                      <Alert className="bg-emerald-50 border border-emerald-200 rounded-lg">
                        <Info className="h-4 w-4 text-emerald-500" />
                        <AlertTitle className="text-emerald-800">{t.proTip}</AlertTitle>
                        <AlertDescription className="text-emerald-700">
                          {t.proTipContent}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isLoading ? (
                          <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.2 }}
                              >
                                <Card className="border border-emerald-200 bg-white/50 backdrop-blur-sm">
                                  <CardHeader>
                                    <motion.div
                                      className="h-6 w-3/4 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full"
                                      animate={{
                                        backgroundPosition: ['0% 0%', '100% 0%'],
                                      }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'linear',
                                      }}
                                    />
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    {[...Array(4)].map((_, j) => (
                                      <motion.div
                                        key={j}
                                        className="h-4 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full"
                                        style={{ width: `${80 - j * 10}%` }}
                                        animate={{
                                          backgroundPosition: ['0% 0%', '100% 0%'],
                                        }}
                                        transition={{
                                          duration: 1.5,
                                          repeat: Infinity,
                                          ease: 'linear',
                                          delay: j * 0.1,
                                        }}
                                      />
                                    ))}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : recipes.length > 0 ? (
                          <motion.div 
                            className="grid gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {recipes.map((recipe, index) => (
                              <motion.div
                                key={recipe.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                              >
                                <Card 
                                  className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] overflow-hidden border border-emerald-200 rounded-xl"
                                >
                                  <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 relative group">
                                      <motion.img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-full h-full min-h-[200px] object-cover"
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                      />
                                      <motion.div 
                                        className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <Button 
                                          variant="outline" 
                                          className="w-full bg-white/90 hover:bg-white text-gray-800 border-none shadow-sm"
                                          onClick={() => router.push(recipe.href)}
                                        >
                                          {t.viewRecipe}
                                        </Button>
                                      </motion.div>
                                    </div>
                                    <div className="md:w-2/3">
                                      <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start gap-2">
                                          <motion.h2
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-2xl font-bold text-emerald-800"
                                          >
                                            {isGenerating && index === currentRecipeIndex ? (
                                              <Typewriter
                                                words={[recipe.title]}
                                                loop={1}
                                                cursor
                                                cursorStyle="_"
                                                typeSpeed={70}
                                                deleteSpeed={50}
                                                delaySpeed={1000}
                                                onLoopDone={() => {
                                                  if (index < recipes.length - 1) {
                                                    setCurrentRecipeIndex(index + 1);
                                                  } else {
                                                    setIsGenerating(false);
                                                  }
                                                }}
                                              />
                                            ) : (
                                              recipe.title
                                            )}
                                          </motion.h2>
                                          <div className="flex gap-2">
                                            <motion.div
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.3, delay: 0.2 }}
                                            >
                                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
                                                {recipe.prepTime}
                                              </Badge>
                                            </motion.div>
                                            <motion.div
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.3, delay: 0.3 }}
                                            >
                                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
                                                {recipe.difficulty}
                                              </Badge>
                                            </motion.div>
                                            <motion.div
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.3, delay: 0.4 }}
                                            >
                                              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
                                                {recipe.calories} kcal
                                              </Badge>
                                            </motion.div>
                                          </div>
                                        </div>
                                        <motion.p
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.5, delay: 0.2 }}
                                          className="text-emerald-600 mt-2"
                                        >
                                          {isGenerating && index === currentRecipeIndex ? (
                                            <Typewriter
                                              words={[recipe.description || '']}
                                              loop={1}
                                              cursor
                                              cursorStyle="_"
                                              typeSpeed={30}
                                              deleteSpeed={50}
                                              delaySpeed={1000}
                                            />
                                          ) : (
                                            recipe.description
                                          )}
                                        </motion.p>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-4">
                                          {recipe.tipsAndTricks?.length > 0 && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.3, delay: 0.3 }}
                                            >
                                              <h4 className="font-bold mb-2 flex items-center gap-2 text-emerald-700">
                                                <Sparkles className="h-4 w-4 text-emerald-500" />
                                                {t.tips}
                                              </h4>
                                              <ul className="list-disc pl-5 space-y-1 text-sm text-emerald-600">
                                                {recipe.tipsAndTricks.slice(0, 2).map((tip, i) => (
                                                  <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                                                    className="font-medium"
                                                  >
                                                    {isGenerating && index === currentRecipeIndex ? (
                                                      <Typewriter
                                                        words={[tip]}
                                                        loop={1}
                                                        cursor
                                                        cursorStyle="_"
                                                        typeSpeed={20}
                                                        deleteSpeed={50}
                                                        delaySpeed={1000}
                                                      />
                                                    ) : (
                                                      tip
                                                    )}
                                                  </motion.li>
                                                ))}
                                              </ul>
                                            </motion.div>
                                          )}
                                          
                                          <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.4 }}
                                          >
                                            <h4 className="font-bold mb-2 text-emerald-700">{t.instructions}</h4>
                                            <ol className="list-decimal pl-5 space-y-2 text-sm text-emerald-600">
                                              {recipe.instructions.slice(0, 3).map((step, i) => (
                                                <motion.li
                                                  key={i}
                                                  initial={{ opacity: 0, x: -20 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                                                  className="font-medium"
                                                >
                                                  {isGenerating && index === currentRecipeIndex ? (
                                                    <Typewriter
                                                      words={[step]}
                                                      loop={1}
                                                      cursor
                                                      cursorStyle="_"
                                                      typeSpeed={20}
                                                      deleteSpeed={50}
                                                      delaySpeed={1000}
                                                    />
                                                  ) : (
                                                    step
                                                  )}
                                                </motion.li>
                                              ))}
                                            </ol>
                                          </motion.div>
                                        </div>
                                      </CardContent>
                                    </div>
                                  </div>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                              <Salad className="h-12 w-12 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-medium mb-2 text-gray-700">{t.noRecipes}</h3>
                            <p className="text-gray-500">
                              {t.noRecipesContent}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateRecipe;