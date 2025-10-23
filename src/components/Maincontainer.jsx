import Navbar from "./Navbar";

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Maincontainer = () => {
  return (
    <div>
      <div className="bg-base-100">
        <Navbar />
      </div>

      <Sidebar />
      <div className="bg-base-300 min-h-full">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default Maincontainer;
