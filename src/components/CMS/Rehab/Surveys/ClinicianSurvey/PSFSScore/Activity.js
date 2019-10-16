import React from "react";
import moment from "moment";

import "./PSFSScore.scss";

const Activity = ({
  activity,
  painScore,
  removeActivity,
  initialScoreDate
}) => (
  <div className="psfsScore__activity" onClick={removeActivity}>
    <p>{activity}</p>
    <p> {painScore}</p>
    <p>{moment(initialScoreDate).format("DD/MM/YYYY")}</p>
  </div>
);

export default Activity;
