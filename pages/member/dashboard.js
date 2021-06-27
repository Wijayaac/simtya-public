import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// components
import Sidebar from "../../components/Sidebars/sidebar";

export default function Home() {
  return (
    <>
      <Sidebar />
      <h1>Helo</h1>
    </>
  );
}
