import React from "react";
import { shallow } from "enzyme";
import WADScore from "./WADScore";

const wrapper = shallow(<WADScore />);

describe("WAD Score", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#WADScore").length).toBe(1);
  });

  it("should render a list of WAD Score", () => {
    // Assert
    expect(wrapper.find(".wadscore__row").length).toBe(6);
  });

  it("should render a dropdown with a list of wadscore options", () => {
    // Assert
    expect(wrapper.find("#wadScoreDropdown").prop("options").length).toBe(6);
  });

  it("should populate the WAD score dropdown when a WAD score is received through props", () => {
    // Arrange
    const newProps = {
      wadScore: "llb"
    };
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#wadScoreDropdown").prop("value")).toBe("llb");
  });
});
