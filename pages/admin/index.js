import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import moment from "moment";

// utils auth library
import { HandleAdminSSR } from "../../utils/auth";
// Layout Component
import Admin from "../../layouts/Admin";
import { months } from "moment";

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
  const [inventoryMonth, setInventoryMonth] = useState("");
  const [loanMonth, setLoanMonth] = useState("");
  const [pickupMonth, setPickupMonth] = useState("");
  const [serviceMonth, setServiceMonth] = useState("");

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

  const downloadPdf = (type, month) => {
    if (!month) return alert("Pick the month of the report");
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/${type}-pdf/${month}`, {
        responseType: "blob",
      })
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, `${type}.pdf`);
        setLoading(false);
      });
  };
  const MONTHS = () => {
    const months = [];
    const monthStart = moment();
    const monthName = moment();
    const monthEnd = moment().subtract(11, "month");
    while (monthEnd.diff(monthStart, "months") <= 0) {
      months.push({
        id: monthStart.format("YYYY-MM"),
        month: monthName.format("MMMM"),
      });
      monthStart.subtract(1, "month");
      monthName.subtract(1, "month");
    }
    return months;
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
                <div className="row d-flex align-items-center">
                  <div className="col">
                    <h6 className="card-title">Month : </h6>
                  </div>
                  <div className="col">
                    <select
                      name="month"
                      id=""
                      className="form-select"
                      onChange={(e) => setInventoryMonth(e.target.value)}>
                      <option defaultValue>---------</option>
                      {MONTHS().map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <p className="card-text">
                  <Pie data={chartInventory} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-primary btn-block "
              onClick={downloadPdf.bind(this, "inventory", inventoryMonth)}
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
                <div className="row d-flex align-items-center">
                  <div className="col">
                    <h6 className="card-title">Month : </h6>
                  </div>
                  <div className="col">
                    <select
                      name="month"
                      id=""
                      className="form-select"
                      onChange={(e) => setPickupMonth(e.target.value)}>
                      <option defaultValue>---------</option>
                      {MONTHS().map((item) => {
                        return (
                          <option key={item.id} defaultValue={item.id}>
                            {item.month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <p className="card-text">
                  <Bar data={chartPickup} options={options} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-success btn-block"
              onClick={downloadPdf.bind(this, "pickup", pickupMonth)}
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
                <div className="row d-flex align-items-center">
                  <div className="col">
                    <h6 className="card-title">Month : </h6>
                  </div>
                  <div className="col">
                    <select
                      name="month"
                      id=""
                      className="form-select"
                      onChange={(e) => setLoanMonth(e.target.value)}>
                      <option defaultValue>---------</option>
                      {MONTHS().map((item) => {
                        return (
                          <option key={item.id} defaultValue={item.id}>
                            {item.month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <p className="card-text">
                  <Bar data={chartLoan} options={options} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-warning btn-block"
              onClick={downloadPdf.bind(this, "loan", loanMonth)}
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
                <div className="row d-flex align-items-center">
                  <div className="col">
                    <h6 className="card-title">Month : </h6>
                  </div>
                  <div className="col">
                    <select
                      name="month"
                      id=""
                      className="form-select"
                      onChange={(e) => setServiceMonth(e.target.value)}>
                      <option defaultValue>---------</option>
                      {MONTHS().map((item) => {
                        return (
                          <option key={item.id} defaultValue={item.id}>
                            {item.month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <p className="card-text">
                  <Pie data={chartService} />
                </p>
              </div>
            </div>
            <button
              className="btn btn-outline-danger btn-block"
              onClick={downloadPdf.bind(this, "service", serviceMonth)}
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
