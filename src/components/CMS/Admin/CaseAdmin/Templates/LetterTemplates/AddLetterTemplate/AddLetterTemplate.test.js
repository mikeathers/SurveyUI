import React from "react";
import { shallow } from "enzyme";
import AddLetterTemplate from "./AddLetterTemplate";

const wrapper = shallow(<AddLetterTemplate />);

describe("AddLetterTemplate", () => {
  beforeEach(() => {
    wrapper.instance().clearForm();
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#addLetterTemplate").length).toBe(1);
  });

  it("should add a validate class to the Template Name textbox when the Add Letter Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#addLetterTemplateTemplateNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#addLetterTemplateAddBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#addLetterTemplateTemplateNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the File Name textbox when the Add Letter Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#addLetterTemplateFileNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#addLetterTemplateAddBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#addLetterTemplateFileNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should show an error message when the Add Letter Template button is clicked and the Template Name and File Name textboxes are empty", () => {
    // Arrange
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(false);

    // Act
    wrapper
      .find("#addLetterTemplateAddBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(true);
    expect(wrapper.find("#addLetterTemplateMessage").prop("error")).toBe(true);
  });

  it("should clear the form when the cancel button is clicked", () => {
    // Arrange
    wrapper.find("#addLetterTemplateTemplateNameTextBox").simulate("change", {
      target: { name: "templateName", value: "Test Template" }
    });
    expect(
      wrapper.find("#addLetterTemplateTemplateNameTextBox").prop("value")
    ).toBe("Test Template");

    wrapper.setState({ fileName: "Test File" });
    wrapper.update();

    expect(
      wrapper.find("#addLetterTemplateFileNameTextBox").prop("value")
    ).toBe("Test File");

    // Act
    wrapper
      .find("#addLetterTemplateCancelBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper.find("#addLetterTemplateTemplateNameTextBox").prop("value")
    ).toBe("");

    expect(
      wrapper.find("#addLetterTemplateFileNameTextBox").prop("value")
    ).toBe("");
  });

  it("should clear the error message when the cancel button is clicked", () => {
    // Arrange
    wrapper
      .find("#addLetterTemplateAddBtn")
      .props()
      .onClick();
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(true);

    // Act
    wrapper
      .find("#addLetterTemplateCancelBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(false);
  });

  it("should clear the error message when the Template Name textbox gets typed in", () => {
    // Arrange
    wrapper
      .find("#addLetterTemplateAddBtn")
      .props()
      .onClick();
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(true);

    // Act
    wrapper.find("#addLetterTemplateTemplateNameTextBox").simulate("change", {
      target: { name: "templateName", value: "Test Template" }
    });

    // Assert
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(false);
  });

  it("should clear the error message when the a file has been selected", () => {
    // Arrange
    wrapper
      .find("#addLetterTemplateAddBtn")
      .props()
      .onClick();
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(true);

    // Act
    wrapper.instance().onSelectFile({ target: { files: [{ name: "test" }] } });

    // Assert
    expect(wrapper.find("#addLetterTemplateMessage").prop("show")).toBe(false);
  });
});
