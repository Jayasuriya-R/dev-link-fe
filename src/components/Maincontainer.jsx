import Navbar from "./Navbar";

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useEffect } from "react";
import { addCurrentUser } from "../Store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_URL } from "../utils/constants";

const Maincontainer = () => {
  const disptach = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    fetchCurrentUser();
  },[]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(Base_URL + "/profile/view", {
        withCredentials: true,
      });
      disptach(addCurrentUser(response.data.data));
      navigate("/feed");
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="bg-base-100">
        <Navbar />
      </div>
      <div>
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
