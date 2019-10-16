import React from "react";
import { mount } from "enzyme";
import { CallBacks } from "./CallBacks";

const wrapper = mount(<CallBacks />);

describe("CallBacks Container", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#callBacksContainer").length).toBe(1);
  });

  it("should render the PageHeader", () => {
    // Assert
    expect(wrapper.find("#callBacksPageHeader").length).toBe(1);
  });

  it("should render a CaseList component", () => {
    // Assert
    expect(wrapper.find("#callBacksCaseList").first().length).toBe(1);
  });
});
