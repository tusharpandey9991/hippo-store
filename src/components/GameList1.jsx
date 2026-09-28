import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GameList.css";

export function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const RAWG_KEY = "YOUR_RAWG_API_KEY";
  const ITAD_KEY = "YOUR_ITAD_API_KEY";

  const RAWG_API = `https://api.rawg.io/api/games?key=${RAWG_KEY}&page_size=10`;

  useEffect(() => {
    fetchGames(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchGames(pageNum) {
    setLoading(true);
    try {
      const res = await axios.get(`${RAWG_API}&page=${pageNum}`);
      const rawgGames = res.data.results;

      if (rawgGames.length === 0) {
        setHasMore(false);
        return;
      }

      // For each game → fetch discount data from ITAD
      const gamesWithPrices = await Promise.all(
        rawgGames.map(async (game) => {
          try {
            const priceRes = await axios.get(
              `https://api.isthereanydeal.com/v01/game/prices/`,
              {
                params: {
                  key: ITAD_KEY,
                  plains: game.slug, // use RAWG slug
                  shops: "steam",
                  region: "us"
                }
              }
            );

            const deal = priceRes.data?.data?.[game.slug]?.list?.[0];
            return {
              ...game,
              price: deal?.price_new ? `$${deal.price_new}` : "N/A",
              discount: deal?.price_cut ? `${deal.price_cut}% off` : null,
              oldPrice: deal?.price_old ? `$${deal.price_old}` : null
            };
          } catch {
            return { ...game, price: "N/A" };
          }
        })
      );

      setGames((prev) => [...prev, ...gamesWithPrices]);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <div className="game-list-container">
      <h2 className="game-list-title">Popular Games</h2>

      <div className="game-grid">
        {games.map((game, index) => (
          <div key={index} className="game-card">
            <img src={game.background_image} alt={game.name} className="game-image" />
            <h3 className="game-title">{game.name}</h3>
            <p className="game-genre">
              {game.genres?.map((g) => g.name).join(", ") || "Unknown Genre"}
            </p>
            <p className="game-rating">⭐ {game.rating}</p>
            <p className="game-release">
              Released: {game.released || "N/A"}
            </p>

            {/* Price & Discount */}
            {game.price !== "N/A" ? (
              <p className="game-price">
                {game.discount ? (
                  <>
                    <span className="old-price">{game.oldPrice}</span>{" "}
                    <span className="discount">{game.discount}</span>{" "}
                    <span className="new-price">{game.price}</span>
                  </>
                ) : (
                  <span className="new-price">{game.price}</span>
                )}
              </p>
            ) : (
              <p className="game-price">Price: Not Available</p>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more-wrapper">
          <button onClick={loadMore} disabled={loading} className="load-more-btn">
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
