// /ai/flows/generate-youtube-suggestions.js

/**
 * Fetches YouTube video IDs for a given recipe description
 * Uses YouTube Data API to search for relevant videos
 */
export async function getYoutubeVideoSuggestions({ recipeDescription, language = "en" }) {
    try {
      // Get API key from environment variables
      const apiKey = process.env.YOUTUBE_API_KEY;
      
      if (!apiKey) {
        throw new Error("YouTube API key is missing. Please add YOUTUBE_API_KEY to your .env file.");
      }
  
      // Encode the search query
      const query = encodeURIComponent(`${recipeDescription} ${language === "en" ? "" : language}`);
      
      // Call YouTube API to search for videos
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&maxResults=5&key=${apiKey}`
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("YouTube API error:", errorData);
        throw new Error("Failed to fetch videos from YouTube API");
      }
  
      const data = await response.json();
      
      // Extract the video IDs from the response
      const videoIds = data.items.map((item) => item.id.videoId);
      
      // Return the video IDs array
      return { 
        youtubeVideoSuggestions: videoIds 
      };
    } catch (error) {
      console.error("Error in getYoutubeVideoSuggestions:", error);
      throw new Error(`Failed to get YouTube video suggestions: ${error.message}`);
    }
  }