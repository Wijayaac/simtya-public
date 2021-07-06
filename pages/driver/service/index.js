import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";

// utils auth library
import { HandleDriverSSR } from "../../../utils/auth";

// Components UI
import Modal from "../../../components/Modals/modal";
import TableExample from "../../../components/Tables/table";
import FadeIn from "react-fade-in/lib/FadeIn";
import ArticlePlaceholder from "../../../components/Skeleton/ArticlePlaceholder";
// Layout Component
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);

  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/motorcycle`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/driver/service`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return {
    props: {
      token: token,
      service: service.data.data,
      vehicle: vehicle.data.data,
    },
  };
}

export default function Service(props) {
  const { token } = props;
  const { vehicle } = props;
  const { service } = props;
  const [isLoading, setLoading] = useState(true);
  const [select, setSelect] = useState([]);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [description, setDescription] = useState([]);
  const [type, setType] = useState([]);

  let id = vehicle.map(({ id }) => id);
  let name = vehicle.map(({ name }) => name);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleDetail = (id) => {
    router.push(`/driver/service/detail/${id}`);
  };
  const handleDelete = (id) => {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/driver/service/${id}`;
    axios
      .delete(url, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: token,
        },
      })
      .then(() => {
        setLoading(false);
        router.reload();
      })
      .catch((error) => console.log("Error deleting data", error));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/driver/service`;
    axios
      .post(
        url,
        {
          vehicle: select,
          start_at: start,
          end_at: end,
          type: type,
          description: description,
        },
        {
          headers: {
            Accept: "application/json",
            "Access-Controll-Allow-Origin": "*",
            Authorization: token,
          },
        }
      )
      .then(() => {
        setLoading(false);
        router.reload();
      })
      .catch((error) => console.log("Error inserting service schedule", error));
  };
  return (
    <>
      <div className="container">
        <div className="text-center fs-2 fw-bold">
          <p>Service List</p>
        </div>
        <Modal buttonLabel="Add Service" className="my-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label forHtml="inputName" className="form-label">
                Motorcycle
              </label>
              <select
                onChange={(e) => setSelect(e.target.value)}
                name="id_vehicle"
                id=""
                className="form-select">
                <option selected>Select Motorcycle</option>
                {vehicle.map((item) => {
                  return (
                    <option
                      className="text-capitalize"
                      key={item.id}
                      value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <label forHtml="inputYears" className="form-label">
                Start Date
              </label>
              <input
                onChange={(e) => setStart(e.target.value)}
                type="date"
                name="start_date"
                className="form-control"
                id="inputYears"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputYears" className="form-label">
                Finish Date
              </label>
              <input
                onChange={(e) => setEnd(e.target.value)}
                type="date"
                name="end_date"
                className="form-control"
                id="inputYears"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputType" className="form-label">
                Type of Service
              </label>
              <input
                onChange={(e) => setType(e.target.value)}
                id="inputType"
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputDescription" className="form-label">
                Description
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                name="description"
                className="form-control"
                id="inputDescription"></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary mx-2">
                Submit
              </button>
              <button type="reset" className="btn btn-outline-dark mx-2">
                Clear
              </button>
            </div>
          </form>
        </Modal>
        <div className="container mt-5">
          {isLoading && (
            <FadeIn>
              <ArticlePlaceholder />
            </FadeIn>
          )}
          {!isLoading && (
            <TableExample>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Service At</th>
                  <th>End At</th>
                  <th>Type</th>
                  {/* <th>Status</th> */}
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {service.map((item) => {
                  console.log(item.id_vehicle);
                  return (
                    <tr key={item.id}>
                      <td>{item.id_vehicle === id[0] ? name[0] : "kosong"}</td>
                      <td>
                        {moment
                          .utc(item.start_at)
                          .local()
                          .format("DD MMMM ,YYYY")}
                      </td>
                      <td>
                        {moment.utc(item.end_at).local().format("DD MMMM")}
                      </td>
                      <td>{item.type}</td>
                      {/* <td>{item.ready === false ? "Pending" : "Ready"}</td> */}
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
          )}
        </div>
      </div>
    </>
  );
}

Service.layout = Admin;
