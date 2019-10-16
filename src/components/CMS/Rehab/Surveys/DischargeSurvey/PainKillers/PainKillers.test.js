import React from "react";
import { shallow } from "enzyme";
import PainKillers from "./PainKillers";

const props = {
  currentPainKillers: {
    standardPainKillers: ["Tablets", "Pills"]
  }
};
const wrapper = shallow(<PainKillers {...props} />);

describe("Discharge Survey Pain Killers", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyPainKillers").length).toBe(1);
  });

  it("should render the InitialPainKillers components", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyInitialPainKillers").length).toBe(1);
  });

  it("should render the InitialPainKillers components", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyCurrentPainKillers").length).toBe(1);
  });
});
