import React from "react";
import { shallow } from "enzyme";
import FollowUpQuestion from "./FollowUpQuestion";

const props = {
  question: {
    questionText: "Are you in pain?"
  }
};

const wrapper = shallow(<FollowUpQuestion {...props} />);

describe("FollowUpQuestion", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyFollowUpQuestion").length).toBe(1);
  });

  it("should render 2 radio buttons", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyFollowUpYesRadioBtn").length).toBe(1);
    expect(wrapper.find("#clinicianSurveyFollowUpNoRadioBtn").length).toBe(1);
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
      wrapper.find("#clinicianSurveyFollowUpYesRadioBtn").prop("checked")
    ).toBe(true);
  });

  it("should render a textbox", () => {
    // Assert
    expect(
      wrapper.find("#clinicianSurveyFollowUpAdditionalInfoTextBox").length
    ).toBe(1);
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
    expect(
      wrapper
        .find("#clinicianSurveyFollowUpAdditionalInfoTextBox")
        .prop("value")
    ).toBe("Test text");
  });
});
