import React from "react";
import { Table } from "reactstrap";

const TableExample = (props) => {
  return <Table hover>{props.children}</Table>;
};

export default TableExample;
