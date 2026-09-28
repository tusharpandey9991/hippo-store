// src/services/GameService.js
const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const RAWG_BASE = 'https://api.rawg.io/api';
const CHEAPSHARK_BASE = 'https://www.cheapshark.com/api/1.0';
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

// Fetch list of games from RAWG (e.g., latest or popular)
export const fetchGames = async (pageSize = 50, page = 1) => {
  try {
    const response = await fetch(
      `${RAWG_BASE}/games?key=${RAWG_API_KEY}&page_size=${pageSize}&page=${page}&ordering=-released&platforms=4` // PC platform ID=4
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching games from RAWG:', error);
    return [];
  }
};

// Enrich a single game with price/discount from CheapShark
export const fetchGamePrice = async (title) => {
  try {
    const response = await fetch(`${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(title)}&limit=1`);
    const data = await response.json();
    if (data.length > 0) {
      const deal = data[0].cheapest;
      return {
        price: `$${deal.salePrice}`, // e.g., "$19.99"
        originalPrice: `$${deal.normalPrice}`, // For display
        discount: Math.round((1 - deal.salePrice / deal.normalPrice) * 100) // Calculate %
      };
    }
    return { price: "$59.99", discount: 0 }; // Fallback
  } catch (error) {
    console.error('Error fetching price:', error);
    return { price: "$59.99", discount: 0 };
  }
};

// Fetch trailer URL from YouTube
export const fetchTrailer = async (title) => {
  try {
    const query = `${title} official trailer`;
    const response = await fetch(
      `${YOUTUBE_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1&videoEmbeddable=true`
    );
    const data = await response.json();
    if (data.items.length > 0) {
      return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
};

// Fetch preview video (gameplay) from YouTube
export const fetchPreviewVideo = async (title) => {
  try {
    const query = `${title} gameplay preview`;
    const response = await fetch(
      `${YOUTUBE_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1&videoEmbeddable=true`
    );
    const data = await response.json();
    if (data.items.length > 0) {
      return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching preview:', error);
    return null;
  }
};

// Main function: Fetch and enrich games
export const fetchEnrichedGames = async (pageSize = 50, page = 1) => {
  const games = await fetchGames(pageSize, page);
  const enrichedGames = await Promise.all(
    games.map(async (game) => {
      const { price, discount } = await fetchGamePrice(game.name);
      const trailer = await fetchTrailer(game.name);
      const previewVideo = await fetchPreviewVideo(game.name);
      const image = game.background_image || game.short_screenshots?.[0]?.image || 'https://via.placeholder.com/300x200?text=No+Image'; // Fallback

      return {
        title: game.name,
        description: game.description ? game.description.substring(0, 100) + '...' : 'Top-tier gaming experience.',
        longDescription: game.description || 'Immerse yourself in this epic game with stunning visuals and engaging gameplay.',
        price,
        discount,
        image,
        trailer,
        previewVideo
      };
    })
  );
  return enrichedGames;
};