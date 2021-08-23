import React, { useState, useEffect } from "react";
import router from "next/router";
import axios from "axios";
import moment from "moment";
import ReactPaginate from "react-paginate";

import {
  WeeklyCalendar,
  WeeklyBody,
  WeeklyDays,
  WeeklyContainer,
  DefaultWeeklyEventItem,
} from "@zach.codes/react-calendar";
// utils auth library
import { HandleDriverSSR } from "../../../utils/auth";

// Components UI
import Modal from "../../../components/Modals";
import TableExample from "../../../components/Tables";
import TablePlaceholder from "../../../components/Skeleton/TablePlaceholder";
// Layout Component
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);
  const page = ctx.query.page || 1;

  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/motorcycle`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/driver/service/${page}`,
    {
      headers: {
        Authorization: token,
      },
    }
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
      service: service.data,
      vehicle: vehicle.data.data,
    },
  };
}

export default function Service(props) {
  const { token } = props;
  const { vehicle } = props;
  const { service } = props;
  const { eventService } = props;
  const { eventLoan } = props;

  const [isLoading, setLoading] = useState(true);
  const [select, setSelect] = useState([]);
  const [start, setStart] = useState(
    moment(moment.now()).utcOffset(480).format("YYYY-MM-DDThh:mm")
  );
  const [end, setEnd] = useState(
    moment(moment.now()).utcOffset(480).format("YYYY-MM-DDThh:mm")
  );
  const [type, setType] = useState([]);
  const [searchTerms, setSearchTerms] = useState("");
  const [message, setMessage] = useState("");

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
      })
      .catch((error) => console.log("Error deleting data", error));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      moment(start).isBefore(moment.now(), "day") ||
      moment(end).isBefore(moment(start), "day")
    ) {
      setMessage("schedule time inccorect");
    } else {
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
          },
          {
            headers: {
              Accept: "application/json",
              "Access-Controll-Allow-Origin": "*",
              Authorization: token,
            },
          }
        )
        .then(({ data }) => {
          if (!data) {
            alert("Motorcycle on book, pick another day or motorcycle");
          } else {
            router.reload();
          }
          setLoading(false);
        })
        .catch((error) =>
          console.log("Error inserting service schedule", error)
        );
    }
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
  return (
    <>
      <div className="container">
        <div className="text-center my-2 fs-2 fw-bold">
          <p>Service List</p>
        </div>
        <div className="d-flex d-flex-column my-2 justify-content-end">
          <input
            className="p-2 border border-dark rounded"
            type="search"
            placeholder="Search vehicle name"
            onChange={(e) => setSearchTerms(e.target.value)}
          />
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
                required
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
                required
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
                required
                type="date"
                name="end_date"
                className="form-control"
                id="inputYears"
              />
            </div>
            <small className="text-danger">
              {message ? `*${message}` : ""}
            </small>
            <div className="mb-3">
              <label htmlFor="inputType" className="form-label">
                Type of Service
              </label>
              <input
                onChange={(e) => setType(e.target.value)}
                id="inputType"
                required
                type="text"
                className="form-control"
              />
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
        <div className="mt-1 mt-md-5 row row-cols-md-2">
          {isLoading && <TablePlaceholder />}
          {!isLoading && (
            <div className="my-2 col">
              <div className="overflow-auto">
                <TableExample>
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Type</th>
                      <th>Service At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.data
                      .filter((item) => {
                        if (searchTerms === "") {
                          return item;
                        } else if (
                          item.name
                            .toLowerCase()
                            .includes(searchTerms.toLocaleLowerCase())
                        ) {
                          return item;
                        }
                      })
                      .map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>
                              {moment
                                .utc(item.start_at)
                                .local()
                                .format("DD MMMM ,YYYY")}
                            </td>
                            <td>
                              <button
                                className="btn btn-warning my-1 mx-1"
                                onClick={handleDetail.bind(this, item.id)}>
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-danger my-1 mx-1"
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
              <ReactPaginate
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                initialPage={service.currentPage - 1}
                pageCount={service.maxPage}
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
          <div className="col my-2 mt-md-n3">
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

Service.layout = Admin;
