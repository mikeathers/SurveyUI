import React from "react";
import { shallow } from "enzyme";
import EmailTemplatesList from "./EmailTemplatesList";

const props = {
  emailTemplatesForDropdown: [{ text: "First Test Template", value: "1" }],
  emailTemplates: [{ emailTemplateId: 1, name: "First Test Template" }],
  getSelectedTemplate: jest.fn(),
  clearSelectedTemplate: jest.fn()
};

const wrapper = shallow(<EmailTemplatesList {...props} />);

describe("EmailTemplatesList", () => {
  beforeEach(() => {
    wrapper.setState({
      emailTemplates:
        props.emailTemplates !== undefined ? props.emailTemplates : [],
      emailTemplatesForDropdown:
        props.emailTemplatesForDropdown !== undefined
          ? props.emailTemplatesForDropdown
          : [],
      selectedTemplateId: "",
      selectedTemplate: null,
      removeModalOpen: false,
      showMessage: false,
      errorMessage: false,
      message: ""
    });
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#emailTemplatesList").length).toBe(1);
  });

  it("should display a list of templates in the Email Templates dropdown when received in from props", () => {
    // Arrange
    const newProps = {
      emailTemplatesForDropdown: [{ text: "Second Test Template", value: "2" }]
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#emailTemplatesListEmailTemplatesDropdown")
        .first()
        .prop("options")
    ).toBe(newProps.emailTemplatesForDropdown);
  });

  it("should render a EmailTemplateInfo when an email template has been selected", () => {
    // Arrange
    const selectedTemplate = {
      emailTemplateId: 1,
      name: "Test Email Template"
    };
    expect(wrapper.find("#emailTemplateInfo").length).toBe(0);

    // Act
    wrapper.setState({ selectedTemplate });
    wrapper.update();

    // Assert
    expect(wrapper.find("#emailTemplateInfo").length).toBe(1);
  });

  it("should show a RemoveEmailTemplateModal when the Remove Email Template button has been clicked", () => {
    // Arrange
    const selectedTemplate = {
      emailTemplateId: 1,
      name: "Test Email Template"
    };
    wrapper.setState({ selectedTemplate });
    wrapper.update();
    expect(
      wrapper.find("#removeEmailTemplateModal").prop("removeModalOpen")
    ).toBe(false);

    // Act
    wrapper
      .find("#removeEmailTemplateBtn")
      .props()
      .onClick();

    // Arrange
    expect(
      wrapper.find("#removeEmailTemplateModal").prop("removeModalOpen")
    ).toBe(true);
  });

  it("should clear the selected template and hide EmailTemplateInfo when the Clear button is clicked ", () => {
    // Arrange
    const selectedTemplate = {
      emailTemplateId: 1,
      name: "Test Email Template"
    };
    wrapper.setState({ selectedTemplate });
    wrapper.update();
    expect(wrapper.find("#emailTemplateInfo").length).toBe(1);

    // Act
    wrapper
      .find("#emailTemplatesListClearBtn")
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(wrapper.find("#emailTemplateInfo").length).toBe(0);
    expect(
      wrapper.find("#emailTemplatesListEmailTemplatesDropdown").prop("value")
    ).toBe("");
  });
});
