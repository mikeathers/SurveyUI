import React from "react";
import { mount } from "enzyme";
import CaseList from "./CaseList";

const props = {
  callbacks: [
    {
      bluedogCaseRef: "1000/10",
      callBackType: "Initial",
      timeToCall: "20190120",
      createdBy: "Test User",
      createdOn: "20190119",
      caseId: 20,
      key: 1
    }
  ]
};
const wrapper = mount(<CaseList {...props} />);
describe("Call Backs CaseList", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#callBacksCaseList").length).toBe(1);
  });

  it("should render a Datatable", () => {
    // Assert
    expect(wrapper.find("#callBacksDataTable").length).toBe(1);
  });

  it("should render rows when received in from props", () => {
    // Assert
    expect(wrapper.find(".tablerow").length).toBe(1);
  });
});
