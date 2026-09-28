import "./App.css";

import React, { useEffect, useRef, useState } from "react";

import Typed from "typed.js";

import Navbar from "./components/Navbar";

import GameList from "./components/GameList";

import "./components/Scrollbar.css";

import logo from "./assets/logo.png";

function App() {
  const fullTypedRef = useRef(null);

  const storeTypedRef = useRef(null);

  const [loopStarted, setLoopStarted] = useState(false);

  useEffect(() => {
    const fullInstance = new Typed(fullTypedRef.current, {
      strings: ["Welcome to Gaming Hippo Store"],

      typeSpeed: 70,

      backSpeed: 50,

      showCursor: false,

      onComplete: () => {
        setTimeout(() => {
          setLoopStarted(true);
        }, 500); // Delay before transition
      },
    });

    return () => fullInstance.destroy();
  }, []);

  useEffect(() => {
    if (!loopStarted) return;

    const storeLoopInstance = new Typed(storeTypedRef.current, {
      strings: ["Elegant Hippo Store", "Gaming Hippo Store"],

      typeSpeed: 70,

      backSpeed: 50,

      backDelay: 1500,

      loop: true,

      smartBackspace: true,

      showCursor: false,

      startDelay: 0, // Start immediately
    });

    return () => storeLoopInstance.destroy();
  }, [loopStarted]);

  return (
    <div className="app page-wrapper">
      <Navbar />

      <main className="content-wrapper">
        <div className="heading-box enhanced-heading-box">
          <h1 className="heading enhanced-heading">
            <span className="sparkle-text glitch-text">
              {!loopStarted ? (
                <span ref={fullTypedRef}></span>
              ) : (
                <>
                  Welcome to <span ref={storeTypedRef}></span>
                </>
              )}
            </span>

            <img src={logo} alt="Hippo Icon" className="heading-icon" />
          </h1>
        </div>

        <GameList />
      </main>
    </div>
  );
}

export default App;
