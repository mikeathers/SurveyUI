import React from "react";
import { shallow } from "enzyme";
import Actions from "./Actions";

const props = {
  checkIfSurveyCanBeAnswered: jest.fn(),
  surveyNotComplete: true
};

const wrapper = shallow(<Actions {...props} />);

describe("ClinicianSurveyActions", () => {
  beforeEach(() => {
    wrapper.setState({ followUpToDisplay: "followUpOne" });
  });

  it("should render without crashing", () => {
    // Arrange
    expect(wrapper.find("#clinicianSurveyActions").length).toBe(1);
  });

  it("should render FollowUp1 as the initial followup", () => {
    // Assert
    expect(wrapper.find("#followUpOne").length).toBe(1);
  });

  it("should render the correct FollowUp when a followUp is received via props", () => {
    // Arrange
    expect(wrapper.find("#followUpOne").length).toBe(1);

    // Act
    wrapper.setProps({ followUpToDisplay: "followUpTwo" });
    wrapper.update();

    // Assert
    expect(wrapper.find("#followUpOne").length).toBe(0);
    expect(wrapper.find("#followUpTwo").length).toBe(1);
  });

  it("should render followUpOneBtns by default", () => {
    // Assert
    expect(wrapper.find("#followUpOneBtns").length).toBe(1);
  });

  it("should render the correct FollowUpBtns when a followUp is received via props", () => {
    // Arrange
    expect(wrapper.find("#followUpOneBtns").length).toBe(1);

    // Act
    wrapper.setProps({ followUpToDisplay: "followUpTwo" });
    wrapper.update();

    // Assert
    expect(wrapper.find("#followUpOneBtns").length).toBe(0);
    expect(wrapper.find("#followUpTwoBtns").length).toBe(1);
  });

  it("should render the Complete Survey button as disabled by default", () => {
    // Assert
    expect(
      wrapper.find("#clinicianSurveyCompleteSurveyBtn").prop("disabled")
    ).toBe(true);
  });

  it("should render the Complete Survey button as enabled when surveyNotComplete equals true, received via props", () => {
    // Arrange
    const newProps = {
      ...props,
      surveyNotComplete: false
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(
      wrapper.find("#clinicianSurveyCompleteSurveyBtn").prop("disabled")
    ).toBe(false);
  });
});
