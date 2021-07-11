import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";

// utils auth library
import { HandleDriverSSR } from "../../../../utils/auth";
// import layout components
import Admin from "../../../../layouts/Admin";
// loading placeholder
import FormPlaceholder from "../../../../components/Skeleton/FormPlaceholder";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);
  const { id } = ctx.query;
  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/motorcycle`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/driver/servicedetail/${id}`,
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
export default function ServiceEdit(props) {
  const { token } = props;
  const { vehicle } = props;
  const { service } = props;

  const [id, setId] = useState(service[0].id);
  const [select, setSelect] = useState(service[0].id_vehicle);
  const [start, setStart] = useState(service[0].start_at);
  const [end, setEnd] = useState(service[0].end_at);
  const [startKm, setStartKm] = useState(service[0].start_km);
  const [endKm, setEndKm] = useState(service[0].end_km);
  const [type, setType] = useState(service[0].type);
  const [description, setDescription] = useState(service[0].description);
  const [isLoading, setLoading] = useState(true);

  let id_vehicle = vehicle.map(({ id }) => id);
  let name = vehicle.map(({ name }) => name);

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, [select]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/driver/service`;
    axios
      .put(
        url,
        {
          id: id,
          type: type,
          start_at: start,
          end_at: end,
          description: description,
          vehicle: select,
          start_km: startKm,
          end_km: endKm,
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
        setLoading(false);
        router.push("/driver/service");
      })
      .catch((error) => console.log("Error updating service schedule", error));
  };
  const handleBack = () => {
    router.push("/driver/service");
  };
  return (
    <>
      <div className="container row row-cols-md-2">
        {isLoading && (
          <div className="col-6">
            <FormPlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col-6">
            <div className="d-flex flex-row justify-content-between mt-3">
              <p className="fs-3 fw-bold">Edit Loan Schedule</p>
              <button onClick={handleBack.bind(this)} className="btn btn-info">
                <i className="bi bi-arrow-left-circle"></i> Back to Loan
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 row row-cols-md-2">
                <div className="col">
                  <label htmlFor="inputStartKm" className="form-label">
                    Start Kilometer
                  </label>
                  <input
                    defaultValue={startKm}
                    onChange={(e) => {
                      setStartKm(e.target.value);
                    }}
                    type="number"
                    name="startKm"
                    className="form-control"
                    id="inputStartKm"
                  />
                </div>
                <div className="col">
                  <label htmlFor="inputEndKm" className="form-label">
                    End Kilometer
                  </label>
                  <input
                    defaultValue={endKm}
                    onChange={(e) => {
                      setEndKm(e.target.value);
                    }}
                    type="number"
                    name="endKm"
                    className="form-control"
                    id="inputEndKm"
                  />
                </div>
              </div>
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
                  aria-label="select vehicle"
                  defaultValue={
                    select === id_vehicle[0] ? name[0] : "Select one Vehicle"
                  }>
                  {vehicle.map((item) => {
                    console.log(select);
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
                <label forHtml="inputType" className="form-label">
                  Purpose
                </label>
                <input
                  defaultValue={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  type="text"
                  name="purpose"
                  className="form-control"
                  id="inputType"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputYears" className="form-label">
                  Start Date
                </label>
                <input
                  defaultValue={moment(start).format("YYYY-MM-DD")}
                  onChange={(e) => {
                    setStart(e.target.value);
                  }}
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
                  defaultValue={moment(end).format("YYYY-MM-DD")}
                  onChange={(e) => {
                    setEnd(e.target.value);
                  }}
                  type="date"
                  name="end_date"
                  className="form-control"
                  id="inputYears"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputPhoto" className="form-label">
                  Description
                </label>
                <textarea
                  defaultValue={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  name="description"
                  type="file"
                  className="form-control"
                  id="inputPhoto"></textarea>
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
          </div>
        )}
      </div>
    </>
  );
}
ServiceEdit.layout = Admin;
