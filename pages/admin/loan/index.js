import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import ReactPaginate from "react-paginate";
import { Button, ButtonGroup } from "reactstrap";
// utils auth library
import { HandleAdminSSR } from "../../../utils/auth";
// Components
import Confirm from "../../../components/Confirm";
import TableExample from "../../../components/Tables";
import TablePlaceholder from "../../../components/Skeleton/TablePlaceholder";
// Layout
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  const page = ctx.query.page || 1;

  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/loan-list/${page}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return {
    props: {
      token: token,
      loan: loan.data,
    },
  };
}

export default function Loan(props) {
  const { loan } = props;
  const { token } = props;
  const [searchTerms, setSearchTerms] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [finish, setFinish] = useState(false);
  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);
  const handleDetail = (id) => {
    router.push(`/admin/loan/detail/${id}`);
  };
  const handleConfirm = (e, id, vehicle) => {
    e.preventDefault();
    try {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/loan/confirm/${id}`,
          {
            finish: finish,
            description: description,
            vehicle: vehicle,
          },
          {
            headers: { Authorization: token },
          }
        )
        .then(({ success }) => {
          alert("thanks for your confirmation");
          router.reload();
        });
    } catch (error) {
      alert(error ? "Oops you hit an error see in your console" : "");
      console.log(error);
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
      <div className="container px-1 px-md-5 mt-1 mt-md-5 mb-md-5">
        <div className="text-center fs-3 fw-bold">
          <p>Loan List</p>
        </div>
        <div className="d-flex d-flex-column justify-content-end my-2">
          <input
            className="p-2 border border-dark rounded"
            type="search"
            placeholder="Search vehicle name"
            onChange={(e) => setSearchTerms(e.target.value)}
          />
        </div>
        {isLoading && <TablePlaceholder />}
        {!isLoading && (
          <div className="overflow-auto">
            <TableExample>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>User</th>
                  <th>Loan At</th>
                  <th>End At</th>
                  <th>Accidents</th>
                  <th>Details</th>
                  <th>Confirm</th>
                </tr>
              </thead>
              <tbody>
                {loan.data
                  .filter((item) => {
                    if (searchTerms === "") {
                      return item;
                    } else if (
                      item.name
                        .toLowerCase()
                        .includes(searchTerms.toLowerCase()) ||
                      item.username
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
                        <td>{item.username ? item.username : item.email}</td>
                        <td>
                          {moment
                            .utc(item.start_at)
                            .local()
                            .format("DD MMM,YY")}
                        </td>
                        <td>
                          {moment.utc(item.end_at).local().format("DD MMM,YY")}
                        </td>
                        <td>{item.accidents ? "Kecelakaan" : "Normal"}</td>
                        <td>
                          <button
                            className="btn btn-warning mx-1"
                            onClick={handleDetail.bind(this, item.id)}>
                            <i className="bi bi-eye"></i>
                          </button>
                        </td>
                        <td>
                          <Confirm
                            buttonLabel="Check"
                            disabled={
                              item.finish === null ? false : item.finish
                            }
                            className={`btn ${
                              item.finish ? "d-none" : ""
                            } mx-1 my-2`}>
                            <form
                              onSubmit={(e) =>
                                handleConfirm(e, item.id, item.id_vehicle)
                              }>
                              <div className="mb-3">
                                <label
                                  forHtml="inputDesc"
                                  className="form-label">
                                  Confirm the condition
                                </label>
                                <br />
                                <ButtonGroup>
                                  <Button
                                    type="reset"
                                    color="outline-info"
                                    onClick={() => setFinish(true)}
                                    active={finish}>
                                    All Okay !
                                  </Button>
                                  <Button
                                    color="outline-warning"
                                    onClick={() => setFinish(false)}
                                    active={!finish}>
                                    There is a Problem
                                  </Button>
                                </ButtonGroup>
                                <p className="my-2">
                                  {!finish
                                    ? "Add your notes into description bellow"
                                    : ""}
                                </p>
                                <label
                                  forHtml="inputDesc"
                                  className="form-label">
                                  Description
                                </label>
                                <textarea
                                  name="description"
                                  onChange={(e) => {
                                    setDescription(e.target.value);
                                  }}
                                  disabled={finish}
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
                                  {!isLoading && <span>Confirm</span>}
                                </button>
                                <button
                                  type="reset"
                                  className="btn btn-outline-dark mx-2">
                                  Clear
                                </button>
                              </div>
                            </form>
                          </Confirm>
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
      </div>
    </>
  );
}
Loan.layout = Admin;
