import React, { Component } from "react";

export default class CompleteChaseItem extends Component {
  renderBackgroundColour = () => {
    const chase = this.props.chase;
    if (chase.compliant) return "1px solid rgba(27, 170, 87, .2)";
    else return "1px solid rgba(234, 90, 90, .2)";
  };

  render() {
    const { description, compliant } = this.props.chase;
    const style = { border: this.renderBackgroundColour() };
    return (
      <div className="chase-item" style={style}>
        <div className="chase-item__icon">
          {compliant ? (
            <i style={{ color: "#00AB66" }} className="fa fa-check" />
          ) : (
            <i style={{ color: "red" }} className="fa fa-times" />
          )}
        </div>
        <div className="chase-item__content">
          <div className="chase-item__description">
            <p>Description</p>
            <p>{description}</p>
          </div>
          <div className="chase-item__info">
            <p>Compliance</p>
            <p>{compliant ? "Compliant" : "Non-compliant"}</p>
          </div>
        </div>
      </div>
    );
  }
}
