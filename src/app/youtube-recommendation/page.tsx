'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Book, Loader2, Upload, Camera, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "@/components/LanguageFilter";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {identifyIngredients} from "@/ai/flows/identify-ingredients";
import {getYoutubeVideoSuggestions} from "@/ai/flows/generate-youtube-suggestions";
import { useEffect, useRef } from 'react';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";


const YoutubeRecommendationPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [youtubeVideoSuggestions, setYoutubeVideoSuggestions] = useState<string[]>([]);
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


    const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    try {
        let youtubeVideoSuggestions: string[] = [];
        if(imagePreview){
            const ingredientResult = await identifyIngredients({photoUrl: imagePreview});
            const identifiedIngredients = ingredientResult.ingredients;
            const joinedIngredients = identifiedIngredients.join(", ");

            const result = await getYoutubeVideoSuggestions({
                recipeDescription: joinedIngredients,
                language: language,
            });
            youtubeVideoSuggestions = result.youtubeVideoSuggestions;

        } else{
             const result = await getYoutubeVideoSuggestions({
                 recipeDescription: description,
                 language: language,
             });
             youtubeVideoSuggestions = result.youtubeVideoSuggestions;
        }
      if (youtubeVideoSuggestions && youtubeVideoSuggestions.length > 0) {
        setYoutubeVideoSuggestions(youtubeVideoSuggestions);
      } else {
        toast({
          title: "No videos generated",
          description: "Could not generate videos from the provided text.",
        });
        setYoutubeVideoSuggestions([]);
      }
    } catch (error: any) {
      console.error("Error generating video:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate videos. Please try again.",
      });
      setYoutubeVideoSuggestions([]);
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
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "There was an error uploading your image.",
                variant: "destructive",
                duration: 1000,
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

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-secondary">
      <Navbar />
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-md rounded-lg p-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-2xl font-bold mb-4">YouTube Video Recommendation</h1>
          <CardDescription>Generate YouTube video recommendations based on a text description or an image.</CardDescription>
        <CardContent className="grid gap-4">
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
                    <AlertTitle>No Image Uploaded</AlertTitle>
                    <AlertDescription>
                        Please upload an image of your ingredients.
                    </AlertDescription>
                </Alert>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
            />
            <div className="flex justify-between">
                <Button
                    asChild={false}
                    disabled={uploading}
                    className="bg-accent text-primary-foreground hover:bg-accent-foreground"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    htmlFor="image-upload"
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
                    asChild={false}
                    disabled={uploading}
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
            placeholder="Enter recipe description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />

          <Select value={language} onValueChange={setLanguage} className="mb-4">
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

          <Button onClick={handleGenerateRecommendations} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Videos"
            )}
          </Button>

          {youtubeVideoSuggestions.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Generated Videos:</h2>
              <ul>
                {youtubeVideoSuggestions.map((videoId, index) => (
                  <li key={index} className="mb-2 p-2 border rounded-md">
                      <iframe
                          width="100%"
                          height="315"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                      ></iframe>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YoutubeRecommendationPage;
