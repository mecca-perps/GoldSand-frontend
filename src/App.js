import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoldSand from "./pages/GoldSand";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoldSand />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
