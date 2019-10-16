import React, { Component } from "react";

import { DataTable } from "components/Common";

import "./CaseList.scss";

export default class CaseList extends Component {
  render() {
    const { cases, selectCase } = this.props;
    return (
      <div id="newCasesCaseList">
        <DataTable
          id="newCasesDataTable"
          list={cases}
          selectRow={selectCase}
          idCol="bluedogCaseRef"
          showInactive={this.showInactive}
          cols={[
            { value: "firstName", title: "First Name", sortable: true },
            { value: "lastName", title: "Last Name", sortable: true },
            {
              value: "bluedogCaseRef",
              title: "Rehab Reference",
              sortable: true
            },
            {
              value: "instructingPartyName",
              title: "Instructing Party",
              sortable: true
            },
            { value: "status", title: "Status", sortable: false }
          ]}
        />
      </div>
    );
  }
}
