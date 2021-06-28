import React from "react";

// layouts
import Admin from "../../layouts/Admin";

export default function Dashboard() {
  return (
    <>
      <div className="absolute top-0 bottom-0 d-flex flex-nowrap">
        <h1>Hello Driver</h1>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
