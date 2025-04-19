import React from "react";
import { Outlet } from "react-router-dom";

// Removed Header from Layout since it's now global in App.tsx
const Layout: React.FC = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
