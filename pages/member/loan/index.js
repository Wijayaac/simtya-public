import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import ReactPaginate from "react-paginate";

import {
  WeeklyCalendar,
  WeeklyBody,
  WeeklyDays,
  WeeklyContainer,
  DefaultWeeklyEventItem,
} from "@zach.codes/react-calendar";

// Components UI
import TableExample from "../../../components/Tables";
import Modal from "../../../components/Modals";
import TablePlaceholder from "../../../components/Skeleton/TablePlaceholder";
// utils auth library
import { HandleMemberSSR } from "../../../utils/auth";
import { parseJWT } from "../../../utils/parseJWT";
// Layout Component
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);
  const page = ctx.query.page || 1;
  const { sub } = parseJWT(token);
  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/motorcycle`,
    { headers: { Authorization: token } }
  );

  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/loanlist/${sub}/${page}`,
    { headers: { Authorization: token } }
  );
  const event = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/event/`,
    { headers: { Authorization: token } }
  );
  return {
    props: {
      token: token,
      eventService: event.data.service,
      eventLoan: event.data.loan,
      loan: loan.data,
      vehicle: vehicle.data.data,
    },
  };
}
export default function Loan(props) {
  const { token } = props;
  const { sub } = parseJWT(token);
  const { vehicle } = props;
  const { eventService } = props;
  const { eventLoan } = props;
  const { loan } = props;

  const [select, setSelect] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [description, setDescription] = useState([]);
  const [searchTerms, setSearchTerms] = useState("");
  const [isLoading, setLoading] = useState(true);

  let services = eventService.map((item) => {
    return { name: item.name, date: moment(item.start_at)._d };
  });
  let loans = eventLoan.map((item) => {
    return { name: item.name, date: moment(item.start_at)._d };
  });
  let events = services.concat(loans);
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
      .then(({ data }) => {
        if (!data) {
          alert("Motorcycle already booked, pick another day or motorcycle");
        } else {
          router.reload();
        }
        setLoading(false);
      })
      .catch((error) => console.log("Error insert new loan", error));
  };
  const handlePagination = (page) => {
    const path = router.pathname;
    const query = router.query;
    query.page = page.selected + 1;
    router.push({
      pathname: path,
      query: query,
    });
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
        router.reload();
        setLoading(false);
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
          {isLoading && <TablePlaceholder />}
          {!isLoading && (
            <div className="my-2 col-6">
              <input
                className="p-2 border border-dark rounded"
                type="search"
                placeholder="Search vehicle name"
                onChange={(e) => setSearchTerms(e.target.value)}
              />
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
                  {loan.list
                    .filter((item) => {
                      if (searchTerms === "") {
                        return item;
                      } else if (
                        item.name
                          .toLowerCase()
                          .includes(searchTerms.toLowerCase())
                      ) {
                        return item;
                      }
                    })
                    .map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.name}</td>
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
              <ReactPaginate
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                initialPage={loan.currentPage - 1}
                pageCount={loan.maxPage}
                onPageChange={handlePagination}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                activeClassName={"active"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
              />
            </div>
          )}
          <div className="col-6 mt-n3">
            <WeeklyCalendar week={new Date()}>
              <p className="fs-4 text-center">Booking List</p>
              <WeeklyContainer>
                <WeeklyDays />
                <WeeklyBody
                  style={{ width: "60%" }}
                  events={events}
                  renderItem={({ item, showingFullWeek }) => (
                    <DefaultWeeklyEventItem
                      key={Math.random()}
                      title={item.name}
                      date={
                        showingFullWeek
                          ? moment(item.date).format("MMM Do,YY")
                          : moment(item.date).format("k:mm")
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
