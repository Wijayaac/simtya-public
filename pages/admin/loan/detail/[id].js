import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";

// utils auth library
import { HandleAdminSSR } from "../../../../utils/auth";

// import placeholder loading
import ArticlePlaceholder from "../../../../components/Skeleton/ArticlePlaceholder";

// import layout admin
import Admin from "../../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  const { id } = ctx.query;
  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/loanlist/${id}`,
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
    },
  };
}

export default function LoanDetail(props) {
  const { loan } = props;

  const customTheme = {
    yearColor: "#405b73",
    lineColor: "#d0cdc4",
    dotColor: "#262626",
    borderDotColor: "#d0cdc4",
    titleColor: "#405b73",
    subtitleColor: "#bf9765",
    textColor: "#262626",
  };

  const handleBack = () => {
    router.push("/admin/loan");
  };
  return (
    <>
      <div className="container row row-cols-md-2">
        <div className="col-6">
          <div className="d-flex flex-row justify-content-between mt-3">
            <p className="fs-3 fw-bold">Details Loan</p>
            <button className="btn btn-info">
              <i className="bi bi-arrow-left-circle"></i> Back to Loan
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
                  defaultValue={loan[0].start_km}
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
                  defaultValue={loan[0].end_km}
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
                defaultValue={loan[0].name}
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
                defaultValue={loan[0].purpose}
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
                defaultValue={moment(loan[0].start_at).format("YYYY-MM-DD")}
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
                defaultValue={moment(loan[0].end_at).format("YYYY-MM-DD")}
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
                defaultValue={loan[0].description}
                name="description"
                type="file"
                className="form-control"
                id="inputPhoto"></textarea>
            </div>
          </form>
        </div>
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
                <li className="event" data-date="12:30 - 1:00pm">
                  <h3>Registration</h3>
                  <p>
                    Get here on time, its first come first serve. Be late, get
                    turned away.
                  </p>
                </li>
                <li className="event" data-date="2:30 - 4:00pm">
                  <h3>Opening Ceremony</h3>
                  <p>
                    Get ready for an exciting event, this will kick off in
                    amazing fashion with MOP &amp; Busta Rhymes as an opening
                    show.
                  </p>
                </li>
                <li className="event" data-date="5:00 - 8:00pm">
                  <h3>Main Event</h3>
                  <p>
                    This is where it all goes down. You will compete head to
                    head with your friends and rivals. Get ready!
                  </p>
                </li>
                <li className="event" data-date="8:30 - 9:30pm">
                  <h3>Closing Ceremony</h3>
                  <p>
                    See how is the victor and who are the losers. The big stage
                    is where the winners bask in their own glory.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

LoanDetail.layout = Admin;
