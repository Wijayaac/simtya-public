import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { saveAs } from "file-saver";

// utils auth library
import { HandleAdminSSR } from "../../utils/auth";
// Layout Component
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);

  const vehicles = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return {
    props: {
      token: token,
      vehicles: vehicles.data.rows,
    },
  };
}

export default function Dashboard(props) {
  const { vehicles } = props;
  const [isLoading, setLoading] = useState(true);
  let name = vehicles.map(({ type }) => type);
  let count = vehicles.map(({ count }) => count);
  const data = {
    labels: name,
    datasets: [
      {
        label: "# of Votes",
        data: count,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);

  const downloadPdf = (type) => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${type}-pdf`, {
        responseType: "blob",
      })
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, `${type}.pdf`);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="container w-50">
        <div className="header text-center">
          <h1 className="title">Pie Chart</h1>
        </div>
        <Pie data={data} />
      </div>
      <button
        className="btn btn-outline-primary btn-lg btn-block "
        onClick={downloadPdf.bind(this, "inventory")}
        disabled={isLoading}>
        Inventory PDF
      </button>
      <button
        className="btn btn-outline-danger btn-lg btn-block"
        onClick={downloadPdf.bind(this, "service")}
        disabled={isLoading}>
        Service PDF
      </button>
      <button
        className="btn btn-outline-warning btn-lg btn-block"
        onClick={downloadPdf.bind(this, "loan")}
        disabled={isLoading}>
        Loan PDF
      </button>
      <button
        className="btn btn-outline-success btn-lg btn-block"
        onClick={downloadPdf.bind(this, "pickup")}
        disabled={isLoading}>
        Pickup PDF
      </button>
      <h1>Hello Admin</h1>
    </>
  );
}

Dashboard.layout = Admin;
