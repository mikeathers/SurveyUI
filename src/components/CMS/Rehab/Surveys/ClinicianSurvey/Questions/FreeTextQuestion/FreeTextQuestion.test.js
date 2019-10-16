import React from "react";
import { shallow } from "enzyme";
import FreeTextQuestion from "./FreeTextQuestion";

const props = {
  question: { questionText: "How do you relieve your symptoms?" }
};
const wrapper = shallow(<FreeTextQuestion {...props} />);

describe("FreeTextQuestion", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyFreeTextQuestion").length).toBe(1);
  });

  it("should render a textbox", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyFreeTextTextBox").length).toBe(1);
  });

  it("should display previously completed answer when received from props", () => {
    // Arrange
    const newProps = {
      ...props,
      answer: "I have a massage"
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#clinicianSurveyFreeTextTextBox").prop("value")).toBe(
      "I have a massage"
    );
  });
});
