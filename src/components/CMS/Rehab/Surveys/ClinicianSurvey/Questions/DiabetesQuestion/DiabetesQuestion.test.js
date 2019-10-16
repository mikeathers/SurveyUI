import React from "react";
import { shallow } from "enzyme";
import DiabetesQuestion from "./DiabetesQuestion";

const props = {
  question: {
    questionText: "Do you have diabetes?"
  }
};

const wrapper = shallow(<DiabetesQuestion {...props} />);

describe("DiabetesQuestion", () => {
  it("should render without crashing", () => {
    // Arrange
    expect(wrapper.find("#clinicianSurveyDiabetesQuestion").length).toBe(1);
  });

  it("should render 2 radio buttons", () => {
    // Arrange
    expect(wrapper.find("#clinicianSurveyDiabetesYesRadioBtn").length).toBe(1);
    expect(wrapper.find("#clinicianSurveyDiabetesNoRadioBtn").length).toBe(1);
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
      wrapper.find("#clinicianSurveyDiabetesYesRadioBtn").prop("checked")
    ).toBe(true);
  });

  it("should render a textbox", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyDiabetesTextbox").length).toBe(1);
  });

  it("should display previosuly completed additional info in the additional info textbox when received from props", () => {
    // Arrange
    const newProps = {
      ...props,
      additionalInfo: "Test text"
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#clinicianSurveyDiabetesTextbox").prop("value")).toBe(
      "Test text"
    );
  });
});
