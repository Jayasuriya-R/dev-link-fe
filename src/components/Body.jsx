import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-base-100 shadow-sm">
        <Navbar />
      </header>

      <div className="flex flex-1">
        <aside>
          <Sidebar />
        </aside>

        <main className="flex-1 flex justify-center items-start p-4">
          <Outlet />
        </main>
      </div>

      <footer className="bg-base-100 mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Body;
