import React from "react";
import Background from "./Background";
import Header from "./Header";

const Layout = ({ children }) => (
  <>
    <Background />
    <Header />
    <main className="content-box">{children}</main>
  </>
);

export default Layout;