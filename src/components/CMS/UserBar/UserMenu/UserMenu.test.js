import React from "react";
import { shallow } from "enzyme";
import UserMenu from "./UserMenu";

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<UserMenu {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("UserMenu", () => {
  const wrapper = setup();
  const usermenuButton = wrapper.find("#usermenu__button");
  const usermenu = wrapper.find("#usermenu");

  it("should render without crashing", () => {
    expect(usermenu.length).toBe(1);
  });

  it("should get the open class added to it on click", () => {
    expect(usermenu.hasClass("usermenu--open")).toBe(false);
    expect(wrapper.state("open")).toBe(false);

    usermenuButton.props().onClick();
    wrapper.update();

    const usermenuAfterChange = wrapper.find("#usermenu");
    expect(wrapper.state("open")).toBe(true);
    expect(usermenuAfterChange.hasClass("usermenu--open")).toBe(true);
  });
});
