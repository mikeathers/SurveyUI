import React, { Component } from "react";
import { Collapse } from "react-collapse";

import "./TabbedCard.scss";

class TabbedCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpenByDefault !== null ? props.isOpenByDefault : false,
      titleSelected: this.props.tabTitles[0]
    };
  }

  titleSelected = title => {
    return title === this.state.titleSelected ? "tabbed-card__selected" : null;
  };

  selectTitle = title => {
    this.setState({ titleSelected: title });
  };

  renderTab = () => {
    const { tabs } = this.props;
    return tabs.map((tab, key) => {
      if (tab.title === this.state.titleSelected) {
        return <div key={key}>{tab.content}</div>;
      }
      return null;
    });
  };

  render() {
    const { isOpen } = this.state;

    const bordered = this.props.bordered
      ? "tabbed-card tabbed-card-bordered"
      : "tabbed-card";

    return (
      <div className={bordered}>
        <div className="tabbed-card__header">
          <div className="tabbed-card__title-container">
            {this.props.tabTitles.map((title, key) => (
              <div key={key}>
                {this.props.largeTitle && (
                  <h2
                    className={this.titleSelected(title)}
                    onClick={() => this.selectTitle(title)}
                  >
                    {title}
                  </h2>
                )}
                {this.props.smallTitle && (
                  <p
                    className={this.titleSelected(title)}
                    onClick={() => this.selectTitle(title)}
                  >
                    {title}
                  </p>
                )}
              </div>
            ))}
          </div>
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
            <div className="tabbed-card__content">{this.renderTab()}</div>
          </Collapse>
        ) : (
          <div className="tabbed-card__content">{this.renderTab()}</div>
        )}
      </div>
    );
  }
}

export { TabbedCard };
