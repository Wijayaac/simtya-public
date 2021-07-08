import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import router from "next/router";

// utils auth library
import { HandleAdminSSR } from "../../../utils/auth";
// Components
import TableExample from "../../../components/Tables/table";
import ArticlePlaceholder from "../../../components/Skeleton/ArticlePlaceholder";
// Layout
import Admin from "../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);

  const loan = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/loanlist`,
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

export default function Loan(props) {
  const { token } = props;
  const { loan } = props;

  const [searchTerms, setSearchTerms] = useState("");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const handleDetail = (id) => {
    router.push(`/admin/loan/detail/${id}`);
  };
  return (
    <>
      <div className="container px-5">
        <div className="text-center fs-3 fw-bold">
          <p>Loan List</p>
        </div>
        <div className="d-flex d-flex-column justify-content-end">
          <input
            className="p-2 border border-dark rounded"
            type="search"
            placeholder="Search vehicle name"
            onChange={(e) => setSearchTerms(e.target.value)}
          />
        </div>
        <TableExample>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>User</th>
              <th>Loan At</th>
              <th>End At</th>
              <th>Accidents</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <ArticlePlaceholder />}
            {!isLoading &&
              loan
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
                        {moment.utc(item.start_at).local().format("DD MMM,YY")}
                      </td>
                      <td>
                        {moment.utc(item.end_at).local().format("DD MMM,YY")}
                      </td>
                      <td>{item.accidents ? "Kecelakaan" : "Normal"}</td>
                      <td>
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
      </div>
    </>
  );
}
Loan.layout = Admin;
