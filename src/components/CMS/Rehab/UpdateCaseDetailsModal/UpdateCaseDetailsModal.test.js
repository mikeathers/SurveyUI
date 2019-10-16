import React from "react";
import { mount } from "enzyme";
import UpdateCaseDetailsModal from "./UpdateCaseDetailsModal";

const props = {
  isModalOpen: true,
  closeModal: jest.fn(),
  courseDuration: undefined,
  mi3dCase: {},
  username: "Test User",
  updateMi3dCase: jest.fn()
};

const wrapper = mount(<UpdateCaseDetailsModal {...props} />);

describe("UpdateCaseDetailsModal", () => {
  beforeEach(() => {
    wrapper.setState({
      showMessage: false
    });
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#updateCaseDetailsModal").first().length).toBe(1);
  });

  it("should add a validation class to the course duration input when the update course duration buttin is clicked and the input is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#courseDurationTextBox")
        .first()
        .find("div")
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#updateCourseDurationBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#courseDurationTextBox")
        .first()
        .find("div")
        .hasClass("validate")
    ).toBe(true);
  });

  it("should show an error message when the update course duration button is clicked and the input is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#updateCaseDetailsMessage")
        .first()
        .prop("show")
    ).toBe(false);

    // Act
    wrapper
      .find("#updateCourseDurationBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#updateCaseDetailsMessage")
        .first()
        .prop("show")
    ).toBe(true);
  });

  it("should remove validation class when the course duration input is typed in", () => {
    // Arrange
    wrapper
      .find("#updateCourseDurationBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();
    expect(
      wrapper
        .find("#courseDurationTextBox")
        .first()
        .find("div")
        .hasClass("validate")
    ).toBe(true);

    // Act
    const data = { name: "courseDuration", value: "3" };
    wrapper
      .find("#courseDurationTextBox")
      .first()
      .find("div")
      .simulate("change", null, data);
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#courseDurationTextBox")
        .first()
        .hasClass("validate")
    ).toBe(false);
  });
});
