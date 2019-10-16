import React from "react";
import { shallow } from "enzyme";
import Root from "Root";
import { StopCaseModal } from "./StopCaseModal";

const bluedogCase = {
  bluedogCaseRef: "20007511/1",
  title: "",
  partyId: "27365",
  lastName: "Thornton-Allen",
  firstName: "Garry",
  houseNo: "170",
  address1: "Chorley New Road",
  address2: "Horwhich",
  address3: "Bolton",
  address4: "",
  houseNoWithRoad: " 70 Chorley New Road",
  country: "United Kingdom",
  postCode: "BL6 6JW",
  instructingPartyName: "Direct Line Insurance (Pilot)",
  email: "",
  dateOfBirth: "1976-02-02T00:00:00.0000000",
  incidentDate: "2017-11-20T00:00:00.0000000",
  age: "42",
  instructingPartyId: "27253",
  instructingPartyRef: "NonF2F",
  instructingParty: {
    address1: "",
    address2: "",
    address3: "",
    address4: ""
  }
};

const stopCaseReasons = [
  {
    stopCaseReasonId: 1,
    text: "Intiial Triage Failed",
    type: "Hold Case",
    emailTemplate: { emailTemplateId: 1 }
  }
];

const props = {
  isModalOpen: true,
  stopCaseReasons,
  closeModal: jest.fn(),
  title: "Case needs to be closed",
  reasonText: "No treatment needed",
  statement: "Statement text",
  bluedogCase
};

const wrapper = shallow(<StopCaseModal {...props} />);

describe("StopCaseModal", () => {
  beforeEach(() => {
    wrapper
      .instance()
      .removeValidationErrors(wrapper.instance().listToValidate());
    wrapper.instance().removeValidationMessage();
    wrapper.setState({ selectedStopCaseReasonId: "", additionalInfo: "" });
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.length).toBe(1);
  });

  it("should display a title from received from props", () => {
    // Arrange
    const title = wrapper.find("#stopCaseModalTitle");

    // Assert
    expect(title.text()).toBe("Case needs to be closed");
  });

  it("should display a statement text when received from props", () => {
    // Arrange
    const reasonText = wrapper.find("#stopCaseModalStatement");

    // Assert
    expect(reasonText.text()).toBe('"Statement text"');
  });

  it("should add a validation css class to the stop case reason dropdown when the stop case button is press and a stop case reason has not been selected", () => {
    // Assert
    expect(
      wrapper
        .find("#stopCaseReasonsModalDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#stopCaseBtn")
      .props()
      .onClick();

    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#stopCaseReasonsModalDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should remove the validation css class when a stop case reason is selected", () => {
    // Arrange
    wrapper
      .find("#stopCaseBtn")
      .props()
      .onClick();

    expect(
      wrapper
        .find("#stopCaseReasonsModalDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(true);

    const data = { name: "selectedStopCaseReasonId", value: 1 };

    // Act
    wrapper
      .find("#stopCaseReasonsModalDropdown")
      .simulate("change", null, data);

    // Assert
    expect(
      wrapper
        .find("#stopCaseReasonsModalDropdown")
        .dive()
        .hasClass("validate")
    ).toBe(false);
  });

  it("should show a validation message when the stop case button is clicked and a stop case reason hasnt been selected and additional info hasnt been entered", () => {
    // Arrange
    expect(wrapper.find("#stopCaseModalMessage").prop("show")).toBe(false);

    // Act
    wrapper
      .find("#stopCaseBtn")
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(wrapper.find("#stopCaseModalMessage").prop("show")).toBe(true);
  });

  it("should remove the validation message when a stop case reason is selected", () => {
    // Arrange
    wrapper
      .find("#stopCaseBtn")
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find("#stopCaseModalMessage").prop("show")).toBe(true);

    const data = { name: "selectedStopCaseReasonId", value: 1 };

    // Act
    wrapper
      .find("#stopCaseReasonsModalDropdown")
      .simulate("change", null, data);

    // Assert
    expect(wrapper.find("#stopCaseModalMessage").prop("show")).toBe(false);
  });

  it("should remove the validation message when a additional info is added", () => {
    // Arrange
    wrapper
      .find("#stopCaseBtn")
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find("#stopCaseModalMessage").prop("show")).toBe(true);

    const data = { name: "additionalInfo", value: "test data" };

    // Act
    wrapper
      .find("#stopCaseReasonModalAdditionalInfoTextBox")
      .simulate("change", null, data);

    // Assert
    expect(wrapper.find("#stopCaseModalMessage").prop("show")).toBe(false);
  });
});
