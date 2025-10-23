import React from "react";

const Navbar = ({ setshowSideBar, showSideBar }) => {
  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost" onClick={() => {
    const drawerCheckbox = document.getElementById("my-drawer-1");
    if (drawerCheckbox) drawerCheckbox.checked = !drawerCheckbox.checked;
  }}>
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
        <a className="btn btn-ghost text-xl">DevLink</a>
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtNOrllJdVu85SAsDUmuiEdivyIzrhQVuZaw&s"
            />
          </div>
        </div>
        <ul
          tabIndex="-1"
          className="menu menu-sm dropdown-content bg-primary rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
