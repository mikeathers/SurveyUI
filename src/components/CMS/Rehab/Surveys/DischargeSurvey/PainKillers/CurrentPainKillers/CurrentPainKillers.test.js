import React from "react";
import { shallow } from "enzyme";
import CurrentPainKillers from "./CurrentPainKillers";

const wrapper = shallow(<CurrentPainKillers />);

describe("Discharge Survey CurrentPainKillers", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyCurrentPainKillers").length).toBe(1);
  });

  it("should render Painkillers list component", () => {
    expect(wrapper.find("#dischargeSurveyCurrentPainKillerList").length).toBe(
      1
    );
  });
});
