import React from "react";
import "./SystemActivities.scss";

export const SystemActivitySuccessful = ({ activity, retryAction }) => (
  <div
    className="system-activity system-activity--success"
    onClick={retryAction}
  >
    <div className="system-activity__icon">
      <i style={{ color: "#00AB66" }} className="fa fa-check" />
    </div>
    <div className="system-activity__content">
      <div className="system-activity__description">
        <p>{activity.activity}</p>
      </div>
      <div className="system-activity__info">
        <p>{activity.state}</p>
      </div>
    </div>
  </div>
);

export const SystemActivityPending = ({ activity, retryAction }) => (
  <div
    className="system-activity system-activity--pending"
    onClick={retryAction}
  >
    <div className="system-activity__icon">
      <i style={{ color: "#F8A000" }} className="fa fa-hourglass-half" />
    </div>
    <div className="system-activity__content">
      <div className="system-activity__description">
        <p>{activity.activity}</p>
      </div>
      <div className="system-activity__info">
        <p>{activity.state}</p>
      </div>
    </div>
  </div>
);

export const SystemActivityError = ({ activity, retryAction }) => (
  <div className="system-activity system-activity--error" onClick={retryAction}>
    <div className="system-activity__icon">
      <i style={{ color: "red" }} className="fa fa-times" />
    </div>
    <div className="system-activity__content">
      <div className="system-activity__description">
        <p>{activity.activity}</p>
      </div>
      <div className="system-activity__info">
        <p>{activity.state}</p>
      </div>
    </div>
  </div>
);
