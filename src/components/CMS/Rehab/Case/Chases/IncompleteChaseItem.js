import React, { Component } from "react";
import moment from "moment";

export default class IncompleteChaseItem extends Component {
  renderBackgroundColour = () => {
    const chase = this.props.chase;
    const chaseDate = moment(chase.chaseDate);
    const tomorrow = moment(new Date()).add(1, "days");
    const now = moment(new Date()).add(4, "hours");
    if (chase.completed) return "rgba(27, 170, 87, .2)";
    if (chaseDate <= now) return "rgba(234, 90, 90, .2)";
    if (chaseDate < tomorrow) return "rgba(255, 204, 0, .2)";
  };

  render() {
    const { description, chaseDate } = this.props.chase;
    const style = { backgroundColor: this.renderBackgroundColour() };
    return (
      <div
        className="chase-item chase-item--incomplete"
        style={style}
        onClick={this.props.openCompleteChaseModal}
      >
        <div className="chase-item__content chase-item__content--incomplete">
          <div className="chase-item__description">
            <p>Description</p>
            <p>{description}</p>
          </div>
          <div className="chase-item__info">
            <p>Date to complete</p>
            <p>{moment(chaseDate).format("DD/MM/YYYY")}</p>
          </div>
        </div>
      </div>
    );
  }
}
