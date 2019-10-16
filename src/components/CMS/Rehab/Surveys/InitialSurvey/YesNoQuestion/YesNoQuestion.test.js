import React from "react";
import { shallow } from "enzyme";
import YesNoQuestion from "./YesNoQuestion";
import QuestionText from "../../QuestionText/QuestionText";
import { RadioButton } from "components/Common";

const question = {
  id: 1,
  text: "Have you been hurt before?",
  instantKnockOut: true,
  knockoutAnswer: "Yes"
};
const props = {
  question,
  answer: "Yes",
  returnUpdatedQuestion: jest.fn()
};
const wrapper = shallow(<YesNoQuestion {...props} />);

describe("YesNoQuestion", () => {
  it("should render properly", () => {
    // Assert
    expect(wrapper.length).toBe(1);
  });

  it("should render QuestionText", () => {
    // Assert
    expect(wrapper.find(QuestionText).length).toBe(1);
  });

  it("should render two radiobuttons", () => {
    // Assert
    expect(wrapper.find(RadioButton).length).toBe(2);
  });

  it("should render a button with the text of clear", () => {
    // Assert
    expect(wrapper.find("#initialSurveyClearBtn").length).toBe(1);
  });

  it("should allow a checkbox to show as checked when selected", () => {
    // Arrange
    const radio = wrapper.find("#initialSurveyYesRadioBtn");

    // Act
    radio.props().onChange();
    wrapper.update();

    // Assert
    const updatedRadio = wrapper.find("#initialSurveyYesRadioBtn");
    expect(updatedRadio.prop("checked")).toBe(true);
  });

  it("should show both radio buttons as not checked when 'Clear' is clicked", () => {
    // Arrange
    const radio = wrapper.find("#initialSurveyYesRadioBtn");
    radio.props().onChange();
    wrapper.update();

    const selectedRadio = wrapper.find("#initialSurveyYesRadioBtn");
    expect(selectedRadio.prop("checked")).toBe(true);

    // Act
    const clearBtn = wrapper.find("#initialSurveyClearBtn");
    clearBtn.props().onClick();
    wrapper.update();

    // Assert
    const unSelectedRadio = wrapper.find("#initialSurveyYesRadioBtn");
    expect(unSelectedRadio.prop("checked")).toBe(false);
  });

  it("should receive a previously completed question from props and set the right radio button to be checked", () => {
    // Arrange
    const props = {
      question,
      answer: "",
      returnUpdatedQuestion: jest.fn()
    };
    const wrapper = shallow(<YesNoQuestion {...props} />);
    const radio = wrapper.find("#initialSurveyYesRadioBtn");
    expect(radio.prop("checked")).toBe(false);

    // Act
    const newProps = {
      question,
      answer: "Yes",
      returnUpdatedQuestion: jest.fn()
    };
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    const updatedRadio = wrapper.find("#initialSurveyYesRadioBtn");
    expect(updatedRadio.prop("checked")).toBe(true);
  });
});
