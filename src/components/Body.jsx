import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Body = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen space-y-2">
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
  )
}

export default Body
