import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";
import { Button, ButtonGroup } from "reactstrap";

// utils auth library
import { HandleDriverSSR } from "../../../../utils/auth";
// import layout components
import Admin from "../../../../layouts/Admin";
// loading placeholder
import FormPlaceholder from "../../../../components/Skeleton/FormPlaceholder";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);
  const { id } = ctx.query;
  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/driver/service-detail/${id}`,
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
    },
  };
}
export default function ServiceEdit(props) {
  const { token } = props;
  const { service } = props;

  const id = service[0].id;
  const select = service[0].id_vehicle;
  const start = service[0].start_at;
  const [end, setEnd] = useState(service[0].end_at);
  const [startKm, setStartKm] = useState(service[0].start_km);
  const [endKm, setEndKm] = useState(service[0].end_km);
  const [type, setType] = useState(service[0].type);
  const [description, setDescription] = useState(service[0].description);
  const [fee, setFee] = useState(service[0].service_fee);
  const [part, setPart] = useState(service[0].service_part);
  const [nowKm, setNowKm] = useState(service[0].now_km);
  const [isLoading, setLoading] = useState(true);
  const [isFinish, setFinish] = useState(true);

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);

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
          description: description,
          vehicle: select,
          start_km: startKm,
          end_km: endKm,
          fee: fee,
          part: part,
          finish: isFinish,
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
      <div className="container row row-cols-1 row-cols-md-2 ">
        {isLoading && (
          <div className="col">
            <FormPlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col">
            <div className="d-flex flex-row justify-content-between my-2 mt-3">
              <p className="fs-3 fw-bold">Edit Service Detail</p>
              <button onClick={handleBack.bind(this)} className="btn btn-info">
                <i className="bi bi-arrow-left-circle"></i> Back to Service
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 row row-cols-md-2">
                <div className="col">
                  <label htmlFor="inputStartKm" className="form-label">
                    Start Kilometer
                  </label>
                  <input
                    defaultValue={nowKm}
                    value={startKm}
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
                <label forhtml="inputType" className="form-label">
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
                <label forhtml="inputYears" className="form-label">
                  Start Date
                </label>
                <input
                  defaultValue={moment(start).format("YYYY-MM-DD")}
                  type="date"
                  disabled
                  name="start_date"
                  className="form-control"
                  id="inputYears"
                />
              </div>
              <div className="mb-3">
                <label forhtml="inputYears" className="form-label">
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
                <label className="form-label d-block">Finish Service ?</label>
                <ButtonGroup>
                  <Button
                    color="outline-success"
                    onClick={() => setFinish(true)}
                    active={isFinish}>
                    Yes
                  </Button>
                  <Button
                    color="outline-danger"
                    onClick={() => setFinish(false)}
                    active={!isFinish}>
                    No
                  </Button>
                </ButtonGroup>
                <p>{isFinish ? "Add your details into field bellow" : ""}</p>
              </div>
              {isFinish && (
                <div className="row">
                  <div className="mb-3 col">
                    <label forhtml="inputFee" className="form-label">
                      Service Fee
                    </label>
                    <input
                      defaultValue={fee}
                      onChange={(e) => {
                        setFee(e.target.value);
                      }}
                      type="number"
                      name="purpose"
                      className="form-control"
                      id="inputFee"
                    />
                  </div>
                  <div className="mb-3 col">
                    <label forhtml="inputPart" className="form-label">
                      Service Part
                    </label>
                    <input
                      defaultValue={part}
                      onChange={(e) => {
                        setPart(e.target.value);
                      }}
                      type="text"
                      name="purpose"
                      className="form-control"
                      id="inputPart"
                    />
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label forhtml="inputPhoto" className="form-label">
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
