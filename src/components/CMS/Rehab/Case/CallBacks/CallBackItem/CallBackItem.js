import React, { Component } from "react";
import moment from "moment";
import "./CallBackItem.scss";

class CallBackItem extends Component {
  renderBackgroundColour = () => {
    const callback = this.props.callback;
    const timeToCall = moment(callback.timeToCall);
    const tomorrow = moment(new Date()).add(1, "days");
    const now = moment(new Date()).add(4, "hours");
    if (timeToCall <= now) return "rgba(234, 90, 90, .2)";
    if (timeToCall < tomorrow) return "rgba(255, 204, 0, .2)";
  };

  renderBorderColour = () => {
    const callback = this.props.callback;
    const timeToCall = moment(callback.timeToCall);
    const tomorrow = moment(new Date()).add(1, "days");
    const now = moment(new Date()).add(4, "hours");

    if (callback.completed)
      return { border: "1px solid rgba(27, 170, 87, .2)" };

    if (timeToCall <= now) return { border: "1px solid rgba(234, 90, 90, .4)" };

    if (timeToCall < tomorrow)
      return { border: "1px solid rgba(255, 204, 0, .4)" };
  };

  renderCallBackItem = () => {
    const callback = this.props.callback;
    const timeToCall = moment(callback.timeToCall);
    const tomorrow = moment(new Date()).add(1, "days");
    const now = moment(new Date()).add(4, "hours");

    if (callback.completed)
      return <i style={{ color: "#00AB66" }} className="fa fa-check" />;

    if (timeToCall <= now)
      return <i style={{ color: "red" }} className="fa fa-exclamation" />;

    if (timeToCall < tomorrow)
      return <i style={{ color: "#F8A000" }} className="fa fa-warning" />;
  };

  render() {
    const {
      timeToCall,
      completed,
      completedDate,
      completedBy,
      callBackType
    } = this.props.callback;

    const outstandingStyle = {
      backgroundColor: this.renderBackgroundColour()
    };

    const completedStyle = {
      border: this.renderBorderColour()
    };

    const completedClass = !completed
      ? "callback-item callback-item__outstanding"
      : "callback-item";

    return (
      <div
        className={completedClass}
        style={this.renderBorderColour()}
        onClick={this.props.showUpdateModal}
      >
        <div className="callback-item__icon">{this.renderCallBackItem()}</div>
        <div className="callback-item__content">
          <div className="callback-item__date">
            <p>Time to call</p>
            <p>{moment(timeToCall).format("DD/MM/YYYY HH:mm")}</p>
          </div>
          <div>
            <p>Call Back Type</p>
            <p>{callBackType}</p>
          </div>

          <div className="callback-item__date">
            <p>Completed Date</p>
            <p>
              {completed === false
                ? "N/A"
                : moment(completedDate).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
          <div>
            <p>Completed By</p>
            <p>{completedBy !== null ? completedBy : "N/A"}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default CallBackItem;
