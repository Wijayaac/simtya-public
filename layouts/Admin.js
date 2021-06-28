import React from "react";

// components

import Sidebar from "../components/Sidebars/sidebar";
import Navbar from "../components/Navbars/navbar";

const Admin = ({ children }) => {
  return (
    <>
      <div className="d-flex" id="wrapper">
        <Sidebar />
        {/* Header */}
        <div id="page-content-wrapper">
          <Navbar />
          {/* <!-- Begin Cointent Wrapper --> */}
          <div className="container-fluid">{children}</div>
          {/* <!-- End Content Wrapper --> */}
        </div>
      </div>
    </>
  );
};
export default Admin;
