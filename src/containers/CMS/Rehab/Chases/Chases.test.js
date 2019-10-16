import React from "react";
import { mount } from "enzyme";
import Chases from "./Chases";
import Root from "Root";

const wrapper = mount(
  <Root>
    <Chases />
  </Root>
);
describe("Chases Container", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#chasesContainer").length).toBe(1);
  });

  it("should render the PageHeader", () => {
    // Assert
    expect(wrapper.find("#chasesPageHeader").length).toBe(1);
  });
});
