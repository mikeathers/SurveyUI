import React from "react";
import { mount } from "enzyme";
import CaseList from "./CaseList";

const props = {
  chases: [
    {
      bluedogCaseRef: "1000/10",
      chaseDate: "20190120",
      caseId: 20,
      key: 1
    }
  ]
};
const wrapper = mount(<CaseList {...props} />);
describe("Chases CaseList", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#chasesCaseList").length).toBe(1);
  });

  it("should render a Datatable", () => {
    // Assert
    expect(wrapper.find("#chasesDataTable").length).toBe(1);
  });

  it("should render rows when received in from props", () => {
    // Assert
    expect(wrapper.find(".tablerow").length).toBe(1);
  });
});
