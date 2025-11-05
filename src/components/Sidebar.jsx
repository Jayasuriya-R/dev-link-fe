import React from "react";
import { Link } from "react-router-dom";
import { Home, User, Users, UserPlus,Newspaper } from "lucide-react";




const Sidebar = () => {
  return (
    <div className="drawer">
      <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-1"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-300 min-h-full w-48 p-4 text-base rounded-box shadow-md">
          <li>
            <Link
              to="/feed"
              className="flex items-center gap-3 hover:bg-base-200 rounded-lg p-2"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3 hover:bg-base-200 rounded-lg p-2"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/connections"
              className="flex items-center gap-3 hover:bg-base-200 rounded-lg p-2"
            >
              <Users className="w-5 h-5" />
              Connections
            </Link>
          </li>
          <li>
            <Link
              to="/requests"
              className="flex items-center gap-3 hover:bg-base-200 rounded-lg p-2"
            >
              <UserPlus className="w-5 h-5" />
              Requests
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className="flex items-center gap-3 hover:bg-base-200 rounded-lg p-2"
            >
              <Newspaper className="w-5 h-5" />
              Tech News
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
