import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../Users/Navbar';
import { useSelector } from 'react-redux';
import Footer from '../Users/Footer';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);

  // Redirect admin users to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;