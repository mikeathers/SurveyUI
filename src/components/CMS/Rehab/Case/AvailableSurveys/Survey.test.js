import React from "react";
import { mount } from "enzyme";
import Root from "Root";
import Survey from "./Survey";

const setup = (props = {}, state = null) => {
  const wrapper = mount(
    <Root>
      <Survey {...props} />
    </Root>
  );
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("Survey", () => {
  const survey = {
    name: "Initial",
    completed: false,
    path: "path",
    completedBy: "Test User"
  };
  const wrapper = setup({ survey, id: 1 });

  it("should render without crashing", () => {
    expect(wrapper.length).toBe(1);
  });

  describe("Uncomplete Survey", () => {
    it("should not have a completed class applied when survey not complete", () => {
      const initialSurvey = wrapper.find("#available-survey-1");
      expect(initialSurvey.hasClass("survey__completed")).toBe(false);
    });

    it("should not show the completedBy tag when survey not complete", () => {
      const completedByTag = wrapper.find("#survey-completed-by");
      expect(completedByTag.length).toBe(0);
    });
  });

  describe("Complete Survey", () => {
    const survey = {
      name: "Initial",
      completed: true,
      path: "path",
      completedBy: "Test User"
    };
    const wrapper = setup({ survey, id: 1 });
    const completedByTag = wrapper.find("#survey-completed-by");
    const initialSurvey = wrapper.find("#available-survey-1");

    it("should add a completed css class to any completed surveys", () => {
      expect(initialSurvey.hasClass("survey__completed")).toBe(true);
    });

    it("should show the completedBy tag when the survey is complete", () => {
      expect(completedByTag.length).toBe(1);
    });

    it("should show the completedBy in the completedBy tag", () => {
      expect(completedByTag.text()).toBe(`Completed by ${survey.completedBy}`);
    });
  });
});
