import React from "react";
import { shallow } from "enzyme";
import VAS from "./VAS";

const props = {
  painScores: [
    { bodyPart: "Head", painScore: 7 },
    { bodyPart: "Shoulder", painScore: 4 }
  ]
};

const wrapper = shallow(<VAS {...props} />);

describe("VAS", () => {
  it("should render without crashing", () => {
    // Asssert
    expect(wrapper.find("#soapSurveyVAS").length).toBe(1);
  });

  it("should render a list of VAS scores when received in through props", () => {
    // Assert
    expect(wrapper.find("#soapSurveyVASScore").length).toBe(2);
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
    expect(wrapper.find("#soapSurveyVAS").prop("disabled")).toBe(true);
  });

  it("should render the pain scores div when the survey has been completed", () => {
    // Arrange
    const newProps = {
      ...props,
      surveyComplete: false,
      completedPainScores: []
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#soapSurveyVASScores").length).toBe(1);
    expect(wrapper.find("#soapSurveyCompletedVASScores").length).toBe(0);
  });

  it("should render the completed pain scores div when the survey has been completed", () => {
    // Arrange
    const newProps = {
      ...props,
      surveyComplete: true,
      completedPainScores: [
        { currentPainScore: 1, initialPainScore: 10, bodyPart: "Knee" }
      ]
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#soapSurveyVASScores").length).toBe(0);
    expect(wrapper.find("#soapSurveyCompletedVASScores").length).toBe(1);
  });

  it("should render the current pain score as a label when received in through props", () => {
    // Arrange
    // Act
    // Assert
  });
});
