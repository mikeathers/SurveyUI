import React from "react";
import { shallow } from "enzyme";
import CaseDetails from "./CaseDetails";

const props = {
  courseDuration: 3,
  mi3dCase: {},
  updateMi3dCase: {},
  case: {},
  username: ""
};

const wrapper = shallow(<CaseDetails {...props} />);

describe("CaseDtails", () => {
  // Assert
  it("should render without crashing", () => {
    expect(wrapper.find("#caseDetails").length).toBe(1);
  });

  it("should open UpdateCaseDetailsModal when the Update Course Duration button is clicked", () => {
    // Arrange
    expect(wrapper.find("#updateCaseDetailsModal").prop("isModalOpen")).toBe(
      false
    );

    // Act
    wrapper
      .find("#updateCourseDurationBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#updateCaseDetailsModal").prop("isModalOpen")).toBe(
      true
    );
  });
});
