import React, { Component } from "react";
import "./TableHeader.scss";

export default class TableHeader extends Component {
  sort = value => {
    const col = this.props.cols.find(m => m.value === value);
    if (col.sortable) {
      this.props.sort(value);
      this.props.handleSortedColChange(value);
    }
  };

  switchIcon = value => {
    var col = this.props.sortableCols.find(m => m.name === `${value}Sorted`);

    if (col !== undefined) {
      let sorted = col.sorted;
      return sorted === true
        ? "fa fa-sort-amount-asc"
        : "fa fa-sort-amount-desc";
    }
  };

  render() {
    return (
      <div className="datatable__header">
        {this.props.cols.map((col, key) => {
          return (
            <div key={key}>
              <p onClick={() => this.sort(col.value)}>
                {col.title}
                {col.sortable && <i className={this.switchIcon(col.value)} />}
              </p>
            </div>
          );
        })}
        {this.props.actionAllNeeded && (
          <div className="datatable__header-select-all">
            <input type="checkbox" onClick={this.props.checkAllRows} />
          </div>
        )}
      </div>
    );
  }
}
