import React from "react";
import { mount } from "enzyme";
import Root from "Root";
import Primary from "./Primary";

const setup = (props = {}, state = null) => {
  const wrapper = mount(
    <Root>
      <Primary {...props} />
    </Root>
  );
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("PrimaryMenu", () => {
  const wrapper = setup();

  it("should render without crashing", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should update the button with a selected class when clicked", () => {
    const button1 = wrapper.find("#primary-menu__item1");
    const button2 = wrapper.find("#primary-menu__item2");

    expect(button1.hasClass("primary-menu-item--selected")).toBe(true);
    expect(button2.hasClass("primary-menu-item--selected")).toBe(false);

    button2.props().onClick();
    wrapper.update();

    const button1AfterUpdate = wrapper.find("#primary-menu__item1");
    const button2AfterUpdate = wrapper.find("#primary-menu__item2");

    expect(button1AfterUpdate.hasClass("primary-menu-item--selected")).toBe(
      false
    );
    expect(button2AfterUpdate.hasClass("primary-menu-item--selected")).toBe(
      true
    );
  });
});
