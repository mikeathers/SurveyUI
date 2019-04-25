import React, { Component } from "react";

import { DataTable } from "components/Common";

import "./CaseList.scss";

export default class CaseList extends Component {
  render() {
    const { cases, selectCase } = this.props;
    return (
      <DataTable
        list={cases}
        selectRow={selectCase}
        showInactive={this.showInactive}
        idCol="bluedogCaseRef"
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
          // { value: "stage", title: "Stage", sortable: false },
          { value: "status", title: "Status", sortable: false }
        ]}
      />
    );
  }
}
