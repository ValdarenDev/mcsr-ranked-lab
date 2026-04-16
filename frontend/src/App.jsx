import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ComparePage from "./pages/ComparePage";
import ProfilePage from "./pages/ProfilePage";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/profile/:ign" element={<ProfilePage />} />
        <Route path="/faq" element={<FAQ />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;