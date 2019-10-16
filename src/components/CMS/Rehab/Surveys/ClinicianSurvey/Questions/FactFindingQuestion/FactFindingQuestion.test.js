import React from "react";
import { shallow } from "enzyme";
import FactFindingQuestion from "./FactFindingQuestion";

const props = {
  question: {
    questionText: "Are you in pain?"
  }
};
const wrapper = shallow(<FactFindingQuestion {...props} />);

describe("FactFindingQuestion", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyFactFindingQuestion").length).toBe(1);
  });

  it("should render 2 radio buttons", () => {
    // Arrange
    expect(wrapper.find("#clinicianSurveyFactFindingYesRadioBtn").length).toBe(
      1
    );
    expect(wrapper.find("#clinicianSurveyFactFindingNoRadioBtn").length).toBe(
      1
    );
  });

  it("should display previously completed answer when received from props", () => {
    // Arrange
    const newProps = {
      question: {
        questionText: "Are you in pain?"
      },
      answer: "Yes"
    };
    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(
      wrapper.find("#clinicianSurveyFactFindingYesRadioBtn").prop("checked")
    ).toBe(true);
  });

  it("should render a textbox", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyFactFindingTextBox").length).toBe(1);
  });

  it("should display previosuly completed answer in the textbox when received from props", () => {
    // Arrange
    const newProps = {
      ...props,
      additionalInfo: "Test text"
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(
      wrapper.find("#clinicianSurveyFactFindingTextBox").prop("value")
    ).toBe("Test text");
  });
});
