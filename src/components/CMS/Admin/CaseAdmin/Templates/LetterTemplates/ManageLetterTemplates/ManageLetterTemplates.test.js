import React from "react";
import { shallow } from "enzyme";
import ManageLetterTemplates from "./ManageLetterTemplates";

const wrapper = shallow(<ManageLetterTemplates />);

describe("ManageLetterTemplates", () => {
  beforeEach(() => {
    wrapper.instance().clearForm();
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#manageLetterTemplates").length).toBe(1);
  });

  it("should render a Modal", () => {
    // Assert
    expect(wrapper.find("#manageLetterTemplatesRemoveModal").length).toBe(1);
  });

  it("should add a validate class to the Letter Templates dropdown when the Update Letter Template button is clicked and the dropdown is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplatesDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplatesDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the Template Name textbox when the Update Letter Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplateNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplateNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the File Name textbox when the Update Letter Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#manageLetterTemplatesFileNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#manageLetterTemplatesFileNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should show an error message when the Update Letter Template button is clicked and the Template Name and File Name textboxes are empty", () => {
    // Arrange
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      false
    );

    // Act
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      true
    );
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("error")).toBe(
      true
    );
  });

  it("should add a validate class to the Letter Templates dropdown when the Update Letter Template button is clicked and the dropdown is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplatesDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplatesDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the Template Name textbox when the Remove Letter Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplateNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#manageLetterTemplatesRemoveBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#manageLetterTemplatesTemplateNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add a validate class to the File Name textbox when the Remove Letter Template button is clicked and the textbox is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#manageLetterTemplatesFileNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#manageLetterTemplatesRemoveBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper
        .find("#manageLetterTemplatesFileNameTextBox")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should show an error message when the Remove Letter Template button is clicked and the Template Name and File Name textboxes are empty", () => {
    // Arrange
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      false
    );

    // Act
    wrapper
      .find("#manageLetterTemplatesRemoveBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      true
    );
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("error")).toBe(
      true
    );
  });

  it("should clear the form when the cancel button is clicked", () => {
    // Arrange
    wrapper
      .find("#manageLetterTemplatesTemplateNameTextBox")
      .simulate("change", {
        target: { name: "selectedTemplateName", value: "Test Template" }
      });

    expect(
      wrapper.find("#manageLetterTemplatesTemplateNameTextBox").prop("value")
    ).toBe("Test Template");

    wrapper.setState({ fileName: "Test File" });
    wrapper.update();

    expect(
      wrapper.find("#manageLetterTemplatesFileNameTextBox").prop("value")
    ).toBe("Test File");

    // Act
    wrapper
      .find("#manageLetterTemplatesCancelBtn")
      .props()
      .onClick();

    // Assert
    expect(
      wrapper.find("#manageLetterTemplatesTemplateNameTextBox").prop("value")
    ).toBe("");

    expect(
      wrapper.find("#manageLetterTemplatesFileNameTextBox").prop("value")
    ).toBe("");
  });

  it("should clear the error message when the cancel button is clicked", () => {
    // Arrange
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      true
    );

    // Act
    wrapper
      .find("#manageLetterTemplatesCancelBtn")
      .props()
      .onClick();

    // Assert
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      false
    );
  });

  it("should clear the error message when the Template Name textbox gets typed in", () => {
    // Arrange
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      true
    );

    // Act
    wrapper
      .find("#manageLetterTemplatesTemplateNameTextBox")
      .simulate("change", {
        target: { name: "templateName", value: "Test Template" }
      });

    // Assert
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      false
    );
  });

  it("should clear the error message when a file has been selected", () => {
    // Arrange
    wrapper
      .find("#manageLetterTemplatesUpdateBtn")
      .props()
      .onClick();
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      true
    );

    // Act
    wrapper
      .instance()
      .handleSelectFile({ target: { files: [{ name: "test" }] } });

    // Assert
    expect(wrapper.find("#manageLetterTemplatesMessage").prop("show")).toBe(
      false
    );
  });
});
