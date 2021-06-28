import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// components
import Admin from "../../layouts/Admin";

export default function Dashboard() {
  return (
    <>
      <div className="absolute top-0 bottom-0 d-flex flex-nowrap">
        <h1>Helo</h1>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
