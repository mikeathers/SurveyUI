import React from "react";
import { shallow, mount } from "enzyme";
import Root from "Root";
import EmailTemplates from "./EmailTemplates";

const wrapper = mount(
  <Root>
    <EmailTemplates />
  </Root>
);

describe("EmailTemplates", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#emailTemplates").first().length).toBe(1);
  });

  it("should show EmailTemplateBuilder", () => {
    // Assert
    expect(wrapper.find("#emailTemplateBuilder").first().length).toBe(1);
  });

  it("should show EmailTemplatesList", () => {
    // Assert
    expect(wrapper.find("#emailTemplatesList").first().length).toBe(1);
  });
});
