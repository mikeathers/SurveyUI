import React from "react";
import moment from "moment";
import "./TableRow.scss";
import TableCol from "../TableCol/TableCol";

class TableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      checked: false
    };
  }
  componentWillReceiveProps({ allChecked }) {
    if (allChecked) this.setState({ checked: false });
  }
  selectRow = () => {
    this.props.selectRow(this.props.row);
  };

  renderBackgroundColour = () => {
    if (this.props.timeSensitiveValue !== undefined) {
      let backgroundColor;
      const timeToCall = this.props.row[this.props.timeSensitiveValue];
      const tomorrow = moment(new Date()).add(1, "days");
      const now = moment(new Date()).add(4, "hours");

      if (timeToCall <= now) {
        backgroundColor = "rgba(234, 90, 90, .2)";
        return backgroundColor;
      }
      if (timeToCall < tomorrow) {
        backgroundColor = "rgba(255, 204, 0, .2)";
        return backgroundColor;
      }
    }
  };

  checkRow = () => {
    this.props.checkRow(this.props.id);
    this.setState({ checked: !this.state.checked });
  };
  render() {
    const style = {
      backgroundColor: this.renderBackgroundColour()
    };
    return (
      <div className="tablerow" style={style} id={`${this.props.testId}`}>
        {this.props.cols.map((col, key) => {
          return (
            <TableCol
              col={col.value}
              row={this.props.row}
              key={key}
              selectRow={this.selectRow}
            />
          );
        })}
        {this.props.actionAllNeeded && (
          <div className="tablerow__select-all">
            <input
              type="checkbox"
              onClick={this.checkRow}
              checked={
                this.props.allChecked === true
                  ? this.props.allChecked
                  : this.state.checked
              }
              onChange={this.checkRow}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TableRow;
