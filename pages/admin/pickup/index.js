import React, { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import Image from "next/image";
import moment from "moment";

import FadeIn from "react-fade-in/lib/FadeIn";
import { HandleAdminSSR } from "../../../utils/auth";

// Components
import TableExample from "../../../components/Tables/table";
import Modal from "../../../components/Modals/modal";
// Layout
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/car`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/pickup`,
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
      vehicle: vehicle.data.data,
    },
  };
}
export default function Pickup(props) {
  const { token } = props;
  const { vehicle } = props;
  const { pickup } = props;
  const [data, setData] = useState(vehicle);
  const [isLoading, setLoading] = useState(true);
  const [select, setSelect] = useState([]);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [route, setRoute] = useState([]);
  const [description, setDescription] = useState([]);

  useEffect(() => {
    console.log(pickup);
    setLoading(false);
  }, [pickup]);

  const handleDetail = (id) => {
    router.push(`/admin/pickup/detail/${id}`);
  };
  const handleDelete = (id) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/pickup/${id}`;
    axios
      .delete(url, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: token,
        },
      })
      .then(() => router.reload())
      .catch((err) => console.log(err));
  };
  const handleSubmit = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/pickup`;
    axios
      .post(
        url,
        {
          route: route,
          start_at: start,
          vehicle: select,
          end_at: end,
          description: description,
        },
        {
          headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((error) => console.log(error));
  };
  let name = vehicle.map(({ name }) => name);
  let id = vehicle.map(({ id }) => id);
  return (
    <>
      <div className="container px-5">
        <div className="text-center fs-3 fw-bold">
          <p>Pickup List</p>
        </div>
        <Modal className="my-2" size="lg" buttonLabel="Add Pickup Schedule">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="selectVehicle" className="form-label">
                Vehicle
              </label>
              <select
                id="selectVehicle"
                onChange={(e) => {
                  setSelect(e.target.value);
                }}
                className="form-select"
                aria-label="select vehicle">
                <option selected>Select one vehicle</option>
                {data.map((item) => {
                  return (
                    <option
                      key={item.id}
                      className="text-capitalize"
                      value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="inputRoute" className="form-label">
                Route
              </label>
              <input
                onChange={(e) => setRoute(e.target.value)}
                type="text"
                className="form-control"
                id="inputRoute"
                placeholder="Pickup at PNB"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputSchedule" className="form-label">
                Pickup Schedule
              </label>
              <div className="row row-cols-md-2">
                <div className="col">
                  <label htmlFor="inputSchedule" className="form-label d-block">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="inputSchedule" className="form-label d-block">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="inputDescription" className="form-label">
                Decription
              </label>
              <textarea
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="form-control"
                id="inputDescription"
                placeholder="any notes for the driver"></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}>
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"></span>
                )}
                {!isLoading && <span>Submit</span>}
              </button>
              <button type="reset" className="btn btn-outline-dark mx-2">
                Clear
              </button>
            </div>
          </form>
        </Modal>

        <div className="container mt-5">
          <TableExample>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Pickup At</th>
                <th>End At</th>
                <th>Route</th>
                <th>Status</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pickup.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id_vehicle === id[0] ? name[0] : "kosong"}</td>
                    <td>{moment(item.start_at).format("DD MMMM ,HH:mm")}</td>
                    <td>{moment(item.end_at).format("HH:mm")}</td>
                    <td>{item.route}</td>
                    <td>{item.ready === false ? "Pending" : "Ready"}</td>
                    <td>{item.description}</td>
                    <td>
                      <button
                        className="btn btn-warning me-1"
                        onClick={handleDetail.bind(this, item.id)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-danger ms-1"
                        onClick={handleDelete.bind(this, item.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableExample>
        </div>
      </div>
    </>
  );
}
Pickup.layout = Admin;
