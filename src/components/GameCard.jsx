import React, { useState } from 'react';
import './GameCard.css';

function GameCard({ game, onClick, isFlipped, toggleFlip }) {
  const handleFlip = (e) => {
    e.stopPropagation();
    toggleFlip(game.title);
  };

  return (
    <div className={`game-card-wrapper ${isFlipped ? 'flipped' : ''}`}>
      <div className="game-card-inner">
        {/* FRONT SIDE */}
        <div className="game-card front" onClick={() => onClick(game)}>
          <img src={game.image} alt={game.title} className="game-card-image" />
          <h3 className="game-card-title">{game.title}</h3>
          <p className="game-card-short-desc">{game.description}</p>
          <button className="flip-btn" onClick={handleFlip}>🔁 Details</button>
        </div>

        {/* BACK SIDE */}
        <div className="game-card back" onClick={(e) => e.stopPropagation()}>
          <div className="preview-container">
            {game.previewVideo ? (
              <video
                className="preview-video"
                src={game.previewVideo}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className="preview-placeholder">🎮 No Preview Available</div>
            )}
          </div>

          <div className="description-container">
            <h4>{game.title}</h4>
            <p className="game-card-long-desc">{game.longDescription}</p>
          </div>

          <button className="flip-back-btn" onClick={handleFlip}>🔙 Back</button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;

