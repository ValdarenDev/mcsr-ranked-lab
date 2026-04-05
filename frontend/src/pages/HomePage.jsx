import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const HomePage = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const goToProfile = () => {
    if (!user.trim()) {
      alert("Enter a username");
      return;
    }
    navigate(`/profile?user=${encodeURIComponent(user.trim())}`);
  };

  return (
    <Layout>
      <h2>Search Player</h2>
      <input
        className="mc-input"
        placeholder="Enter username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <button className="mc-button" onClick={goToProfile}>
        Search
      </button>
    </Layout>
  );
};

export default HomePage;