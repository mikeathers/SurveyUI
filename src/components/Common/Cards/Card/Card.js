import React, { Component } from "react";
import { Collapse } from "react-collapse";

import "./Card.scss";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpenByDefault !== null ? props.isOpenByDefault : false,
      disabled: props.disabled !== null ? props.disabled : false
    };
  }
  componentWillReceiveProps({ disabled }) {
    this.setState({ disabled });
  }

  render() {
    const disabledStyle = {
      pointerEvents: "none",
      opacity: ".7"
    };
    const { isOpen } = this.state;
    const collapsed = this.props.collapse
      ? "card__title-container"
      : "card__title-container card__not-collapsible";
    return (
      <div className="card" style={this.state.disabled ? disabledStyle : {}}>
        <div className={collapsed}>
          <h3>{this.props.title}</h3>
          {this.props.collapse && (
            <span
              className="card__collapse-btn"
              onClick={() => this.setState({ isOpen: !isOpen })}
            >
              {isOpen ? "Close" : "Open"}
            </span>
          )}
        </div>
        {this.props.collapse ? (
          <Collapse isOpened={isOpen}>
            <div className="card__content">{this.props.children}</div>
          </Collapse>
        ) : (
          <div className="card__content">{this.props.children}</div>
        )}
      </div>
    );
  }
}

export { Card };
