import React from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
// utils auth library
import { HandleDriverSSR } from "../../utils/auth";

// layouts
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);
  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/chart/service`,
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
  return {
    props: {
      token: token,
      service: service.data.data.rows,
      pickup: pickup.data.data.rows,
    },
  };
}
export default function Dashboard(props) {
  const { service } = props;
  const { pickup } = props;

  let pickupName = pickup.map(({ name }) => name);
  let pickupCount = pickup.map(({ count }) => count);

  let serviceName = service.map(({ name }) => name);
  let serviceCount = service.map(({ total }) => total);

  const pickupChart = {
    labels: pickupName,
    datasets: [
      {
        label: "# of Votes",
        data: pickupCount,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const serviceChart = {
    labels: serviceName,
    datasets: [
      {
        label: "# of Votes",
        data: serviceCount,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <div className="container container-sm">
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-primary">
                Pickup
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={pickupChart} />
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-primary">
                Service
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={serviceChart} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = Admin;
