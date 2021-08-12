import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";

// utils auth library
import { HandleAdminSSR } from "../../../../utils/auth";

// import loading placeholder
import HistoryPlaceholder from "../../../../components/Skeleton/HistoryPlaceholder";
import FormPlaceholder from "../../../../components/Skeleton/FormPlaceholder";

// layout for Admin
import Admin from "../../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);

  const { id } = ctx.query;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/pickuphistory/${id}`;
  const pickup = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/car`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return {
    props: {
      token: token,
      pickup: pickup.data,
      vehicle: vehicle.data.data,
    },
  };
}

export default function PickupEdit(props) {
  const { vehicle } = props;
  const { pickup } = props.pickup;
  const { history } = props.pickup;
  const { token } = props;
  const id = pickup[0].id;
  const [route, setRoute] = useState(pickup[0].route);
  const [start, setStart] = useState(pickup[0].start_at);
  const [end, setEnd] = useState(pickup[0].end_at);
  const [select, setSelect] = useState(pickup[0].name);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/pickup`;
    axios
      .put(
        url,
        {
          id: id,
          route: route,
          start_at: start,
          end_at: end,
          id_vehicle: select,
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
        setLoading(false);
        router.push("/admin/pickup");
      })
      .catch((error) => console.log("Error updating pickup schedule", error));
  };
  const handleBack = () => {
    router.push("/admin/pickup");
  };
  return (
    <>
      <div className="container row row-cols-md-2">
        {isLoading && (
          <div className="col my-2">
            <FormPlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col my-2">
            <div className="d-flex flex-row justify-content-between mt-3 mb-5">
              <p className="fs-3 fw-bold">Edit Pickup Schedule</p>
              <button onClick={handleBack.bind(this)} className="btn btn-info">
                <i className="bi bi-arrow-left-circle"></i> Back to Pickup
              </button>
            </div>
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
                  <option value={pickup[0].id_vehicle}>
                    {select ? select : "Select one vehicle"}
                  </option>
                  {vehicle.map((item) => {
                    return (
                      <option
                        key={item.id}
                        className="text-capitalize"
                        value={item.id}>
                        {item.name !== select ? item.name : "---------"}
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
                  defaultValue={route}
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
                    <label
                      htmlFor="inputSchedule"
                      className="form-label d-block">
                      Start Time
                    </label>
                    <input
                      defaultValue={moment(start).format("YYYY-MM-DDTHH:mm")}
                      type="datetime-local"
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label
                      htmlFor="inputSchedule"
                      className="form-label d-block">
                      End Time
                    </label>
                    <input
                      defaultValue={moment(end).format("YYYY-MM-DDTHH:mm")}
                      type="datetime-local"
                      onChange={(e) => setEnd(e.target.value)}
                    />
                  </div>
                </div>
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
        <div className="col my-2">
          <div className="d-flex flex-row justify-content-center mt-3">
            <p className="fs-3 fw-bold">
              <i className="bi bi-clock-history me-5"></i>History
            </p>
          </div>
          {isLoading && (
            <div className="d-flex justify-content-center">
              <HistoryPlaceholder />
            </div>
          )}
          {!isLoading && (
            <div
              className="d-flex flex-row overflow-auto"
              style={{ height: "80vh" }}>
              <div id="content">
                <ul className="timeline ">
                  {history.map((item) => {
                    return (
                      <li
                        key={item.id}
                        className="event"
                        data-date={moment(item.created_at).format("H:mm a")}>
                        <p>{item.email}</p>
                        <span className="text-muted">{item.description}</span>
                      </li>
                    );
                  })}

                  <li
                    className="event"
                    data-date={moment(start).format("H:mm a")}>
                    <h3
                      className={
                        pickup[0].ready ? "text-success" : "text-warning"
                      }>
                      {pickup[0].ready ? "Ready" : "Pending"}
                    </h3>
                    <p>{route}</p>
                    <small className="text-muted">
                      NOTE: description of events that occur from this vehicle
                      loan, can be in the form of accidents, or incidents such
                      as damage that occurs. You can view the report here and
                      see in detail.
                    </small>
                    <br />
                    <span className="text-muted">{pickup[0].description}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

PickupEdit.layout = Admin;
