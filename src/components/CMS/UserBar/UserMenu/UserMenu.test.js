import React from "react";
import { mount } from "enzyme";
import UserMenu from "./UserMenu";

import context from '../../../../providers/TestAuthContext';
jest.mock('../../../../providers/authProvider');

const setup = (props = {}, state = null) => {
  const wrapper = mount(<UserMenu {...props} />);
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

  it ("Should have button logout", ()=>{
    const usermenu_logout = wrapper.find("#usermenu__logout");
    expect(usermenu_logout.length).toBe(1);
  })
});
