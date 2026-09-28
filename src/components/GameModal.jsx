import React, { useState, useEffect, useRef } from 'react';
import './GameModal.css';
import GameTrailerModal from './GameTrailerModal';

const GameModal = ({ game, onClose, comments, onAddComment }) => {
  if (!game) return null;

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState("");
  const lastCommentRef = useRef(null);
  const modalRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() && !rating) return;

    const entry = {
      text: newComment.trim(),
      rating: rating || null,
      timestamp: new Date().toLocaleString(),
    };
    onAddComment(entry);
    setNewComment("");
    setRating("");
  };

  // Auto scroll and highlight latest comment
  useEffect(() => {
    if (lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({ behavior: 'smooth' });
      lastCommentRef.current.classList.add('highlight-comment');
      const timeout = setTimeout(() => {
        lastCommentRef.current?.classList.remove('highlight-comment');
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [comments]);



  // Escape key closes modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Drag functionality
  useEffect(() => {
    const modal = modalRef.current;
    let isDragging = false;

    const onMouseDown = (e) => {
      if (e.target.closest('.close-btn')) return; // prevent drag on close button
      isDragging = true;
      dragOffset.current = {
        x: e.clientX - modal.getBoundingClientRect().left,
        y: e.clientY - modal.getBoundingClientRect().top,
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        modal.style.left = `${e.clientX - dragOffset.current.x}px`;
        modal.style.top = `${e.clientY - dragOffset.current.y}px`;
        modal.style.position = 'absolute';
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    modal?.addEventListener('mousedown', onMouseDown);
    return () => modal?.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        const modal = modalRef.current;
        if (modal) {
          modal.scrollTo({ top: 0, behavior: "smooth" });

          // Add glow to ❌ close button
          const closeBtn = modal.querySelector('.close-btn');
          if (closeBtn) {
            closeBtn.classList.add('glow-close');
            setTimeout(() => closeBtn.classList.remove('glow-close'), 2500);
          }
        }
      }}
    >

      <div
        className="modal-content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Ensure modal doesn't close on background click
      >
        <button className="close-btn" onClick={onClose}>✖</button>

        <img src={game.image} alt={game.title} className="modal-image" />

        <div className="rate-button-container">
          <button
            className="rate-icon-btn"
            title="Rate this game"
            onClick={(e) => {
              e.stopPropagation();
              const rateSection = document.querySelector(".comment-section");
              if (rateSection) rateSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ⭐
          </button>
        </div>

        <h2>{game.title}</h2>
        <p>{game.description}</p>
        <p className="modal-price">{game.price}</p>

        <div className="comment-section resizable-box">
          <h3>Rate & Comment</h3>
          <form onSubmit={handleSubmit} className="rating-form">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="rating-select"
            >
              <option value="">Rate this game</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>

            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />

            <button type="submit" className="post-btn">Post</button>
          </form>

          <h4>History</h4>
          <div className="comment-scroll">
            <ul className="comment-list">
              {comments.length > 0 ? (
                comments.map((entry, index) => (
                  <li
                    key={index}
                    ref={index === comments.length - 1 ? lastCommentRef : null}
                  >
                    {entry.rating && <strong>⭐ {entry.rating} </strong>}
                    {entry.text && <span>💬 {entry.text}</span>}
                    <div className="timestamp">🕓 {entry.timestamp}</div>
                  </li>
                ))
              ) : (
                <li>No feedback yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
