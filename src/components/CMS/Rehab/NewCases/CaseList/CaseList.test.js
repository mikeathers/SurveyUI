import React from "react";
import { mount } from "enzyme";
import CaseList from "./CaseList";

const props = {
  cases: [
    {
      firstName: "Test",
      lastName: "User",
      bluedogCaseRef: "1000/10",
      instructingPartyName: "DLI",
      status: "Active"
    }
  ]
};
const wrapper = mount(<CaseList {...props} />);
describe("New Cases CaseList", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#newCasesCaseList").length).toBe(1);
  });

  it("should render a Datatable", () => {
    // Assert
    expect(wrapper.find("#newCasesDataTable").length).toBe(1);
  });

  it("should render rows when received in from props", () => {
    // Assert
    expect(wrapper.find(".tablerow").length).toBe(1);
  });
});
