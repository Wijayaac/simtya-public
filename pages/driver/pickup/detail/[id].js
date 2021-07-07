import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";
import { ButtonGroup, Button } from "reactstrap";

// utils auth library
import { HandleDriverSSR } from "../../../../utils/auth";

// import loading placeholder
import ArticlePlaceholder from "../../../../components/Skeleton/ArticlePlaceholder";

// layout for Admin
import Admin from "../../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);

  const { id } = ctx.query;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/driver/pickuphistory/${id}`;
  const pickup = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });

  return {
    props: {
      token: token,
      pickup: pickup.data,
    },
  };
}

export default function PickupDriverEdit(props) {
  const { pickup } = props.pickup;
  const { history } = props.pickup;
  const { token } = props;

  const id = pickup[0].id;
  const name = pickup[0].name;
  const route = pickup[0].route;
  const start = pickup[0].start;

  const [description, setDescription] = useState(pickup[0].description);
  const [startKm, setStartKm] = useState(pickup[0].start_km);
  const [endKm, setEndKm] = useState(pickup[0].end_km);
  const [ready, setReady] = useState(pickup[0].ready);
  const [accidents, setAccidents] = useState(pickup[0].accidents);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/driver/pickup`;
    axios
      .put(
        url,
        {
          id: id,
          description: description,
          start_km: startKm,
          end_km: endKm,
          ready: ready,
          accidents: accidents,
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
        router.push("/driver/pickup");
      })
      .catch((error) => console.log("Error updating pickup schedule", error));
  };
  const handleBack = () => {
    router.push("/driver/pickup");
  };
  return (
    <>
      <div className="container row row-cols-md-2">
        {isLoading && (
          <div className="col-6">
            <ArticlePlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col-6">
            <div className="d-flex flex-row justify-content-between mt-3">
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
                  disabled
                  className="form-select"
                  aria-label="select vehicle">
                  <option>{name}</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label d-block">Accidents</label>
                <ButtonGroup>
                  <Button
                    color="outline-success"
                    onClick={() => setAccidents(true)}
                    active={accidents}>
                    Yes
                  </Button>
                  <Button
                    color="outline-danger"
                    onClick={() => setAccidents(false)}
                    active={!accidents}>
                    No
                  </Button>
                </ButtonGroup>
                <p>
                  {accidents === true
                    ? "Add your accidents into description bellow"
                    : ""}
                </p>
                <label htmlFor="inputDescription" className="form-label">
                  Description
                </label>
                <textarea
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  id="inputDescription"
                  placeholder="Add if you have accidents"></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="inputSchedule" className="form-label">
                  Ready for Pickup ?
                </label>
                <Button
                  block
                  className="d-block mb-2"
                  color="outline-info"
                  onClick={() => setReady(true)}
                  active={ready}>
                  Ready
                </Button>
                <label htmlFor="inputSchedule" className="form-label">
                  Vehicle Details
                </label>
                <div className="row row-cols-md-2">
                  <div className="col">
                    <label
                      htmlFor="inputSchedule"
                      className="form-label d-block">
                      Start Kilometers
                    </label>
                    <input
                      defaultValue={startKm}
                      type="number"
                      onChange={(e) => setStartKm(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label
                      htmlFor="inputSchedule"
                      className="form-label d-block">
                      End Kilometers
                    </label>
                    <input
                      defaultValue={endKm}
                      type="number"
                      onChange={(e) => setEndKm(e.target.value)}
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
                  {!isLoading && <span>Save</span>}
                </button>
                <button type="reset" className="btn btn-outline-dark mx-2">
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="col-6">
          <div className="d-flex flex-row justify-content-center mt-3">
            <p className="fs-3 fw-bold">
              <i className="bi bi-clock-history me-5"></i>History
            </p>
          </div>
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
                  <h3 className={ready ? "text-success" : "text-warning"}>
                    {ready ? "Ready" : "Pending"}
                  </h3>
                  <p>{route}</p>
                  <span className="text-muted">{description}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

PickupDriverEdit.layout = Admin;
