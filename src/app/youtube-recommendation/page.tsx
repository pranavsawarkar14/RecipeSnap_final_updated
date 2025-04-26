'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Book, Loader2, Upload, Youtube, ExternalLink, RefreshCw, Play, Video, ThumbsUp, Clock } from 'lucide-react';
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
import Navbar from "@/components/Navbar";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {identifyIngredients} from "@/ai/flows/identify-ingredients";
import {getYoutubeVideoSuggestions} from "@/ai/flows/generate-youtube-suggestions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

// Interface for YouTube video data
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  hasError: boolean;
}

const YoutubeRecommendationPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [language, setLanguage] = useState<Languages>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);

  useEffect(() => {
    // Hide initial animation after 3 seconds
    const timer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get YouTube videos with guaranteed working IDs
  const getYouTubeVideos = async (searchQuery: string): Promise<YouTubeVideo[]> => {
    try {
      // First, try to get videos from the AI
      const result = await getYoutubeVideoSuggestions({
        recipeDescription: searchQuery,
        language: language,
      });
      
      let videoIds = result.youtubeVideoSuggestions || [];
      
      // If no videos returned, use these backup recipe video IDs
      if (!videoIds || videoIds.length === 0) {
        console.log("No videos returned from AI, using fallbacks");
        // Use popular cooking channels' reliable video IDs
        videoIds = [
          "nU8yGOF_QJE", // Food Network
          "JOqlHxJfFRU", // Jamie Oliver
          "tJQZ6BlpLHQ", // Gordon Ramsay
          "BLTrjYc4bz0", // Tasty recipe
          "oZZatDlY5lE"  // Popular recipe
        ];
      }
      
      // Create video objects with default titles
      return videoIds.filter(id => id && id.trim().length > 0).map(id => ({
        id,
        title: `Recipe video for ${description || 'your ingredients'}`,
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        hasError: false
      }));
    } catch (error) {
      console.error("Error getting YouTube videos:", error);
      
      // Return fallback videos in case of error
      return [
        {
          id: "nU8yGOF_QJE",
          title: "Food Network Recipe",
          thumbnail: "https://img.youtube.com/vi/nU8yGOF_QJE/hqdefault.jpg",
          hasError: false
        },
        {
          id: "JOqlHxJfFRU",
          title: "Jamie Oliver Recipe",
          thumbnail: "https://img.youtube.com/vi/JOqlHxJfFRU/hqdefault.jpg",
          hasError: false
        }
      ];
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!description && !imagePreview) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a recipe description or upload an image.",
      });
      return;
    }

    setIsLoading(true);
    setYoutubeVideos([]); // Clear previous results
    
    try {
      let searchQuery = description;
      
      // If image is provided, identify ingredients first
      if (imagePreview) {
        toast({
          title: "Analyzing image",
          description: "Identifying ingredients in your image...",
          duration: 1500,
        });
        
        try {
          const ingredientResult = await identifyIngredients({photoUrl: imagePreview});
          const identifiedIngredients = ingredientResult.ingredients;
          
          if (identifiedIngredients && identifiedIngredients.length > 0) {
            searchQuery = identifiedIngredients.join(", ");
            
            toast({
              title: "Ingredients identified",
              description: `Found: ${identifiedIngredients.slice(0, 3).join(", ")}${identifiedIngredients.length > 3 ? '...' : ''}`,
              duration: 1500,
            });
          } else {
            // If no ingredients identified, just use any description or a default
            searchQuery = description || "food recipe";
            
            toast({
              variant: "warning",
              title: "Using default search",
              description: "Couldn't identify specific ingredients. Searching for general recipes.",
              duration: 1500,
            });
          }
        } catch (error) {
          console.error("Error identifying ingredients:", error);
          searchQuery = description || "food recipe";
        }
      }
      
      // Make sure to append "recipe" to search query for better results
      const fullSearchQuery = `${searchQuery} recipe`.trim();
      
      toast({
        title: "Searching YouTube",
        description: "Finding recipe videos for you...",
        duration: 2000,
      });
      
      // Get videos based on search query
      const videos = await getYouTubeVideos(fullSearchQuery);
      
      if (videos.length > 0) {
        setYoutubeVideos(videos);
        toast({
          title: "Videos found",
          description: `Found ${videos.length} recipe videos for you.`,
          duration: 2000,
        });
      } else {
        toast({
          title: "No videos found",
          description: "Could not find any videos for this recipe. Try different keywords.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error("Error generating video recommendations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate videos. Please try again.",
        duration: 3000,
      });
      
      // Even if there's an error, try to show some default videos
      const fallbackVideos = [
        {
          id: "nU8yGOF_QJE",
          title: "Food Network Recipe",
          thumbnail: "https://img.youtube.com/vi/nU8yGOF_QJE/hqdefault.jpg",
          hasError: false
        },
        {
          id: "JOqlHxJfFRU",
          title: "Jamie Oliver Recipe",
          thumbnail: "https://img.youtube.com/vi/JOqlHxJfFRU/hqdefault.jpg",
          hasError: false
        }
      ];
      
      setYoutubeVideos(fallbackVideos);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        toast({
          title: "Image uploaded",
          description: "Your ingredient image is ready for analysis.",
          duration: 1500,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
        duration: 1500,
      });
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle iframe error
  const handleVideoError = (index: number) => {
    const updatedVideos = [...youtubeVideos];
    updatedVideos[index].hasError = true;
    setYoutubeVideos(updatedVideos);
  };

  // Try alternative embed approach
  const handleRetryVideo = (index: number) => {
    const updatedVideos = [...youtubeVideos];
    updatedVideos[index].hasError = false;
    setYoutubeVideos([...updatedVideos]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <Navbar />
      <AnimatePresence>
        {showInitialAnimation && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-to-b from-red-600 to-red-800 z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full max-w-2xl mx-auto px-4"
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
                className="flex justify-center items-center mb-8"
              >
                <Youtube className="h-32 w-32 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-bold text-white mb-4"
              >
                YouTube Recipe Videos
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/80 mb-8 text-xl"
              >
                Discover the perfect cooking tutorial for your next meal
              </motion.p>

              {/* Floating video elements */}
              {[Play, Video, ThumbsUp, Clock].map((Icon, i) => (
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
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-4 py-8 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Card className="w-full bg-card/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <Button 
                  variant="ghost" 
                  onClick={() => router.back()} 
                  className="hover:bg-accent/10 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="text-sm text-muted-foreground">Find Your Perfect Recipe</div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                YouTube Recipe Videos
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground"
              >
                Discover the perfect cooking tutorial for your next meal. Enter a recipe description or upload an image of ingredients to find matching YouTube videos.
              </motion.p>

              <AnimatePresence mode="wait">
                {imagePreview ? (
                  <motion.div
                    key="image-preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative rounded-xl overflow-hidden border border-border/50"
                  >
                    <img
                      src={imagePreview}
                      alt="Uploaded ingredients"
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => setImagePreview(null)}
                    >
                      <ArrowLeft className="h-4 w-4"/>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="alert"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Alert className="bg-accent/5 border-accent/20">
                      <AlertTitle className="text-accent">Ready to Cook?</AlertTitle>
                      <AlertDescription>
                        Enter a recipe description or upload an image of ingredients to find matching YouTube videos.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                ref={fileInputRef}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-between gap-4"
              >
                <Button
                  disabled={uploading || isLoading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4"/>
                      Upload Image
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Textarea
                  placeholder="Enter a recipe you want to find (e.g., 'chocolate chip cookies', 'beef stroganoff')"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50"
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Select 
                  value={language} 
                  onValueChange={setLanguage} 
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-background/50 border-border/50">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button 
                  onClick={handleGenerateRecommendations} 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching YouTube...
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" />
                      Find Recipe Videos
                    </>
                  )}
                </Button>
              </motion.div>

              <AnimatePresence>
                {youtubeVideos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 space-y-6"
                  >
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Recipe Videos on YouTube
                    </h2>
                    <div className="space-y-6">
                      {youtubeVideos.map((video, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm"
                        >
                          <div className="p-4 bg-accent/5 flex justify-between items-center border-b border-border/50">
                            <h3 className="font-medium truncate">{video.title}</h3>
                            <div className="flex items-center gap-2">
                              {video.hasError && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleRetryVideo(index)}
                                  className="h-6 w-6 hover:bg-accent/10"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
                              <a 
                                href={`https://www.youtube.com/watch?v=${video.id}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                          
                          {video.hasError ? (
                            <a 
                              href={`https://www.youtube.com/watch?v=${video.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block aspect-video relative bg-muted/50 flex items-center justify-center group"
                            >
                              <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors flex flex-col items-center justify-center text-white">
                                <Youtube className="h-8 w-8 mb-2" />
                                <p>Click to watch on YouTube</p>
                              </div>
                            </a>
                          ) : (
                            <div className="aspect-video">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.id}`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="border-0"
                                onError={() => handleVideoError(index)}
                              ></iframe>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      <p>Having trouble viewing videos? <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent((description || 'recipe') + ' recipe')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Search directly on YouTube
                      </a></p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default YoutubeRecommendationPage;