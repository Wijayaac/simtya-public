import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";

import { Button, ButtonGroup } from "reactstrap";

//utils auth library
import { HandleMemberSSR } from "../../../../utils/auth";
// layout components
import Admin from "../../../../layouts/Admin";
// loading placeholder
import FormPlaceholder from "../../../../components/Skeleton/FormPlaceholder";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);
  const { id } = ctx.query;
  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/loan/${id}`,
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
export default function LoanEdit(props) {
  const { loan } = props;
  const { token } = props;

  const id = loan[0].id;
  const vehicle = loan[0].id_vehicle;
  const [purpose, setPurpose] = useState(loan[0].purpose);
  const [accidents, setAccidents] = useState(loan[0].accidents);
  const start = loan[0].start_at;
  const end = loan[0].end_at;
  const [description, setDescription] = useState(loan[0].description);
  const [startKm, setStartKm] = useState(loan[0].start_km);
  const [endKm, setEndKm] = useState(loan[0].end_km);
  const [isLoading, setLoading] = useState(true);
  const [isFinish, setFinish] = useState(loan[0].finish || false);
  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/member/loan`;
    axios
      .put(
        url,
        {
          id: id,
          purpose: purpose,
          accidents: accidents,
          description: description,
          start_km: startKm,
          end_km: endKm,
          finish: isFinish,
          vehicle: vehicle,
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
        router.push("/member/loan");
      })
      .catch((error) => console.log("Error updating loan schedule", error));
  };
  const handleBack = () => {
    router.push("/member/loan");
  };

  return (
    <>
      <div className="container row row-cols-sm-1 row-cols-md-2">
        {isLoading && (
          <div className="col">
            <FormPlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col">
            <div className="d-flex flex-row justify-content-between mt-3 my-2">
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
                <label forHtml="inputPurpose" className="form-label">
                  Purpose
                </label>
                <input
                  defaultValue={purpose}
                  onChange={(e) => {
                    setPurpose(e.target.value);
                  }}
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
                  defaultValue={moment(start).format("YYYY-MM-DD")}
                  type="date"
                  name="start_date"
                  className="form-control"
                  id="inputYears"
                  disabled
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputFinish" className="form-label">
                  Finish Date
                </label>
                <input
                  defaultValue={moment(end).format("YYYY-MM-DD")}
                  type="date"
                  name="end_date"
                  className="form-control"
                  id="inputFinish"
                  disabled
                />
              </div>
              <div className="mb-3">
                <div className="row row-cols-1 row-cols-md-2">
                  <div className="col">
                    <label className="form-label d-block">Accidents</label>
                    <ButtonGroup>
                      <Button
                        color="outline-success"
                        onClick={() => setAccidents(true)}
                        active={accidents === true}>
                        Yes
                      </Button>
                      <Button
                        color="outline-danger"
                        onClick={() => setAccidents(false)}
                        active={accidents === false}>
                        No
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div className="col">
                    <label className="form-label d-block">Finish Loan ?</label>
                    <ButtonGroup>
                      <Button
                        color="outline-info"
                        onClick={() => setFinish(true)}
                        active={isFinish}>
                        Finish
                      </Button>
                      <Button
                        color="outline-warning"
                        onClick={() => setFinish(false)}
                        active={!isFinish}>
                        Not Yet
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>

                <p className="my-2">
                  {accidents === true
                    ? "Add your accidents into description bellow"
                    : ""}
                </p>
                <label forHtml="inputDesc" className="form-label">
                  Description
                </label>
                <textarea
                  defaultValue={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  name="description"
                  disabled={!accidents}
                  className="form-control"
                  id="inputDesc"></textarea>
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

LoanEdit.layout = Admin;
