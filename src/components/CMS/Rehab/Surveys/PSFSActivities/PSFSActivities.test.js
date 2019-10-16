import React from "react";
import { shallow } from "enzyme";
import PSFSActivities from "./PSFSActivities";

const props = {
  surveyComplete: false,
  psfsActivities: [
    {
      painScore: 5,
      activity: "Walking",
      initialScoreDate: "2019-07-11T12:50:48.848"
    },
    {
      painScore: 7,
      activity: "Jogging",
      initialScoreDate: "2019-07-11T12:50:48.848"
    }
  ]
};

const wrapper = shallow(<PSFSActivities {...props} />);

describe("SOAP Survey PSFS Activities", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#soapSurveyPSFSActivities").length).toBe(1);
  });

  it("should render a list of PSFS Activities", () => {
    // Assert
    expect(wrapper.find("#soapSurveyPSFSActivityContent").length).toBe(2);
  });

  it("should render Initial Score Date as DD/MM/YYYY format", () => {
    // Assert
    expect(
      wrapper
        .find("#soapSurveyPSFSInitialScoreDate")
        .first()
        .text()
    ).toBe("11/07/2019");
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
    expect(wrapper.find("#soapSurveyPSFSActivities").prop("disabled")).toBe(
      true
    );
  });

  it("should render the completed psfs activities div when surveyComplete is true", () => {
    // Arrange
    const newProps = {
      ...props,
      surveyComplete: true,
      completedPsfsActivities: [
        {
          activity: "Walking",
          initialPainScore: 10,
          currentPainScore: 4,
          initialScoreDate: "2019-07-11T12:50:48.848"
        }
      ]
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#soapSurveyPSFSActivityContainer").length).toBe(0);
    expect(
      wrapper.find("#soapSurveyCompletedPSFSActivityContainer").length
    ).toBe(1);
  });

  it("should render the psfs activities div when surveyComplete is false", () => {
    // Arrange
    const newProps = {
      ...props,
      surveyComplete: false,
      completedPsfsActivities: []
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#soapSurveyPSFSActivityContainer").length).toBe(1);
    expect(
      wrapper.find("#soapSurveyCompletedPSFSActivityContainer").length
    ).toBe(0);
  });
});
