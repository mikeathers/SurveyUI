import React from "react";
import { mount } from "enzyme";
import CaseAdminMenu from "./CaseAdminMenu";

const props = {
  selected: "letterTemplates",
  selectItem: jest.fn()
};

const wrapper = mount(<CaseAdminMenu {...props} />);

describe("CaseAdminMenu", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.length).toBe(1);
  });

  it("should render a menu container with 3 items", () => {
    // Assert
    expect(wrapper.find("#case-admin-menu-container").children().length).toBe(
      3
    );
  });

  it("should render with the letterTemplatesBtn selected as default when letterTemplates received in through props", () => {
    // Assert
    expect(
      wrapper
        .find("#letterTemplatesBtn")
        .hasClass("case-admin-menu__item case-admin-menu__item--selected")
    ).toBe(true);
  });
});
