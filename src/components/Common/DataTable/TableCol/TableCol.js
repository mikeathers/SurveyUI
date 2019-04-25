import React from "react";
import moment from "moment";
import "./TableCol.scss";

const TableCol = props => {
  const col =
    typeof props.row[props.col] === "object"
      ? moment(props.row[props.col]).format("DD/MM/YYYY hh:mm A")
      : props.row[props.col];
  return (
    <div className="tablecol" onClick={props.selectRow}>
      <p>{col}</p>
    </div>
  );
};

export default TableCol;
