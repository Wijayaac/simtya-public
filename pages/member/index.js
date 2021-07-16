import React from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

// utils auth library
import { HandleMemberSSR } from "../../utils/auth";

// components
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);

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
  return (
    <>
      <div className="container w-50 ">
        <div className="row">
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-primary">
                Loan
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={inventory} />
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
