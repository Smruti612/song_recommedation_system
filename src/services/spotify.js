// import axios from 'axios';

// // Replace these with your actual Spotify API credentials
// const CLIENT_ID = '700291662a1d46858524e1fbfcc9755c';
// const CLIENT_SECRET = '29acb092a6c741c5bc817df8b6f83744';

// const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
// const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// // Get Spotify access token
// const getSpotifyToken = async () => {
//   try {
//     const response = await axios.post(
//       SPOTIFY_AUTH_URL,
//       new URLSearchParams({
//         grant_type: 'client_credentials',
//       }).toString(),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
//         },
//       }
//     );
//     return response.data.access_token;
//   } catch (error) {
//     throw new Error('Failed to get Spotify access token');
//   }
// };

// // Search for an artist
// export const searchArtist = async (artistName) => {
//   try {
//     const token = await getSpotifyToken();
//     const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
//       params: {
//         q: artistName,
//         type: 'artist',
//         limit: 1,
//       },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data.artists.items[0];
//   } catch (error) {
//     throw new Error('Failed to search for artist');
//   }
// };

// // Get artist's top tracks
// export const getArtistTopTracks = async (artistId) => {
//   try {
//     const token = await getSpotifyToken();
//     const response = await axios.get(
//       `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks?market=US`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data.tracks;
//   } catch (error) {
//     throw new Error('Failed to get artist top tracks');
//   }
// };

// // Get recommendations based on artist
// export const getRecommendations = async (artistId) => {
//   try {
//     const token = await getSpotifyToken();
//     const response = await axios.get(`${SPOTIFY_API_BASE}/recommendations`, {
//       params: {
//         seed_artists: artistId,
//         limit: 10,
//       },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
    
//     return response.data.tracks.map(track => ({
//       id: track.id,
//       track: track.name,
//       artist: track.artists[0].name,
//       image_url: track.album.images[0]?.url,
//       preview_url: track.preview_url,
//       external_url: track.external_urls.spotify,
//       popularity: track.popularity
//     }));
//   } catch (error) {
//     throw new Error('Failed to get recommendations');
//   }
// };