import React, { Component } from "react";
import moment from "moment";
import "./CallBackRow.scss";

class CallBackRow extends Component {
  renderBackgroundColour = () => {
    const callback = this.props.callback;
    const timeToCall = moment(callback.timeToCall);
    const tomorrow = moment(new Date()).add(1, "days");
    const now = moment(new Date()).add(4, "hours");
    if (callback.completed) return "rgba(27, 170, 87, .2)";
    if (timeToCall <= now) return "rgba(234, 90, 90, .2)";
    if (timeToCall < tomorrow) return "rgba(255, 204, 0, .2)";
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
      <tr className="callback-row">
        <td onClick={this.props.showUpdateModal} style={style}>
          <p>{moment(timeToCall).format("DD/MM/YYYY hh:mm A")}</p>
        </td>
        <td onClick={this.props.showUpdateModal} style={style}>
          <p>{callBackType}</p>
        </td>
        <td onClick={this.props.showUpdateModal} style={style}>
          <p>{completed ? "Yes" : "No"}</p>
        </td>
        <td onClick={this.props.showUpdateModal} style={style}>
          <p>
            {completedDate.includes("01/01/0001")
              ? "N/A"
              : moment(completedDate).format("DD/MM/YYYY hh:mm A")}
          </p>
        </td>
        <td style={style}>
          <p>{completedBy !== null ? completedBy : "N/A"}</p>
          <span
            onClick={this.props.showRemoveModal}
            className="callback-row__close"
          >
            <p>x</p>
          </span>
        </td>
      </tr>
    );
  }
}
export default CallBackRow;
