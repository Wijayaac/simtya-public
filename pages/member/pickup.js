import React, { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import moment from "moment";

// utils auth library
import { HandleMemberSSR } from "../../utils/auth";
import { parseJWT } from "../../utils/parseJWT";

// Components
import TableExample from "../../components/Tables/table";
import Modal from "../../components/Modals/modal";
// Layout
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/pickup`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return {
    props: {
      token: token,
      pickup: pickup.data.data,
    },
  };
}
export default function Pickup(props) {
  const { token } = props;
  const { pickup } = props;
  const [join, setJoin] = useState(null);
  const { sub } = parseJWT(token);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/member/joinpickup/${sub}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        let isJoin = data.active;
        setJoin(isJoin);
        let today = data.created_at;
        let isToday = moment(today).isSame(moment(), "day");
        setJoin(isToday);
      })
      .catch((error) => console.log("wait for join", error));
  }, [sub, token]);
  const handleJoin = (id) => {
    setJoin(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/member/pickup`,
        {
          pickup: id,
          user: sub,
          description: "Join Pickup schedule",
          active: true,
        },
        {
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        setJoin(false);
        console.log("Error join the pickup schedule", error);
      });
  };
  return (
    <>
      <div className="container px-5">
        <div className="text-center fs-3 fw-bold">
          <p>Pickup List</p>
        </div>
        <TableExample>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Pickup At</th>
              <th>End At</th>
              <th>Route</th>
              <th>Slots</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pickup.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{moment(item.start_at).format("DD MMMM ,HH:mm")}</td>
                  <td>{moment(item.end_at).format("HH:mm")}</td>
                  <td>{item.route}</td>
                  <td>{item.slot < 1 ? "Full" : item.slot}</td>
                  {item.slot < 1 ? (
                    <td>Wait pickup time</td>
                  ) : (
                    <td>
                      {join && "Wait pickup time"}
                      {!join && (
                        <button
                          className="btn btn-warning me-1"
                          onClick={handleJoin.bind(this, item.id)}>
                          <i className="bi bi-box-arrow-in-right"></i> Join
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </TableExample>
      </div>
    </>
  );
}
Pickup.layout = Admin;
