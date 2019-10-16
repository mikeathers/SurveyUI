import React from "react";
import { shallow } from "enzyme";
import DropdownQuestion from "./DropdownQuestion";

const props = {
  question: {
    questionText: "How would you describe the pain?"
  }
};

const wrapper = shallow(<DropdownQuestion {...props} />);

describe("Dropdown Question", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyDropdownQuestion").length).toBe(1);
  });

  it("should render a textbox", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyDropdownTextBox").length).toBe(1);
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
    expect(wrapper.find("#clinicianSurveyDropdownTextBox").prop("value")).toBe(
      "Test text"
    );
  });

  it("should display previosuly completed dropdown answer in the dropdown when received from props", () => {
    // Arrange
    const newProps = {
      ...props,
      dropdownAnswer: "Dull Ache"
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#clinicianSurveyDropdownDropdown").prop("value")).toBe(
      "Dull Ache"
    );
  });
});
