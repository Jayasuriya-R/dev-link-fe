import React from "react";
import { Link } from "react-router-dom";

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
        <ul className="menu bg-base-300 min-h-full w-50 p-4">
          {/* Sidebar content here */}
          <li>
            <Link to="/feed">Home</Link>
          </li>
          <li>
            <Link>Settings</Link>
          </li>
        </ul>
        
      </div>
    </div>
  );
};

export default Sidebar;
