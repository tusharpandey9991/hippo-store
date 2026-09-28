import React from "react";
import { Routes, Route } from "react-router-dom";
import GameList from "./components/GameList";
import ThankYouPage from "./components/ThankYouPage";

function MainRoutes() {
  return (  
    <Routes>
      <Route path="/" element={<GameList />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
}

export default MainRoutes;
