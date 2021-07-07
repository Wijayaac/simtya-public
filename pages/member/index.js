import React from "react";

// utils auth library
import { HandleMemberSSR } from "../../utils/auth";

// components
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);
  return {
    props: {
      token: token,
    },
  };
}
export default function Dashboard(props) {
  return (
    <>
      <div className="absolute top-0 bottom-0 d-flex flex-nowrap">
        <h1>Helo</h1>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
