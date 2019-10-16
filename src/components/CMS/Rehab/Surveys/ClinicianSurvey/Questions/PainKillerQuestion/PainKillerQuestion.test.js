import React from "react";
import { shallow } from "enzyme";
import PainKillerQuestion from "./PainKillerQuestion";
import { Checkbox } from "components/Common";

const props = {
  question: {
    options: ["Paracetemol", "Ibprofen"]
  },
  returnUpdatedQuestion: jest.fn()
};

const wrapper = shallow(<PainKillerQuestion {...props} />);

describe("PainKillerQuestion", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyPainKillerQuestion").length).toBe(1);
  });

  it("should render a list of checkboxes for each painkiller", () => {
    // Assert
    expect(wrapper.find(Checkbox).length).toBe(2);
  });

  it("should show a checkbox as checked when clicked on", () => {
    // Act
    wrapper
      .find(Checkbox)
      .first()
      .simulate("change", "Ibprofen");
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find(Checkbox)
        .first()
        .prop("checked")
    ).toBe(true);
  });

  it("should render a textbox", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyPainKillersTextBox").length).toBe(1);
  });

  it("should check the correct boxes from a previously completed question when received from props", () => {
    // Arrange
    const newProps = {
      ...props,
      answer: ["Mid Back", "Hip"]
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#clinicianSurveyPainKillerCheckbox_MidBack"));
  });

  it("should display the additional info text in the additional info textbox when receied from props", () => {
    // Arrange
    const newProps = {
      ...props,
      additionalInfo: "some other crazy pain killer"
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(
      wrapper.find("#clinicianSurveyPainKillersTextBox").prop("value")
    ).toBe("some other crazy pain killer");
  });
});
