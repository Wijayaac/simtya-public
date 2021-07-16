import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import ReactPaginate from "react-paginate";

// utils auth library
import { HandleAdminSSR } from "../../../utils/auth";

// Components
import TableExample from "../../../components/Tables";
import TablePlaceholder from "../../../components/Skeleton/TablePlaceholder";

// Layout
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  const page = ctx.query.page || 1;

  const service = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/service/${page}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return {
    props: {
      token: token,
      service: service.data,
    },
  };
}

export default function Service(props) {
  const { token } = props;
  const { service } = props;

  const [searchTerms, setSearchTerms] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, []);
  const handleDetail = (id) => {
    router.push(`/admin/service/detail/${id}`);
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
      <div className="container px-5">
        <div className="text-center fs-3 fw-bold">
          <p>Service List</p>
        </div>
        <div className="d-flex d-flex-column justify-content-end">
          <input
            onChange={(e) => setSearchTerms(e.target.value)}
            type="search"
            placeholder="Search vehicle name"
            className="p-2 border border-dark rounded"
          />
        </div>
        {isLoading && <TablePlaceholder />}
        {!isLoading && (
          <div className="">
            <TableExample>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Service At</th>
                  <th>End At</th>
                  <th>Actions</th>
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
                        .includes(searchTerms.toLowerCase())
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
                            .format("DD MMM,YY")}
                        </td>
                        <td>
                          {moment.utc(item.end_at).local().format("DD MMM,YY")}
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-warning me-1"
                            onClick={handleDetail.bind(this, item.id)}>
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
      </div>
    </>
  );
}
Service.layout = Admin;
