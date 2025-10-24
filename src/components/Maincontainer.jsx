import Navbar from "./Navbar";

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Maincontainer = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="bg-base-100">
        <Navbar />
      </div>
      <div >
        <Sidebar />
        <main className="flex justify-center items-center">
          <Outlet />
        </main>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Maincontainer;
