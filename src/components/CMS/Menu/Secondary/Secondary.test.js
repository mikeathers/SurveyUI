import React from "react";
import { mount } from "enzyme";
import Root from "Root";
import Secondary from "./Secondary";

const setup = (props = {}, state = null) => {
  const wrapper = mount(
    <Root>
      <Secondary {...props} />
    </Root>
  );
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("SecondaryMenu", () => {
  const wrapper = setup();

  it("should render without crashing", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should update the button with a selected class when clicked", () => {
    const button1 = wrapper.find("#secondary-menu__item1");
    const button2 = wrapper.find("#secondary-menu__item2");

    expect(button1.hasClass("secondary-menu-item--selected")).toBe(true);
    expect(button2.hasClass("secondary-menu-item--selected")).toBe(false);

    button2.props().onClick();
    wrapper.update();

    const button1AfterUpdate = wrapper.find("#secondary-menu__item1");
    const button2AfterUpdate = wrapper.find("#secondary-menu__item2");

    expect(button1AfterUpdate.hasClass("secondary-menu-item--selected")).toBe(
      false
    );
    expect(button2AfterUpdate.hasClass("secondary-menu-item--selected")).toBe(
      true
    );
  });
});
