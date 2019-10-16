import React from "react";
import { mount } from "enzyme";
import { AddStopCaseReason } from "./AddStopCaseReason";

const wrapper = mount(<AddStopCaseReason />);

describe("AddStopCaseReason", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.length).toBe(1);
  });

  it("should add a validation css class to stopCaseReasonText textbox and show a warning message when the submit button is clicked and the stopCaseReasonText textbox is empty", () => {
    // Act
    wrapper
      .find("#addStopCaseReasonBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#stopCaseReasonText")
        .first()
        .find("div")
        .first()
        .hasClass("validate")
    ).toBe(true);

    expect(
      wrapper
        .find("#addStopCaseReasonErrorMessage")
        .first()
        .prop("show")
    ).toBe(true);
  });

  it("should add a validation css class to sendsCorrespondence dropdown and show a warning message when the submit button is clicked and the sendsCorrespondence dropdown is empty", () => {
    // Act
    wrapper
      .find("#addStopCaseReasonBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#sendsCorrespondence")
        .first()
        .find("div")
        .first()
        .hasClass("validate")
    ).toBe(true);

    expect(
      wrapper
        .find("#addStopCaseReasonErrorMessage")
        .first()
        .prop("show")
    ).toBe(true);
  });

  it("should add a validation css class to selectedEmailTemplates dropdown and show a warning message when the submit button is clicked and the selectedEmailTemplates dropdown is empty", () => {
    // Arrange
    wrapper.setState({ sendsCorrespondence: true });
    wrapper.update();

    // Act
    wrapper
      .find("#addStopCaseReasonBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#selectedEmailTemplates")
        .first()
        .find("div")
        .first()
        .hasClass("validate")
    ).toBe(true);

    expect(
      wrapper
        .find("#addStopCaseReasonErrorMessage")
        .first()
        .prop("show")
    ).toBe(true);
  });

  it("should add a validation css class to updatesBluedog dropdown and show a warning message when the submit button is clicked and the updatesBluedog dropdown is empty", () => {
    // Act
    wrapper
      .find("#addStopCaseReasonBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#updatesBluedog")
        .first()
        .find("div")
        .first()
        .hasClass("validate")
    ).toBe(true);

    expect(
      wrapper
        .find("#addStopCaseReasonErrorMessage")
        .first()
        .prop("show")
    ).toBe(true);
  });

  it("should add a validation css class to selectedBluedogWatchList dropdown and show a warning message when the submit button is clicked and the selectedBluedogWatchList dropdown is empty", () => {
    // Arrange
    wrapper.setState({ updatesBluedog: true });
    wrapper.update();

    // Act
    wrapper
      .find("#addStopCaseReasonBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#selectedBluedogWatchList")
        .first()
        .find("div")
        .first()
        .hasClass("validate")
    ).toBe(true);

    expect(
      wrapper
        .find("#addStopCaseReasonErrorMessage")
        .first()
        .prop("show")
    ).toBe(true);
  });
});
