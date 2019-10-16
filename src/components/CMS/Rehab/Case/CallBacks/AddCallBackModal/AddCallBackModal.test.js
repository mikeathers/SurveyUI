import React from "react";
import { mount, shallow } from "enzyme";
import Root from "Root";
import AddCallBackModal from "./AddCallBackModal";

const addCallback = jest.fn();
const closeModal = jest.fn();

const props = {
  isModalOpen: true,
  addCallback,
  user: { name: "Test User" },
  mi3dCase: { caseId: 0, bluedogCaseRef: "200080315/2" },
  closeModal
};

const wrapper = mount(<AddCallBackModal {...props} />);

describe("AddCallBackModal", () => {
  beforeEach(() => {
    wrapper.setState({
      startDate: new Date(),
      rescheduleSelected: false,
      callbackType: ""
    });
  });

  it("should render without crashing", () => {
    // Arrange
    expect(wrapper.length).toBe(1);
  });

  it("should add a validation class to the callBackType dropdown when add button is clicked and callBackType = ''", () => {
    // Arrange
    expect(
      wrapper
        .find("#callback-type-dropdown")
        .first()
        .find("div")
        .first()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#add-callback-button")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#callback-type-dropdown")
        .first()
        .find("div")
        .first()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should call addCallback when callbackType is Initial and Add button gets clicked", () => {
    // Act
    wrapper
      .find("#callback-type-dropdown")
      .first()
      .simulate("change", {
        target: { value: "Initial", name: "callbackType" }
      });

    wrapper.update();
    wrapper
      .find("#add-callback-button")
      .first()
      .props()
      .onClick();

    // Assert
    expect(addCallback).toHaveBeenCalled();
  });

  it("should show the datepicker when rescheduleSelected is true", () => {
    // Act
    wrapper.setState({ rescheduleSelected: true });
    wrapper.update();

    // Assert
    expect(wrapper.find("#callback-date-picker").first().length).toBe(1);
  });
});
