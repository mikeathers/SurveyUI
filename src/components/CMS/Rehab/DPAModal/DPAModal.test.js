import React from "react";
import { mount } from "enzyme";
import Root from "Root";
import DPAModal from "./DPAModal";

const props = {
  isModalOpen: true,
  case: {
    telephoneInfo: []
  }
};
const wrapper = mount(
  <Root>
    <DPAModal {...props} />
  </Root>
);

describe("DPAModal", () => {
  it("should render without crashing", () => {
    expect(wrapper.find("#dpaModal").first().length).toBe(1);
  });

  it("should render InjuredPartyDetails", () => {
    expect(wrapper.find("#dpaInjuredPartyDetails").first().length).toBe(1);
  });

  it("should render InjuredPartContactDetails", () => {
    expect(wrapper.find("#dpaInjuredPartyContactDetails").first().length).toBe(
      1
    );
  });
});
