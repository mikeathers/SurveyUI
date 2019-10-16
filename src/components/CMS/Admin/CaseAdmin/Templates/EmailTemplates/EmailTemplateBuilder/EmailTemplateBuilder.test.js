import React from "react";
import { shallow } from "enzyme";
import EmailTemplateBuilder from "./EmailTemplateBuilder";

const props = {
  clearSelectedTemplate: jest.fn(0)
};

const wrapper = shallow(<EmailTemplateBuilder {...props} />);

describe("EmailTemplateBuilder", () => {
  beforeEach(() => {
    wrapper.instance().clearValidationErrors();
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#emailTemplateBuilder").length).toBe(1);
  });

  it("should add a validate class to the Template Name textbox when the Save Email Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateNameTextBox")
        .first()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the Subject textbox when the Save Email Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateSubjectTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateSubjectTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the Letter dropdown when the Save Email Template button is clicked and the dropdown is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateLetterDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateLetterDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the Correspondent dropdown when the Save Email Template button is clicked and the dropdown is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateCorrespondentDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateCorrespondentDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should show an error message when the Save Email Template button is clicked and the Template Name textboxe is empty", () => {
    // Arrange
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(false);

    // Act
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(true);
    expect(wrapper.find("#emailBuilderMessage").prop("error")).toBe(true);
  });

  it("should clear the form when the cancel button is clicked", () => {
    // Arrange
    const data = { name: "templateName", value: "Test Template" };
    wrapper
      .find("#emailTemplateBuilderEmailTemplateNameTextBox")
      .simulate("change", null, data);
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateNameTextBox")
        .prop("value")
    ).toBe("Test Template");

    wrapper.update();

    // Act
    wrapper
      .find("#emailTemplateBuilderCancelBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#emailTemplateBuilderEmailTemplateNameTextBox")
        .prop("value")
    ).toBe("");
  });

  it("should clear the error message when the cancel button is clicked", () => {
    // Arrange
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(true);

    // Act
    wrapper
      .find("#emailTemplateBuilderCancelBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(false);
  });

  it("should clear the error message when the Template Name textbox gets typed in", () => {
    // Arrange
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(true);

    // Act
    const data = { name: "templateName", value: "Test Template" };
    wrapper
      .find("#emailTemplateBuilderEmailTemplateNameTextBox")
      .simulate("change", null, data);

    // Assert
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(false);
  });

  it("should clear the error message when the Letter Name dropdown gets changed", () => {
    // Arrange
    wrapper
      .find("#emailTemplateBuilderSaveTemplateBtn")
      .props()
      .onClick();
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(true);

    // Act
    const data = { name: "selectedLetterTemplateId", value: "Test Template" };
    wrapper
      .find("#emailTemplateBuilderEmailTemplateLetterDropdown")
      .simulate("change", null, data);

    // Assert
    expect(wrapper.find("#emailBuilderMessage").prop("show")).toBe(false);
  });
});
