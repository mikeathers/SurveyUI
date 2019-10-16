import React from "react";
import { shallow } from "enzyme";
import InitialPainKillers from "./InitialPainKillers";

const props = {
  painKillers: { standardPainKillers: ["Tablets", "Pills"], other: "" }
};
const wrapper = shallow(<InitialPainKillers {...props} />);

describe("Discharge Survey Initial Pain Killers", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyInitialPainKillers").length).toBe(1);
  });

  it("should add a comma after every painkiller except the last", () => {
    // Assert
    expect(
      wrapper
        .find("#dischargeSurveyInitialPainKiller")
        .first()
        .text()
    ).toBe("Tablets,");

    expect(
      wrapper
        .find("#dischargeSurveyInitialPainKiller")
        .last()
        .text()
    ).toBe("Pills");
  });

  it("should not render the 'Other' section if other pain killers were not received through props", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyOtherPainKillers").length).toBe(0);
  });

  it("should render the 'Other' section if other pain killers have been received through props", () => {
    // Arrange
    const newProps = {
      painKillers: {
        standardPainKillers: ["Tablets", "Pills"],
        other: "Other drugs"
      }
    };
    // Act
    wrapper.setProps(newProps);

    // Assert
    expect(wrapper.find("#dischargeSurveyOtherPainKillers").length).toBe(1);
  });
});
