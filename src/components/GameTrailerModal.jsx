import React from "react";
import "./GameTrailerModal.css";

const GameTrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  // Automatically add autoplay if it's a YouTube link
  const embedUrl = trailerUrl.includes("youtube.com") || trailerUrl.includes("youtu.be")
    ? trailerUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/") + "?autoplay=1"
    : trailerUrl;

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="video-wrapper">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="Game Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default GameTrailerModal;
