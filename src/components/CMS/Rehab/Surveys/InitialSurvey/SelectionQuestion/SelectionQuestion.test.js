import React from "react";
import { shallow } from "enzyme";
import SelectionQuestion from "./SelectionQuestion";
import QuestionText from "../../QuestionText/QuestionText";
import { Checkbox } from "components/Common";

const options = ["Head", "Neck", "Right Shoulder", "Left Shoulder"];
const question = {
  id: 1,
  text: "Which areas hurt?",
  options
};
const props = { question, returnUpdatedQuestion: jest.fn() };
const wrapper = shallow(<SelectionQuestion {...props} />);

describe("SelectionQuestion", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.length).toBe(1);
  });

  it("should render QuestionText", () => {
    // Assert
    expect(wrapper.find(QuestionText).length).toBe(1);
  });

  it("should render 4 Checkboxes", () => {
    // Assert
    expect(wrapper.find(Checkbox).length).toBe(4);
  });

  it("should show a checkbox as checked when selected", () => {
    // Assert
    const headCheckbox = wrapper.find(
      "#initialSurveySelectionQuestionCheckbox1"
    );

    // Act
    headCheckbox.simulate("change", "Head");
    wrapper.update();

    // Assert
    const updatedHeadCheckbox = wrapper.find(
      "#initialSurveySelectionQuestionCheckbox1"
    );
    expect(updatedHeadCheckbox.prop(""));
  });

  it("should accept completed question from compoenentWillReceieveProps and select the right checkboxes", () => {
    // Arrange
    const props = {
      question,
      answer: [],
      returnUpdatedQuestion: jest.fn()
    };
    const wrapper = shallow(<SelectionQuestion {...props} />);

    const headCheckbox = wrapper.find(
      "#initialSurveySelectionQuestionCheckbox1"
    );

    expect(headCheckbox.prop("checked")).toBe(false);

    // Act
    const newProps = {
      question,
      answer: ["Head"],
      returnUpdatedQuestion: jest.fn()
    };

    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    const updatedHeadCheckbox = wrapper.find(
      "#initialSurveySelectionQuestionCheckbox1"
    );
    expect(updatedHeadCheckbox.prop("checked")).toBe(true);
  });

  it("should clear selected values when the Clear button is clicked", () => {
    // Arrange
    const props = {
      question,
      answer: ["Head"],
      returnUpdatedQuestion: jest.fn()
    };
    const wrapper = shallow(<SelectionQuestion {...props} />);
    wrapper.setProps({ ...props });

    const clearButton = wrapper.find("#initialSurveySelectionQuestionClearBtn");
    const headCheckbox = wrapper.find(
      "#initialSurveySelectionQuestionCheckbox1"
    );
    expect(headCheckbox.prop("checked")).toBe(true);

    // Act
    clearButton.props().onClick();
    wrapper.update();

    // Assert
    const clearedHeadCheckbox = wrapper.find(
      "#initialSurveySelectionQuestionCheckbox1"
    );
    expect(clearedHeadCheckbox.prop("checked")).toBe(false);
  });
});
