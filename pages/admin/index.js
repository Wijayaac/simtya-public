import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
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
  const inventory = {
    labels: name,
    datasets: [
      {
        label: "# of Votes",
        data: count,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const loan = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
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

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
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
      <div className="container">
        <div className="row">
          <div className="col-3">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-primary">
                Inventory
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={inventory} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-primary btn-block "
              onClick={downloadPdf.bind(this, "inventory")}
              disabled={isLoading}>
              Download Inventory Report
            </button>
          </div>
          <div className="col-3">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-success">
                Pickup
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Bar data={inventory} options={options} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-success btn-block"
              onClick={downloadPdf.bind(this, "pickup")}
              disabled={isLoading}>
              Download Pickup Report
            </button>
          </div>
          <div className="col-3">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-warning">
                Loan
              </div>
              <div className="card-body rounded bg-body">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Bar data={inventory} options={options} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-warning btn-block"
              onClick={downloadPdf.bind(this, "loan")}
              disabled={isLoading}>
              Download Loan Report
            </button>
          </div>
          <div className="col-3">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-danger">
                Service
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={inventory} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-danger btn-block"
              onClick={downloadPdf.bind(this, "service")}
              disabled={isLoading}>
              Download Service Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
