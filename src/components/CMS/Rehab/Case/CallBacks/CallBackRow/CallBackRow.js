import React, { Component } from "react";
import moment from "moment";
import "./CallBackRow.scss";

class CallBackRow extends Component {
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
      <tr className="callback-row">
        <td onClick={this.props.showUpdateModal} style={style}>
          <p>{moment(timeToCall).format("DD/MM/YYYY hh:ss A")}</p>
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
              : moment(completedDate).format("DD/MM/YYYY hh:ss A")}
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
