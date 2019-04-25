import React from "react";
import { mount } from "enzyme";
import Root from "Root";
import AddCallBackModal from "./AddCallBackModal";

const setup = (props = {}, state = null) => {
  const wrapper = mount(<AddCallBackModal {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("AddCallBackModal", () => {
  const addCallback = jest.fn();
  const closeModal = jest.fn();
  const wrapper = setup({
    isModalOpen: true,
    addCallback,
    user: { name: "Test User" },
    mi3dCase: { caseId: 0, bluedogCaseRef: "200080315/2" },
    closeModal
  });

  it("should render without crashing", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should add a validation class to the callBackType dropdown when add button is clicked and callBackType = ''", () => {
    const callbackTypeDropdown = wrapper.find("#callback-type-dropdown").at(2);
    const submitButton = wrapper.find("#add-callback-button").first();

    expect(callbackTypeDropdown.hasClass("validate")).toBe(false);
    expect(wrapper.state("callbackType")).toBe("");

    submitButton.props().onClick();
    wrapper.update();

    const callbackTypeDropdownAfterUpdate = wrapper
      .find("#callback-type-dropdown")
      .at(2);

    expect(callbackTypeDropdownAfterUpdate.hasClass("validate")).toBe(true);
  });

  it("should call addCallback when callbackType is Initial and Add button gets clicked", () => {
    const callbackTypeDropdown = wrapper.find("#callback-type-dropdown").at(1);

    callbackTypeDropdown
      .instance()
      .handleChange({ target: { value: "Initial", name: "callbackType" } });

    wrapper.update();
    expect(wrapper.state("callbackType")).toBe("Initial");

    const submitButton = wrapper.find("#add-callback-button").first();
    submitButton.props().onClick();

    expect(addCallback).toHaveBeenCalled();
  });

  it("should show the datepicker when callbackType is Rescheduled", () => {
    const callbackTypeDropdown = wrapper.find("#callback-type-dropdown").at(1);

    callbackTypeDropdown
      .instance()
      .handleChange({ target: { value: "Reschedule", name: "callbackType" } });

    wrapper.update();
    expect(wrapper.state("callbackType")).toBe("Reschedule");

    const callbackDatePicker = wrapper.find("#callback-date-picker").first();
    expect(callbackDatePicker.length).toBe(1);
  });
});
