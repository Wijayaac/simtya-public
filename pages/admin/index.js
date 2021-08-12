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

  const inventory = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/chart/inventory`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/chart/pickup`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/chart/loan`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/chart/service`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return {
    props: {
      token: token,
      inventory: inventory.data.data.rows,
      loan: loan.data.data.rows,
      pickup: pickup.data.data.rows,
      service: service.data.data.rows,
    },
  };
}

export default function Dashboard(props) {
  const { inventory } = props;
  const { loan } = props;
  const { pickup } = props;
  const { service } = props;
  const [isLoading, setLoading] = useState(true);

  let inventoryName = inventory.map(({ type }) => type);
  let inventoryCount = inventory.map(({ count }) => count);

  let loanName = loan.map(({ name }) => name);
  let loanCount = loan.map(({ count }) => count);

  let pickupName = pickup.map(({ name }) => name);
  let pickupCount = pickup.map(({ count }) => count);

  let serviceName = service.map(({ name }) => name);
  let serviceCount = service.map(({ total }) => total);

  const chartInventory = {
    labels: inventoryName,
    datasets: [
      {
        label: "# of Data",
        data: inventoryCount,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const chartLoan = {
    labels: loanName,
    datasets: [
      {
        label: "# of Data",
        data: loanCount,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const chartPickup = {
    labels: pickupName,
    datasets: [
      {
        label: "# of Data",
        data: pickupCount,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const chartService = {
    labels: serviceName,
    datasets: [
      {
        label: "# of Data",
        data: serviceCount,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
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
      <div className="container py-3">
        <div className="row row-cols-md-4 row-cols-sm-2">
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-primary">
                Inventory
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={chartInventory} />
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
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-success">
                Pickup
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Bar data={chartPickup} options={options} />
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
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-warning">
                Loan
              </div>
              <div className="card-body rounded bg-body">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Bar data={chartLoan} options={options} />
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
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-danger">
                Service
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={chartService} />
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
