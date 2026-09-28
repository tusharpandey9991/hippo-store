// App.jsx
import './App.css';
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import Navbar from './components/Navbar';
import GameList from './components/GameList';

function App() {
  const typedRef = useRef(null);
  const typedInstance = useRef(null);

  useEffect(() => {
    typedInstance.current = new Typed(typedRef.current, {
      strings: [
        "Welcome to Pregnant Hippo Store",
        "Welcome to Elegant Hippo Store"
      ],
      typeSpeed: 70,
      backSpeed: 50,
      backDelay: 1500,
      startDelay: 400,
      loop: true,
      smartBackspace: true,
      showCursor: false,

    });

    return () => {
      typedInstance.current.destroy();
    };
  }, []);

  return (
    <div className="app page-wrapper">
      <Navbar />
      <main className="content-wrapper">
        <div className="heading-box enhanced-heading-box">
          <h1 className="heading enhanced-heading">
            <span
              ref={typedRef}
              className="sparkle-text glitch-text"
            ></span>
            <img
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
