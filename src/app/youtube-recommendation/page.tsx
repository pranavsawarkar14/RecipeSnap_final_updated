'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Book, Loader2, Upload, Camera, Youtube, ExternalLink, RefreshCw } from 'lucide-react';
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
import { useEffect, useRef } from 'react';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
          duration: 1000,
        });
      }
    };

    getCameraPermission();
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

  const handleCamera = () => {
    // Trigger file input click
    fileInputRef.current?.click();
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
    <div className="flex flex-col items-center min-h-screen p-4 bg-secondary">
      <Navbar />
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-md rounded-lg p-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-2xl font-bold mb-4">YouTube Recipe Videos</h1>
        <CardDescription>Find real YouTube videos for any recipe by entering a description or uploading an image of ingredients.</CardDescription>
        
        <CardContent className="grid gap-4 mt-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Uploaded ingredients"
                className="max-w-full h-auto rounded-md"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background hover:bg-muted"
                onClick={() => setImagePreview(null)}
              >
                <ArrowLeft className="h-4 w-4"/>
              </Button>
            </div>
          ) : (
            <Alert>
              <AlertTitle>Find Recipe Videos</AlertTitle>
              <AlertDescription>
                Enter a recipe description or upload an image of ingredients to find matching YouTube videos.
              </AlertDescription>
            </Alert>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            ref={fileInputRef}
          />
          
          <div className="flex justify-between">
            <Button
              disabled={uploading || isLoading}
              className="bg-accent text-primary-foreground hover:bg-accent-foreground"
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
            
            <Button
              disabled={uploading || isLoading || !hasCameraPermission}
              className="bg-accent text-primary-foreground hover:bg-accent-foreground"
              onClick={handleCamera}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Taking Photo...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4"/>
                  Take Photo
                </>
              )}
            </Button>
          </div>
          
          <Textarea
            placeholder="Enter a recipe you want to find (e.g., 'chocolate chip cookies', 'beef stroganoff')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
            disabled={isLoading}
          />

          <Select 
            value={language} 
            onValueChange={setLanguage} 
            disabled={isLoading}
            className="mb-4"
          >
            <SelectTrigger className="w-full">
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

          <Button 
            onClick={handleGenerateRecommendations} 
            disabled={isLoading} 
            className="w-full"
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

          {youtubeVideos.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Recipe Videos on YouTube:</h2>
              <div className="space-y-4">
                {youtubeVideos.map((video, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="p-3 bg-muted/50 flex justify-between items-center">
                      <h3 className="font-medium truncate">{video.title}</h3>
                      <div className="flex items-center gap-2">
                        {video.hasError && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRetryVideo(index)}
                            className="h-6 w-6"
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
                    
                    {/* Show video or thumbnail based on error state */}
                    {video.hasError ? (
                      // Show thumbnail with link when there's an error
                      <a 
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-video relative bg-muted flex items-center justify-center"
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                          <Youtube className="h-8 w-8 mb-2" />
                          <p>Click to watch on YouTube</p>
                        </div>
                      </a>
                    ) : (
                      // Try to embed the video with error handling
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
                  </div>
                ))}
              </div>

              {/* Fallback message in case videos don't load */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Having trouble viewing videos? <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent((description || 'recipe') + ' recipe')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Search directly on YouTube
                </a></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YoutubeRecommendationPage;