import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import router from "next/router";

import FadeIn from "react-fade-in/lib/FadeIn";
import { format } from "date-fns";
import {
  WeeklyCalendar,
  WeeklyBody,
  WeeklyDays,
  WeeklyContainer,
  WeeklyResponsiveContainer,
  DefaultWeeklyEventItem,
} from "@zach.codes/react-calendar";

// Components UI
import TableExample from "../../../components/Tables/table";
import Modal from "../../../components/Modals/modal";
import ArticlePlaceholder from "../../../components/Skeleton/ArticlePlaceholder";
// utils auth library
import { HandleMemberSSR } from "../../../utils/auth";
import { parseJWT } from "../../../utils/parseJWT";
// Layout Component
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);
  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/motorcycle`,
    { headers: { Authorization: token } }
  );

  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/loan/`,
    { headers: { Authorization: token } }
  );
  return {
    props: {
      token: token,
      loan: loan.data.data,
      vehicle: vehicle.data.data,
    },
  };
}
export default function Loan(props) {
  const { token } = props;
  const { sub } = parseJWT(token);
  const { vehicle } = props;
  const { loan } = props;
  const [select, setSelect] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [description, setDescription] = useState([]);
  const [isLoading, setLoading] = useState(true);

  let id = vehicle.map(({ id }) => id);
  let name = vehicle.map(({ name }) => name);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/member/loan`;
    axios
      .post(
        url,
        {
          vehicle: select,
          user: sub,
          purpose: purpose,
          start_at: start,
          end_at: end,
          description: description,
          accidents: false,
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
        router.reload();
      })
      .catch((error) => console.log("Error insert new loan", error));
  };
  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/member/loan/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        setLoading(false);
        router.reload();
      });
  };
  const handleDetail = (id) => {
    router.push(`/member/loan/detail/${id}`);
  };

  return (
    <>
      <div className="container">
        <div className="text-center fs-2 fw-bold">
          <p>Loan List</p>
          <div className="container"></div>
        </div>
        <Modal buttonLabel="Loan Motorcycle" className="my-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label forHtml="inputName" className="form-label">
                Motorcycle
              </label>
              <select
                name="id_vehicle"
                onChange={(e) => setSelect(e.target.value)}
                className="form-select">
                <option selected>Select one vehicle</option>
                {vehicle.map((item) => {
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
              <label forHtml="inputPurpose" className="form-label">
                Purpose
              </label>
              <input
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
              <label forHtml="inputDescription" className="form-label">
                Description
              </label>
              <textarea
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
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
        <div className="container mt-5 row row-cols-md-2">
          {isLoading && (
            <FadeIn>
              <ArticlePlaceholder />
            </FadeIn>
          )}
          {!isLoading && (
            <div className="my-2 col-6">
              <TableExample>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Purpose</th>
                    <th>Start At</th>
                    <th>End At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {item.id_vehicle === id[0] ? name[0] : "kosong"}
                        </td>
                        <td>{item.purpose}</td>
                        <td>{moment(item.start_at).format("DD MMMM")}</td>
                        <td>{moment(item.end_at).format("DD MMMM")}</td>
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
          )}
          <div className="col-6 mt-n3">
            <WeeklyCalendar week={new Date()}>
              <p className="fs-4 text-center">Booking List</p>
              <WeeklyContainer>
                <WeeklyDays />
                <WeeklyBody
                  events={[{ title: "Jane doe", date: new Date() }]}
                  renderItem={({ item, showingFullWeek }) => (
                    <DefaultWeeklyEventItem
                      key={item.date.toISOString()}
                      title={item.title}
                      date={
                        showingFullWeek
                          ? format(item.date, "MMM do k:mm")
                          : format(item.date, "k:mm")
                      }
                    />
                  )}
                />
              </WeeklyContainer>
            </WeeklyCalendar>
          </div>
        </div>
      </div>
    </>
  );
}

Loan.layout = Admin;
