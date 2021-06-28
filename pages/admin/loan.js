import React from "react";

// Components
import TableExample from "../../components/Tables/table";

// Layout
import Admin from "../../layouts/Admin";

export default function Loan() {
  return (
    <>
      <div className="container px-5">
        <div className="text-center fs-3 fw-bold">
          <p>Pickup List</p>
        </div>
        <TableExample>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Pickup At</th>
              <th>End At</th>
              <th>Accidents</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>Wijaya</td>
              <td>Ac</td>
              <td>wijayaac</td>
              <td>wijayaac</td>
            </tr>
          </tbody>
        </TableExample>
      </div>
    </>
  );
}
Loan.layout = Admin;
