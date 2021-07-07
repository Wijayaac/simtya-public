import React from "react";
import axios from "axios";
import router from "next/router";
import moment from "moment";

// utils auth library
import { HandleDriverSSR } from "../../../utils/auth";

// Components
import TableExample from "../../../components/Tables/table";
import Modal from "../../../components/Modals/modal";
// Layout
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/driver/pickup`,
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

  const handleUpdate = (id) => {
    router.push(`/driver/pickup/detail/${id}`);
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
              <th>Status</th>
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
                  <td>{item.ready === false ? "Pending" : "Ready"}</td>
                  <td>
                    <button
                      className="btn btn-warning me-1"
                      onClick={handleUpdate.bind(this, item.id)}>
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
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
