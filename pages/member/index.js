import React from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

// utils auth library
import { HandleMemberSSR } from "../../utils/auth";
import { parseJWT } from "../../utils/parseJWT";
// components
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);
  const { sub } = parseJWT(token);
  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/chart/loan/${sub}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/chart/pickup/${sub}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return {
    props: {
      token: token,
      loan: loan.data.data,
      pickup: pickup.data.data,
    },
  };
}
export default function Dashboard(props) {
  const { loan } = props;
  const { pickup } = props;
  let loanName = loan.map(({ name }) => name);
  let loanCount = loan.map(({ count }) => count);
  let pickupName = pickup.map(({ name }) => name);
  let pickupCount = pickup.map(({ times }) => times);

  const loanChart = {
    labels: loanName,
    datasets: [
      {
        label: "# of Votes",
        data: loanCount,
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
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
  return (
    <>
      <div className="container container-sm">
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-primary">
                Loan Data
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={loanChart} />
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card mb-3 mt-3 shadow bg-body">
              <div className="card-header text-white fw-bold bg-primary">
                Pickup Data
              </div>
              <div className="card-body rounded bg-white">
                <h5 className="card-title">Report Chart</h5>
                <p className="card-text">
                  <Pie data={pickupChart} />
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
