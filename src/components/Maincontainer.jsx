import React from 'react'
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Maincontainer = () => {
    const [showSideBar, setshowSideBar] = useState(false);
  return (
    <div>
        <Navbar setshowSideBar={setshowSideBar} showSideBar={showSideBar} />
        {showSideBar && <Sidebar />}
        <Outlet/>
      </div>
  )
}

export default Maincontainer
