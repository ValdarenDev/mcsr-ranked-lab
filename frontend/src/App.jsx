import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ComparePage from "./pages/ComparePage";
import ProfilePage from "./pages/ProfilePage";
import FAQ from "./pages/FAQ";
import ComparisonPage from "./pages/ComparisonPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/profile/:ign" element={<ProfilePage />} />
        <Route path="/faq" element={<FAQ />}/>
        <Route path="/comparison" element={<ComparisonPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;