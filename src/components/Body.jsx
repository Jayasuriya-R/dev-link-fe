import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-base-100 shadow-sm flex-shrink-0">
        <Navbar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex-shrink-0">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-center items-start">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="bg-base-100 flex-shrink-0">
        <Footer />
      </footer>
    </div>
  );
};

export default Body;
