import React from "react";
import { shallow } from "enzyme";
import CaseCompletion from "./CaseCompletion";

const props = {
  returnInjuredPartyCompliant: jest.fn(),
  returnInjuredPartyClosingStatement: jest.fn(),
  returnClosingSummary: jest.fn(),
  checkIfVASIsValid: jest.fn(),
  checkIfPSFSIsValid: jest.fn(),
  checkIfPainKillersValid: jest.fn()
};

const wrapper = shallow(<CaseCompletion {...props} />);

describe("Discharge Survey", () => {
  beforeEach(() => {
    wrapper.setState({
      selectedAnswer: "Yes",
      closingSummary: "",
      showMessage: false,
      errorMessage: false,
      message: ""
    });
  });
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyCaseCompletion").length).toBe(1);
  });

  it("should hide the closing statement if the unable to contact injured party radio has been checked", () => {
    // Arrange
    expect(wrapper.find("#dischargeSurveyClosingStatement").length).toBe(1);

    // Act
    wrapper
      .find("#dischargeSurveyNoRadioBtn")
      .props()
      .onChange();

    // Assert
    expect(wrapper.find("#dischargeSurveyClosingStatement").length).toBe(0);
  });

  it("should add a validation css class to closing summary textbox if the survey is submitted and the closing summary textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#dischargeSurveyClosingSummaryTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#dischargeSurveySubmitBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#dischargeSurveyClosingSummaryTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should remove the validation css class from the closing summary textbox if the textbox gets typed in", () => {
    // Arrange
    wrapper
      .find("#dischargeSurveySubmitBtn")
      .props()
      .onClick();

    expect(
      wrapper
        .find("#dischargeSurveyClosingSummaryTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);

    // Act
    wrapper
      .find("#dischargeSurveyClosingSummaryTextBox")
      .simulate("change", null, { name: "closingSummary", value: "test" });

    // Assert
    expect(
      wrapper
        .find("#dischargeSurveyClosingSummaryTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);
  });

  it("should show a validation message when the survey is submitted and the closing summary textbox is empty", () => {
    // Arrange
    wrapper
      .find("#dischargeSurveySubmitBtn")
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(wrapper.find("#dischargeSurveyValidationMessage").prop("show")).toBe(
      true
    );
  });

  it("should hide the validation message when the closing summary textbox gets typed in", () => {
    // Arrange
    wrapper
      .find("#dischargeSurveySubmitBtn")
      .props()
      .onClick();
    expect(wrapper.find("#dischargeSurveyValidationMessage").prop("show")).toBe(
      true
    );

    // Act
    wrapper
      .find("#dischargeSurveyClosingSummaryTextBox")
      .simulate("change", null, { name: "closingSummary", value: "test" });
    wrapper.update();

    // Assert
    expect(wrapper.find("#dischargeSurveyValidationMessage").prop("show")).toBe(
      false
    );
  });
});
