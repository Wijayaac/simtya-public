import React from "react";

// utils auth library
import { HandleDriverSSR } from "../../utils/auth";

// layouts
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);
  return {
    props: {
      token: token,
    },
  };
}
export default function Dashboard(props) {
  console.log(props);
  return (
    <>
      <div className="absolute top-0 bottom-0 d-flex flex-nowrap">
        <h1>Hello Driver</h1>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
