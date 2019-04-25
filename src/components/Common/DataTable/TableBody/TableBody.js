import React, { Component } from "react";
import TableRow from "../TableRow/TableRow";
import "./TableBody.scss";

export default class TableBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Loading..."
    };
  }

  componentDidMount() {
    this.timerHandle = setTimeout(() => {
      this.setState({ message: "No results found..." });
      this.timerHandle = 0;
    }, 10000);
  }
  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  }

  render() {
    return (
      <div className="datatable__body">
        {this.props.results.length > 0 ? (
          this.props.paginatedList.length > 0 &&
          this.props.paginatedList.map((row, key) => {
            return (
              <TableRow
                key={key}
                cols={this.props.cols}
                row={row}
                id={row[this.props.idCol]}
                selectRow={this.props.selectRow}
                timeSensitiveValue={this.props.timeSensitiveValue}
                checkRow={this.props.checkRow}
                checkAllRows={this.props.checkAllRows}
                allChecked={this.props.allChecked}
                actionAllNeeded={this.props.actionAllNeeded}
                testId={`tablerow__${++key}`}
              />
            );
          })
        ) : (
          <div className="datatable__no-results-found">
            <p>{this.state.message}</p>
          </div>
        )}
      </div>
    );
  }
}
