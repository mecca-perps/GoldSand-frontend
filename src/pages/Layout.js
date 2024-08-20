import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "../App.css";

const Layout = () => {
  return (
    <>
      <div className="main_container">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              padding: "16px 25px",
            },
          }}
          containerStyle={{
            top: 20,
            left: 20,
            bottom: 40,
            right: 30,
          }}
        />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
