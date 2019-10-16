import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import { DataTable } from "components/Common";

export default class CaseList extends Component {
  orderChases = chases => {
    const chasesParsed = chases.map((chase, key) => {
      return {
        key,
        caseId: chase.caseId,
        chaseDate: moment(chase.chaseDate),
        description: chase.description,
        toBeCompletedBy: chase.toBeCompletedBy,
        bluedogCaseRef: chase.bluedogReference
      };
    });
    return _.orderBy(chasesParsed, [m => m.chaseDate], ["asc"]);
  };

  render() {
    const { chases, selectCase } = this.props;
    const chasesOrdered = this.orderChases(chases);
    return (
      <div id="chasesCaseList">
        <DataTable
          id="chasesDataTable"
          list={chasesOrdered}
          selectRow={selectCase}
          timeSensitiveValue="chaseDate"
          showInactive={this.showInactive}
          cols={[
            {
              value: "bluedogCaseRef",
              title: "Case Reference",
              sortable: true
            },
            { value: "description", title: "Description", sortable: true },
            {
              value: "toBeCompletedBy",
              title: "To Be Completed By",
              sortable: true
            },
            { value: "chaseDate", title: "Chase Date", sortable: true }
          ]}
        />
      </div>
    );
  }
}
