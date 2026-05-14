import React from "react";
import blockImg from "../assets/minecraft-block.png"

const Header = () => (
  <header className="mc-header">
    <img
      src={blockImg}
      className="logo"
      alt="Minecraft block"
    />
    <h1 className="title">MCSR Ranked Analyzer</h1>
  </header>
);

export default Header;