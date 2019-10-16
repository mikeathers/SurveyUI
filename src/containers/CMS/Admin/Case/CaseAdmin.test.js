import React from "react";
import { mount } from "enzyme";
import Root from "Root";
import CaseAdmin from "./CaseAdmin";

const wrapper = mount(
  <Root>
    <CaseAdmin />
  </Root>
);

describe("CaseAdmin", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#caseAdmin").first().length).toBe(1);
  });

  it("should render CaseAdminMenu", () => {
    // Assert
    expect(wrapper.find("#caseAdminMenu").first().length).toBe(1);
  });

  it("should show LetterTemplates by default", () => {
    // Assert
    expect(wrapper.find("#letterTemplates").first().length).toBe(1);
  });

  it("should show EmailTemplates and Hide LetterTemplates and StopCaseReasons when the Email Templates button is clicked", () => {
    // Act
    wrapper
      .find("#emailTemplatesBtn")
      .first()
      .props()
      .onClick();

    wrapper.update();

    // Assert
    expect(wrapper.find("#emailTemplates").first().length).toBe(1);
    expect(wrapper.find("#letterTemplates").first().length).toBe(0);
    expect(wrapper.find("#stopCaseReasons").first().length).toBe(0);
  });

  it("should show StopCaseReasons when the Stop Case Reasons button is clicked", () => {
    // Act
    wrapper
      .find("#stopCaseReasonsBtn")
      .first()
      .props()
      .onClick();

    wrapper.update();

    // Assert
    expect(wrapper.find("#emailTemplates").first().length).toBe(0);
    expect(wrapper.find("#letterTemplates").first().length).toBe(0);
    expect(wrapper.find("#stopCaseReasons").first().length).toBe(1);
  });

  it("should show LetterTemplates when the Letter Templates button is clicked", () => {
    // Arrange
    wrapper
      .find("#stopCaseReasonsBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find("#stopCaseReasons").first().length).toBe(1);

    // Act
    wrapper
      .find("#letterTemplatesBtn")
      .first()
      .props()
      .onClick();

    wrapper.update();

    // Assert
    expect(wrapper.find("#emailTemplates").first().length).toBe(0);
    expect(wrapper.find("#letterTemplates").first().length).toBe(1);
    expect(wrapper.find("#stopCaseReasons").first().length).toBe(0);
  });
});
