import React, { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import moment from "moment";
import ReactPaginate from "react-paginate";

// utils auth library
import { HandleDriverSSR } from "../../../utils/auth";

// Components
import TableExample from "../../../components/Tables";
import TablePlaceholder from "../../../components/Skeleton/TablePlaceholder";
// Layout
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleDriverSSR(ctx);
  const page = ctx.query.page || 1;
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/driver/pickup/${page}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return {
    props: {
      pickup: pickup.data,
    },
  };
}
export default function Pickup(props) {
  const { pickup } = props;
  const [searchTerms, setSearchTerms] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);

  const handleUpdate = (id) => {
    router.push(`/driver/pickup/detail/${id}`);
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
        <div className="container my-2 mt-5">
          <input
            className="p-2 border border-dark rounded"
            type="search"
            placeholder="Search vehicle name"
            onChange={(e) => setSearchTerms(e.target.value)}
          />
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
                            {moment(item.start_at).format("DD MMMM ,HH:mm")}
                          </td>
                          <td>{moment(item.end_at).format("HH:mm")}</td>
                          <td>{item.route}</td>
                          <td>{item.ready === false ? "Pending" : "Ready"}</td>
                          <td>
                            <button
                              className="btn btn-warning me-1"
                              onClick={handleUpdate.bind(this, item.id)}>
                              <i className="bi bi-eye"></i>
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
