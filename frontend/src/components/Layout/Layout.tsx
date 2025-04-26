import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const RestaurantDashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RestaurantDashboardLayout;
