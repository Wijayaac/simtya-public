import React, { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import moment from "moment";
import ReactPaginate from "react-paginate";

// utils auth library
import { HandleMemberSSR } from "../../utils/auth";
import { parseJWT } from "../../utils/parseJWT";

// Components
import TableExample from "../../components/Tables";
import TablePlaceholder from "../../components/Skeleton/TablePlaceholder";

// Layout
import Admin from "../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);
  const page = ctx.query.page || 1;
  const pickup = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/member/pickup/${page}`,
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
    },
  };
}
export default function Pickup(props) {
  const { token } = props;
  const { pickup } = props;
  const { sub } = parseJWT(token);

  const [join, setJoin] = useState(null);
  const [searchTerms, setSearchTerms] = useState("");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/member/joinpickup/${sub}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        let response = data.data;
        let isJoin =
          response.active &&
          moment(response.created_at).isSame(moment(), "date");
        setJoin(isJoin);
        // console.log(join);
        // let today = response.created_at;
        // let isToday = moment(today).isSame(moment(), "date");
        // if (isToday) setJoin(!isToday);
        // console.log(join);
      })
      .catch((error) => console.log("wait for join", error));
  }, [sub, token]);
  const handleJoin = (id, startDate) => {
    let today = moment();
    let isYesterday = moment(startDate).isBefore(today, "date");
    if (isYesterday)
      alert("This pickup schedule, was unavailable. Select today schedule");
    setJoin(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/member/pickup`,
        {
          pickup: id,
          user: sub,
          description: "Join Pickup schedule",
          active: true,
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
        router.reload();
      })
      .catch((error) => {
        setJoin(false);
        console.log("Error join the pickup schedule", error);
      });
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
        <div className="d-flex d-flex-column justify-content-end">
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
                  <th>Pickup At</th>
                  <th>End At</th>
                  <th>Route</th>
                  <th>Slots</th>
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
                        <td>{item.slot < 1 ? "Full" : item.slot}</td>
                        {item.slot < 1 ? (
                          <td>Wait pickup time</td>
                        ) : (
                          <td>
                            {join && "Wait Pickup Time"}
                            {!join && (
                              <button
                                className="btn btn-warning me-1"
                                onClick={handleJoin.bind(
                                  this,
                                  item.id,
                                  item.start_at
                                )}>
                                <i className="bi bi-box-arrow-in-right"></i>
                                Join
                              </button>
                            )}
                          </td>
                        )}
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
    </>
  );
}
Pickup.layout = Admin;
