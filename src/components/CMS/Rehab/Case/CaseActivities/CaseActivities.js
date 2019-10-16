import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import { Card } from "components/Common";

import "./CaseActivities.scss";

const ActivityRow = props => (
  <tr>
    <td>{props.activity.activity}</td>
    <td>{props.activity.actionedBy}</td>
    <td>{moment(props.activity.actionedOn).format("DD/MM/YYYY HH:mm")}</td>
  </tr>
);

class CaseActivities extends Component {
  orderedActivities = () => {
    if (this.props.mi3dCase !== null)
      return _.orderBy(
        this.props.mi3dCase.caseActivities,
        ["actionedOn"],
        ["desc"]
      );
  };

  render() {
    return (
      <Card title="Case Activity">
        <div className="case-activity scrollable-card">
          {this.orderedActivities() !== undefined &&
          this.orderedActivities().length > 0 ? (
            <table className="case-activity__table">
              <thead>
                <tr>
                  <td>
                    <p>Activity</p>
                  </td>
                  <td>
                    <p>Actioned By</p>
                  </td>
                  <td>
                    <p>Actioned On</p>
                  </td>
                </tr>
              </thead>
              <tbody>
                {this.orderedActivities().map((activity, key) => (
                  <ActivityRow activity={activity} key={key} />
                ))}
              </tbody>
            </table>
          ) : (
            <p className="light">No case activities have been completed...</p>
          )}
        </div>
      </Card>
    );
  }
}
export default CaseActivities;
