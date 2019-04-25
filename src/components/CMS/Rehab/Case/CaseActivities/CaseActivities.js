import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import { Card } from "components/Common";

import "./CaseActivities.scss";

const ActivityRow = props => (
  <tr>
    <td>{props.activity.activity}</td>
    <td>{props.activity.actionedBy}</td>
    <td>{moment(props.activity.actionedOn).format("DD/MM/YYYY hh:mm A")}</td>
  </tr>
);

class CaseActivities extends Component {
  orderedActivities = () => {
    return _.orderBy(
      this.props.mi3dCase.caseActivities,
      ["actionedOn"],
      ["desc"]
    );
  };

  render() {
    return (
      <Card title="Case Activity">
        <div className="case-activity">
          {this.orderedActivities().length > 0 ? (
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
            <p className="light">This case has had no activity.</p>
          )}
        </div>
      </Card>
    );
  }
}
const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase
});
export default connect(mapStateToProps)(CaseActivities);
