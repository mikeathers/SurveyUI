import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import { DataTable } from "components/Common";

import "./CaseList.scss";

export default class CaseList extends Component {
  orderCallbacks = callbacks => {
    const callBacksParsed = callbacks.map((callBack, key) => {
      return {
        key,
        bluedogCaseRef: callBack.bluedogCaseRef,
        timeToCall: moment(callBack.timeToCall),
        callBackType: callBack.callBackType,
        createdOn: moment(callBack.createdOn),
        createdBy: callBack.createdBy,
        caseId: callBack.caseId
      };
    });
    return _.orderBy(callBacksParsed, [m => m.timeToCall], ["asc"]);
  };

  render() {
    const { callbacks, selectCase } = this.props;
    const callbacksOrdered = this.orderCallbacks(callbacks);
    return (
      <DataTable
        list={callbacksOrdered}
        selectRow={selectCase}
        showInactive={this.showInactive}
        timeSensitiveValue="timeToCall"
        cols={[
          {
            value: "bluedogCaseRef",
            title: "Case Reference",
            sortable: true
          },
          { value: "callBackType", title: "Type", sortable: true },
          { value: "timeToCall", title: "Time to Call", sortable: true },
          {
            value: "createdBy",
            title: "Created By",
            sortable: true
          },
          { value: "createdOn", title: "Created On", sortable: false }
        ]}
      />
    );
  }
}
