import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoldSand from "./pages/GoldSand";
import Admin from "./pages/Admin";
import Layout from "./pages/Layout";
import Ranking from "./pages/Ranking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GoldSand />} />
          <Route path="admin" element={<Admin />} />
          <Route path="ranking" element={<Ranking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
