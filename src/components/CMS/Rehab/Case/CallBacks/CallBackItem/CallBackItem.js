import React, { Component } from "react";
import moment from "moment";
import "./CallBackItem.scss";

class CallBackItem extends Component {
  renderBackgroundColour = () => {
    const callback = this.props.callback;
    let backgroundColor;
    const timeToCall = moment(callback.timeToCall);
    const tomorrow = moment(new Date()).add(1, "days");
    const now = moment(new Date()).add(4, "hours");
    if (callback.completed) {
      backgroundColor = "rgba(27, 170, 87, .2)";
      return backgroundColor;
    }
    if (timeToCall <= now) {
      backgroundColor = "rgba(234, 90, 90, .2)";
      return backgroundColor;
    }
    if (timeToCall < tomorrow) {
      backgroundColor = "rgba(255, 204, 0, .2)";
      return backgroundColor;
    }
  };
  render() {
    const {
      timeToCall,
      completed,
      completedDate,
      completedBy,
      callBackType
    } = this.props.callback;
    const style = {
      backgroundColor: this.renderBackgroundColour()
    };
    return (
      <div
        className="callback-item"
        style={style}
        onClick={this.props.showUpdateModal}
      >
        <div className="callback-item__date">
          <p>Time to call</p>
          <p>{moment(timeToCall).format("DD/MM/YYYY hh:mm A")}</p>
        </div>
        <div>
          <p>Call Back Type</p>
          <p>{callBackType}</p>
        </div>
        <div>
          <p>Completed</p>
          <p>{completed ? "Yes" : "No"}</p>
        </div>
        <div className="callback-item__date">
          <p>Completed Date</p>
          <p>
            {completed === false
              ? "N/A"
              : moment(completedDate).format("DD/MM/YYYY hh:mm A")}
          </p>
        </div>
        <div>
          <p>Completed By</p>
          <p>{completedBy !== null ? completedBy : "N/A"}</p>
        </div>
      </div>
    );
  }
}

export default CallBackItem;
