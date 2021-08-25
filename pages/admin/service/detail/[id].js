import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";

// utils auth library
import { HandleAdminSSR } from "../../../../utils/auth";

// import placeholder loading
import FormPlaceholder from "../../../../components/Skeleton/FormPlaceholder";
import HistoryPlaceholder from "../../../../components/Skeleton/HistoryPlaceholder";

// import layout admin
import Admin from "../../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  const { id } = ctx.query;
  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/service-detail/${id}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const history = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/servicehistory/${id}`,
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
      history: history.data.history,
    },
  };
}

export default function ServiceDetail(props) {
  const { service } = props;
  const { history } = props;
  console.log(service);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);

  const handleBack = () => {
    router.push("/admin/service");
  };
  return (
    <>
      <div className="container row row-cols-md-2">
        {isLoading && (
          <div className="col">
            <FormPlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col">
            <div className="d-flex flex-row justify-content-between my-2 mt-3">
              <p className="fs-3 fw-bold">Details Service</p>
              <button onClick={() => handleBack()} className="btn btn-info">
                <i className="bi bi-arrow-left-circle"></i> Back to Service
              </button>
            </div>
            <form>
              <div className="mb-3 row row-cols-md-2">
                <div className="col">
                  <label htmlFor="inputStartKm" className="form-label">
                    Start Kilometer
                  </label>
                  <input
                    disabled
                    defaultValue={service[0].start_km}
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
                    disabled
                    defaultValue={service[0].end_km}
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
                <input
                  disabled
                  defaultValue={service[0].name}
                  type="text"
                  name="purpose"
                  className="form-control"
                  id="inputPurpose"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputPurpose" className="form-label">
                  Purpose
                </label>
                <input
                  disabled
                  defaultValue={service[0].type}
                  type="text"
                  name="purpose"
                  className="form-control"
                  id="inputPurpose"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputYears" className="form-label">
                  Start Date
                </label>
                <input
                  disabled
                  defaultValue={moment(service[0].start_at).format(
                    "YYYY-MM-DD"
                  )}
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
                  disabled
                  defaultValue={moment(service[0].end_at).format("YYYY-MM-DD")}
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
                  disabled
                  defaultValue={service[0].description}
                  name="description"
                  type="file"
                  className="form-control"
                  id="inputPhoto"></textarea>
              </div>
            </form>
          </div>
        )}
        <div className="col">
          <div className="d-flex d-flex-row justify-content-center mt-3">
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
                  <li
                    className="event"
                    data-date={moment(history.start_at).format("DD,MMM, YYYY")}>
                    <h3>{history.purpose}</h3>
                    <p>
                      Person :
                      {history.username ? history.username : history.email}
                      <br />
                      <br />
                      <span>
                        Kilometers: {history.start_km} - {history.end_km}
                      </span>
                      <br />
                      <br />
                      <span>
                        Ends_at:{" "}
                        {moment(history.end_at).format("DD MMM,YY H:mm A")}
                      </span>
                      <br />
                      <br />
                      Info :
                      {history.accidents
                        ? "(accidents)" + history.description
                        : history.description}
                      <br />
                      <small className="text-muted">
                        NOTE: description of events that occur from this vehicle
                        loan, can be in the form of accidents, or incidents such
                        as damage that occurs. You can view the report here and
                        see in detail.
                      </small>
                    </p>
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

ServiceDetail.layout = Admin;
