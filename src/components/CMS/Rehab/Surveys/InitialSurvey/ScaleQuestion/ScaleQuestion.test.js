import React from "react";
import { shallow } from "enzyme";
import ScaleQuestion from "./ScaleQuestion";
import QuestionText from "../../QuestionText/QuestionText";

const props = {
  returnUpdatedQuestion: jest.fn()
};
const wrapper = shallow(<ScaleQuestion {...props} />);

describe("ScaleQuestion", () => {
  it("should render properly", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should render QuestionText", () => {
    expect(wrapper.find(QuestionText).length).toBe(1);
  });

  it("should show the value text with a starting value of 0", () => {
    const valueText = wrapper.find("#initialSurveyScaleQuestionValueText");
    expect(valueText.text()).toBe("0");
  });

  it("should update the value text when the slider moves", () => {
    // Arrange
    const slider = wrapper.find("#initialSurveyScaleQuestionSlider");

    const valueText = wrapper.find("#initialSurveyScaleQuestionValueText");
    expect(valueText.text()).toBe("0");

    // Act
    slider.simulate("change", 5);
    wrapper.update();

    // Assert
    const updatedValueText = wrapper.find(
      "#initialSurveyScaleQuestionValueText"
    );
    expect(updatedValueText.text()).toBe("5");
  });

  it("should set the slider back to 0 when 'Clear' is selected", () => {
    // Arrange
    const slider = wrapper.find("#initialSurveyScaleQuestionSlider");
    slider.simulate("change", 5);
    wrapper.update();

    const sliderWithValue = wrapper.find("#initialSurveyScaleQuestionSlider");
    expect(sliderWithValue.props().value).toBe(5);

    // Act
    const clearBtn = wrapper.find("#initialSurveyScaleQuestionClearBtn");
    clearBtn.props().onClick();
    wrapper.update();

    // Assert
    const clearedSlider = wrapper.find("#initialSurveyScaleQuestionSlider");
    expect(clearedSlider.props().value).toBe(0);
  });

  it("should set the value text back to 0 when 'Clear' is selected", () => {
    // Arrange
    const slider = wrapper.find("#initialSurveyScaleQuestionSlider");
    slider.simulate("change", 5);
    wrapper.update();

    const textValue = wrapper.find("#initialSurveyScaleQuestionValueText");
    expect(textValue.text()).toBe("5");

    // Act
    const clearBtn = wrapper.find("#initialSurveyScaleQuestionClearBtn");
    clearBtn.props().onClick();
    wrapper.update();

    // Assert
    const clearedTextValue = wrapper.find(
      "#initialSurveyScaleQuestionValueText"
    );
    expect(clearedTextValue.text()).toBe("0");
  });

  it("should receive a previously completed question from props and set the slider to the correct value", () => {
    // Arrange
    const props = {
      question: { id: 1, text: "On a scale of 1 to 10?" },
      answer: 5
    };
    const wrapper = shallow(<ScaleQuestion {...props} />);

    // Assert
    expect(
      wrapper.find("#initialSurveyScaleQuestionSlider").prop("value")
    ).toBe(5);
  });
});
