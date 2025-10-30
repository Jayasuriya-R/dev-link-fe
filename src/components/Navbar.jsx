import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axois from "axios";
import { Base_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { addCurrentUser } from "../Store/authSlice";
import { removeFeed } from "../Store/feedSlice";

const Navbar = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () =>{
    try{
     const response =  await axois.post(Base_URL + "/logout",{},{withCredentials:true});
    console.log("Logout successful:", response.data);
    dispatch(addCurrentUser(null));
    dispatch(removeFeed([]))
    navigate('/login')
    }catch(err){
      console.log("Logout error:", err);
    }
    
  }

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-none">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => {
            const drawerCheckbox = document.getElementById("my-drawer-1");
            if (drawerCheckbox)
              drawerCheckbox.checked = !drawerCheckbox.checked;
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>{" "}
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <Link to='/feed' className="btn btn-ghost text-xl">DevLink</Link>
      </div>
      <div className="flex items-center gap-4">
      <div className="md:text-xl sm:text-lg font-semibold">
          Welcome {currentUser?.firstName} 🙋‍♂️
        </div>
      <div className="dropdown dropdown-end mr-2">
        
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src={currentUser?.photoUrl}
            />
          </div>
        </div>
        <ul
          tabIndex="-1"
          className="menu menu-sm dropdown-content bg-primary font-bold rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li className="hover:bg-base-300 rounded-xl ">
            <Link to='/profile' className="justify-between">
              Profile
              
            </Link>
          </li>
          
          <li onClick={handleLogout} className="hover:bg-base-300 rounded-xl">
            <Link>Logout</Link>
          </li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
