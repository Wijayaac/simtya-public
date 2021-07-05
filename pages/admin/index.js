import React from "react";

// utils auth library
import { HandleAdminSSR } from "../../utils/auth";
// Layout Component
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  return {
    props: {
      token: token,
    },
  };
}
export default function Dashboard() {
  return (
    <>
      <h1>Hello Admin</h1>
    </>
  );
}

Dashboard.layout = Admin;
