import React, { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import ReactPaginate from "react-paginate";
import moment from "moment";

import { HandleAdminSSR } from "../../../utils/auth";

// Components
import TableExample from "../../../components/Tables";
import TablePlaceholder from "../../../components/Skeleton/TablePlaceholder";
import Modal from "../../../components/Modals/";
// Layout
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  const page = ctx.query.page || 1;
  const vehicle = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/vehicle/car`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/pickuplist/${page}`,
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
export default function Pickup(props) {
  const { token } = props;
  const { vehicle } = props;
  const { pickup } = props;

  const [data, setData] = useState(vehicle);
  const [isLoading, setLoading] = useState(true);
  const [select, setSelect] = useState([]);
  const [start, setStart] = useState(
    moment(moment.now()).utcOffset(480).format("YYYY-MM-DDThh:mm")
  );
  const [end, setEnd] = useState(
    moment(moment.now()).utcOffset(480).format("YYYY-MM-DDThh:mm")
  );
  const [route, setRoute] = useState([]);
  const [searchTerms, setSearchTerms] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);

  const handleDetail = (id) => {
    router.push(`/admin/pickup/detail/${id}`);
  };
  const handleDelete = (id) => {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/pickup/${id}`;
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
      .catch((err) => console.log(err));
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
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/pickup`;
      axios
        .post(
          url,
          {
            route: route,
            start_at: start,
            vehicle: select,
            end_at: end,
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
          router.reload();
        })
        .catch((error) => console.log(error));
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
      <div className="container px-1 px-md-5">
        <div className="text-center fs-3 fw-bold">
          <p>Pickup List</p>
        </div>
        <div className="d-flex d-flex-column justify-content-end my-2 my-md-0">
          <input
            className="p-2 border border-dark rounded"
            type="search"
            placeholder="Search vehicle name"
            onChange={(e) => setSearchTerms(e.target.value)}
          />
        </div>
        <Modal className="my-2" size="lg" buttonLabel="Add Pickup Schedule">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="selectVehicle" className="form-label">
                Vehicle
              </label>
              <select
                required
                id="selectVehicle"
                onChange={(e) => {
                  setSelect(e.target.value);
                }}
                className="form-select"
                aria-label="select vehicle">
                <option defaultChecked>Select one vehicle</option>
                {data.map((item) => {
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
              <label htmlFor="inputRoute" className="form-label">
                Route
              </label>
              <input
                onChange={(e) => setRoute(e.target.value)}
                required
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
                  <label htmlFor="inputSchedule" className="form-label d-block">
                    Start Time
                  </label>
                  <input
                    required
                    className="form-control"
                    onChange={(e) => setStart(e.target.value)}
                    type="datetime-local"
                    value={start}
                  />
                </div>
                <div className="col">
                  <label htmlFor="inputSchedule" className="form-label d-block">
                    End Time
                  </label>
                  <input
                    value={end}
                    required
                    className="form-control"
                    onChange={(e) => setEnd(e.target.value)}
                    type="datetime-local"
                  />
                </div>
                <small className="text-danger">
                  {message ? `*${message}` : ""}
                </small>
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
        </Modal>

        <div className="container mt-5">
          {isLoading && <TablePlaceholder />}
          {!isLoading && (
            <div className="overflow-auto">
              <TableExample>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Pickup At</th>
                    <th>End At</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pickup.data
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
                          <td>
                            {moment(item.start_at)
                              .utcOffset(0)
                              .format("DD MMMM ,HH:mm")}
                          </td>
                          <td>
                            {moment(item.end_at).utcOffset(0).format("HH:mm")}
                          </td>
                          <td>{item.route}</td>
                          <td>{item.ready === false ? "Pending" : "Ready"}</td>
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
              <ReactPaginate
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                initialPage={pickup.currentPage - 1}
                pageCount={pickup.maxPage}
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
        </div>
      </div>
    </>
  );
}
Pickup.layout = Admin;
