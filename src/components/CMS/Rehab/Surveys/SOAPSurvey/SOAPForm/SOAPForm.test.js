import React from "react";
import { shallow } from "enzyme";
import SOAPForm from "./SOAPForm";

const props = {
  soapSurvey: {
    subjectiveText: "hello"
  },
  checkIfVASIsValid: jest.fn(),
  checkIfPSFSIsValid: jest.fn(),
  checkIfPainKillersValid: jest.fn()
};

const wrapper = shallow(<SOAPForm {...props} />);

describe("SOAPForm", () => {
  beforeEach(() => {
    wrapper.instance().clearForm();
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#soapForm").length).toBe(1);
  });

  it("should display text in the subjective textbox when received in from props", () => {
    // Arrange
    const newProps = {
      ...props,
      soapSurvey: {
        subjectiveText: "hello again"
      }
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#soapSurveySubjectiveTextBox").prop("value")).toBe(
      newProps.soapSurvey.subjectiveText
    );
  });

  it("should display text in the objective textbox when received in from props", () => {
    // Arrange
    const newProps = {
      ...props,
      soapSurvey: {
        objectiveText: "hello again"
      }
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#soapSurveyObjectiveTextBox").prop("value")).toBe(
      newProps.soapSurvey.objectiveText
    );
  });

  it("should display text in the analysis textbox when received in from props", () => {
    // Arrange
    const newProps = {
      ...props,
      soapSurvey: {
        analysisText: "hello again"
      }
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#soapSurveyAnalysisTextBox").prop("value")).toBe(
      newProps.soapSurvey.analysisText
    );
  });

  it("should display text in the plan textbox when received in from props", () => {
    // Arrange
    const newProps = {
      ...props,
      soapSurvey: {
        planText: "hello again"
      }
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#soapSurveyPlanTextBox").prop("value")).toBe(
      newProps.soapSurvey.planText
    );
  });

  it("should add a validation css class to the subjective textbox when the form is submitted and the textbox is empty", () => {
    // Arrange
    wrapper
      .find("#soapSurveySubmitBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#soapSurveySubjectiveTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validation css class to the objective textbox when the form is submitted and the textbox is empty", () => {
    // Arrange
    wrapper
      .find("#soapSurveySubmitBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#soapSurveyObjectiveTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validation css class to the analysis textbox when the form is submitted and the textbox is empty", () => {
    // Arrange
    wrapper
      .find("#soapSurveySubmitBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#soapSurveyAnalysisTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validation css class to the plan textbox when the form is submitted and the textbox is empty", () => {
    // Arrange
    wrapper
      .find("#soapSurveySubmitBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#soapSurveyPlanTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should show a validation waring message when the form is submitted and one of the textboxes are empty", () => {
    // Arrange
    expect(wrapper.find("#soapSurveyMessage").prop("show")).toBe(false);

    wrapper
      .find("#soapSurveySubmitBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#soapSurveyMessage").prop("show")).toBe(true);
  });

  it("should remove the validation warning message when a textbox on the form gets typed in", () => {
    // Arrange
    wrapper
      .find("#soapSurveySubmitBtn")
      .props()
      .onClick();
    expect(wrapper.find("#soapSurveyMessage").prop("show")).toBe(true);

    // Act
    const data = { name: "subjectiveText", value: "test" };
    wrapper.find("#soapSurveySubjectiveTextBox").simulate("change", null, data);
    wrapper.update();

    // Assert
    expect(wrapper.find("#soapSurveyMessage").prop("show")).toBe(false);
  });

  it("should render as disabled if a completed SOAP Survey has been receieved in from props", () => {
    // Arrange
    const newProps = {
      ...props,
      surveyComplete: true
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#soapForm").prop("disabled")).toBe(true);
  });
});
