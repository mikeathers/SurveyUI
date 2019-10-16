import React from "react";
import { shallow } from "enzyme";
import PainKillers from "./PainKillers";

const props = {
  currentPainKillers: {
    standardPainKillers: ["Tablets", "Pills"]
  }
};

const wrapper = shallow(<PainKillers {...props} />);

describe("PainKillers", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#soapSurveyPainKillers").length).toBe(1);
  });

  it("should render a list of pain killers when received in through props", () => {
    // Assert
    expect(wrapper.find("#soapSurveyPainKiller").length).toBe(2);
  });

  it("should add a comma after every pain killer except the last one", () => {
    // Assert
    expect(
      wrapper
        .find("#soapSurveyPainKiller")
        .first()
        .text()
    ).toBe("Tablets,");

    expect(
      wrapper
        .find("#soapSurveyPainKiller")
        .last()
        .text()
    ).toBe("Pills");
  });

  it("should show other pain killers when received in through props", () => {
    // Arrange
    const newProps = {
      currentPainKillers: {
        standardPainKillers: ["Tablets", "Pills"],
        other: "Lots of other drugs"
      }
    };
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#soapSurveyOtherPainKillers").length).toBe(1);
  });

  it("should not show other when not received in through props", () => {
    // Arrange
    const newProps = {
      currentPainKillers: {
        standardPainKillers: ["Tablets", "Pills"],
        other: ""
      }
    };
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#soapSurveyOtherPainKillers").length).toBe(0);
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
    expect(wrapper.find("#soapSurveyPainKillers").prop("disabled")).toBe(true);
  });
});
