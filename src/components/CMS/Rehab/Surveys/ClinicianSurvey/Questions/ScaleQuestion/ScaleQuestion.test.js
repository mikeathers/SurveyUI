import React from "react";
import { shallow } from "enzyme";
import ScaleQuestion from "./ScaleQuestion";

const props = {
  question: {
    questionText: "On a scale of 1-10 how much pain are you in?"
  },
  painScore: 8,
  returnUpdatedQuestion: jest.fn()
};

const wrapper = shallow(<ScaleQuestion {...props} />);

describe("ScaleQuestion", () => {
  beforeEach(() => {
    wrapper.setState({ slideValue: 0 });
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyScaleQuestion").length).toBe(1);
  });

  it("should render a slider", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyScaleQuestionSlider").length).toBe(1);
  });

  it("should show previously selected slide value when received from props", () => {
    // Arrange
    const newProps = {
      ...props,
      answer: 4
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Arrange
    expect(
      wrapper.find("#clinicianSurveyScaleQuestionSlider").prop("value")
    ).toBe(4);
  });

  it("should show the previous score as text when component mounts", () => {
    // Assert
    expect(
      wrapper.find("#clinicianSurveyScaleQuestionPreviousScore").text()
    ).toBe("Previous Score: 8");
  });

  it("should update the new pain score as text when the slider moves", () => {
    // Arrange
    expect(
      wrapper.find("#clinicianSurveyScaleQuestionCurrentScore").text()
    ).toBe("Current Score: 0");

    // Act
    wrapper.find("#clinicianSurveyScaleQuestionSlider").simulate("change", 3);
    wrapper.update();

    // Assert
    expect(
      wrapper.find("#clinicianSurveyScaleQuestionCurrentScore").text()
    ).toBe("Current Score: 3");
  });
});
