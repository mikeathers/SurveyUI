import React from "react";
import { mount } from "enzyme";
import { DataTable } from "components/Common";

const caseToShow = {
  caseId: 0,
  firstName: "test",
  lastName: "user",
  bluedogCaseRef: "2000145/1",
  instructingPartyName: "Direct Line",
  status: "Awaiting Initial Call"
};
let cases = [];
for (let i = 0; i < 20; i++) {
  caseToShow.caseId = i;
  cases.push(caseToShow);
}
const selectCase = jest.fn();
const showInactive = jest.fn();

const tblProps = {
  list: cases,
  selectRow: selectCase,
  showInactive: showInactive,
  idCol: "caseId",
  cols: [
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
  ]
};
const setup = (props = {}, state = null) => {
  const wrapper = mount(<DataTable {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("DataTable", () => {
  const wrapper = setup(tblProps);

  it("should render without crashing", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should show 10 table rows by default", () => {
    expect(wrapper.find(".tablerow").length).toBe(10);
  });

  it("should show only cases relevent to the search term", () => {
    const newCase = {
      caseId: 0,
      firstName: "Joe",
      lastName: "Bloggs",
      bluedogCaseRef: "2000145/1",
      instructingPartyName: "Direct Line",
      status: "Awaiting Initial Call"
    };

    const newCaseList = [...tblProps.list, newCase];

    const newProps = {
      ...tblProps,
      list: newCaseList
    };

    const updatedWrapper = setup(newProps);
    updatedWrapper.instance().search({ target: { value: "Joe" } });
    updatedWrapper.update();
    expect(updatedWrapper.find(".tablerow").length).toBe(1);
  });

  it("should only show 20 table rows when the 20 row option is selected", () => {
    wrapper.instance().changeItemsPerPage({ target: { value: "20" } });
    wrapper.update();
    expect(wrapper.find(".tablerow").length).toBe(20);
  });
});
