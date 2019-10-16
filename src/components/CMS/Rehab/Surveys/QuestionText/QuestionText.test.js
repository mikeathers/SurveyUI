import React from "react";
import { shallow } from "enzyme";
import QuestionText from "./QuestionText";

describe("QuestionText", () => {
  it("should render properly", () => {
    const wrapper = shallow(<QuestionText />);
    expect(wrapper.length).toBe(1);
  });

  it("should apply answered css class to number element when 'answered = true' received from props", () => {
    // Arrange
    const props = { answered: true };
    const wrapper = shallow(<QuestionText {...props} />);
    const numberElement = wrapper.find("#surveyQuestionTextIndex");

    // Assert
    expect(numberElement.hasClass("question-text__number--answered")).toBe(
      true
    );
  });

  it("should remove answered css class from number element when 'answered = false' received from props ", () => {
    // Arrange
    const props = { answered: false };
    const wrapper = shallow(<QuestionText {...props} />);
    const numberElement = wrapper.find("#surveyQuestionTextIndex");

    // Assert
    expect(numberElement.hasClass("question-text__number--answered")).toBe(
      false
    );
  });

  it("should render the question text correctly from props", () => {
    // Arrange
    const props = {
      answered: false,
      questionText: "How much pain are you in?",
      index: 1
    };
    const wrapper = shallow(<QuestionText {...props} />);

    // Assert
    expect(wrapper.find("#surveyQuestionTextText").text()).toBe(
      props.questionText
    );
  });

  it("should render the question index correctly from props", () => {
    // Arrange
    const props = {
      answered: false,
      questionText: "How much pain are you in?",
      index: 1
    };
    const wrapper = shallow(<QuestionText {...props} />);

    // Assert
    expect(wrapper.find("#surveyQuestionTextIndex").text()).toBe(
      props.index.toString()
    );
  });
});
