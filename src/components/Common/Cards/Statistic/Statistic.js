import React from "react";
import "./Statistic.scss";

const Statistic = props => {
  return (
    <div className="statistic">
      <h1>{props.title}</h1>
      <h2>{props.value}</h2>
    </div>
  );
};

export { Statistic };
