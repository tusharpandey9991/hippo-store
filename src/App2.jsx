// App.jsx
import './App.css';
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import Navbar from './components/Navbar';
import GameList from './components/GameList';

function App() {
  const typedRef = useRef(null);
  const logoRef = useRef(null);
  const sparkleRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Pregnant Hippo Store",
        "Elegant Hippo Store"
      ],
      typeSpeed: 70,
      backSpeed: 50,
      backDelay: 1500,
      startDelay: 400,
      loop: true,
      smartBackspace: true,
      showCursor: false,
      onStringTyped: () => {
        // Add flicker effect to sparkle-text
        if (sparkleRef.current) {
          sparkleRef.current.classList.add('flicker-switch');
        }

        // Add bounce-glow to logo
        if (logoRef.current) {
          logoRef.current.classList.add('bounce-glow');
        }

        // Remove effects after 800ms
        setTimeout(() => {
          if (sparkleRef.current) {
            sparkleRef.current.classList.remove('flicker-switch');
          }
          if (logoRef.current) {
            logoRef.current.classList.remove('bounce-glow');
          }
        }, 800);
      },
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="app page-wrapper">
      <Navbar />
      <main className="content-wrapper">
        <div className="heading-box enhanced-heading-box">
          <h1 className="heading enhanced-heading">
            <span
              ref={sparkleRef}
              className="sparkle-text glitch-text"
            >
              Welcome to{' '}
              <span ref={typedRef}></span>
            </span>
            <img
              ref={logoRef}
              src="/src/assets/logo.png"
              alt="Hippo Icon"
              className="heading-icon"
            />
          </h1>
        </div>
        <GameList />
      </main>
    </div>
  );
}

export default App;
