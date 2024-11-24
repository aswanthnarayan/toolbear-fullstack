import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Admin/SideBar";
import { FiMenu, FiX } from "react-icons/fi";
import AdminNavbar from "../../components/Admin/AdminNavbar";

const AdminHomePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed top-16 left-0 h-screen w-64 shadow-2xl md:block hidden">
          <Sidebar setActiveSection={handleMenuClick} />
        </div>

        {/* Drawer Toggle */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="md:hidden absolute top-2 left-0 p-2 text-2xl text-black rounded z-50 "
        >
          <FiMenu />
        </button>

        {/* Drawer */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsDrawerOpen(false)}
          >
            <div
              className="fixed top-0 left-0 h-screen w-64 bg-white shadow-2xl p-4 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-2xl">
                  <FiX />
                </button>
              </div>
              <Sidebar setActiveSection={handleMenuClick} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`flex flex-col w-full h-admin-h overflow-y-auto ${isDrawerOpen ? 'hidden md:flex' : ''} ml-0 md:ml-64`}>
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHomePage;
