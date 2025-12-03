import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";


const Body = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* FIXED NAVBAR */}
      <header className="bg-base-100 shadow-sm ">
        <Navbar />
      </header>

      {/* Push content below navbar height (adjust if needed) */}
      <div className="flex flex-1 ">
        <aside className="flex-shrink-0 mt-4">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto ">
          <div className="flex justify-center items-start mt-2">
            <Outlet />
          </div>

          
        </main>
      </div>

      <footer className="bg-base-100">
        <Footer />
      </footer>
    </div>
  );
};

export default Body;
