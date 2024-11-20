

import React from 'react';
import { Search, Music2, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';
const CLIENT_ID = '700291662a1d46858524e1fbfcc9755c';
const CLIENT_SECRET = '29acb092a6c741c5bc817df8b6f83744';

const getSpotifyAccessToken = async () => {
  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const base64Credentials = btoa(credentials);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
};

const getTrackInfoFromSpotify = async (trackName, accessToken) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=1`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  const track = data.tracks.items[0]; // Assuming the first result is the correct track

  if (track) {
    return {
      track: track.name,
      artist: track.artists[0].name,
      image_url: track.album.images[0].url, // Get the first image (album cover)
    };
  } else {
    return null;
  }
};

const getRecommendations = async (artist) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/recommendations${artist ? `?artist=${encodeURIComponent(artist)}` : ''}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch recommendations');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch recommendations');
  }
};

function App() {
  const [artistName, setArtistName] = React.useState('');
  const [recommendations, setRecommendations] = React.useState([]);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!artistName.trim()) {
      setError('Please enter an artist name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await getRecommendations(artistName);
      if (data.success) {
        const accessToken = await getSpotifyAccessToken();
        const recommendationsWithImages = await Promise.all(
          data.recommendations.map(async (recommendation) => {
            const trackInfo = await getTrackInfoFromSpotify(recommendation.track, accessToken);
            return trackInfo ? { ...recommendation, image_url: trackInfo.image_url } : recommendation;
          })
        );
        setRecommendations(recommendationsWithImages);
      } else {
        setError('No recommendations found');
        setRecommendations([]);
      }
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

   return (
     <div className="min-h-screen bg-gray-50 p-4">
       <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
         <div className="mb-4">
           <h1 className="text-2xl font-bold flex items-center gap-2">
             <Music2 className="w-6 h-6" />
             Artist-Based Music Recommendations
           </h1>
         </div>
         <div className="space-y-4">
           <div className="space-y-2">
             <label className="text-sm font-medium">Artist Name</label>
             <div className="relative">
               <input
                 type="text"
                 value={artistName}
                 onChange={(e) => setArtistName(e.target.value)}
                 placeholder="Enter artist name"
                 className="w-full p-2 border rounded-md pl-8"
                 onKeyPress={(e) => {
                   if (e.key === 'Enter') {
                     handleSubmit();
                   }
                 }}
               />
               <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
             </div>
           </div>

           <button
             onClick={handleSubmit}
             disabled={isLoading}
             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
           >
             {isLoading ? (
               <>
                 <Loader2 className="w-4 h-4 animate-spin" />
                 Getting Recommendations...
               </>
             ) : (
               'Get Recommendations'
             )}
           </button>

         {error && (
           <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-md">
             {error}
           </div>
         )}

           {recommendations.length > 0 && (
             <div className="mt-6">
               <h3 className="text-lg font-semibold mb-3">Recommended Tracks:</h3>
               <div className="space-y-2">
                 {recommendations.map((recommendation, index) => (
                   <div
                     key={index}
                     className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-4"
                   >
                     {/* Display Poster (Album Image) */}
                     {recommendation.image_url && (
                       <img
                         src={recommendation.image_url}
                         alt={recommendation.track}
                         className="w-16 h-16 rounded-md object-cover"
                       />
                     )}
                     <div className="flex-1">
                       <h4 className="font-semibold text-lg">{recommendation.track}</h4>
                       <p className="text-sm text-gray-500">{recommendation.artist}</p>
                       <div className="text-sm mt-1">
                         <span>Spotify Streams: {recommendation.spotify_streams.toLocaleString()}</span>
                       </div>
                       <div className="text-sm mt-1">
                         <span>YouTube Views: {recommendation.youtube_views.toLocaleString()}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   );

 
}

export default App;
