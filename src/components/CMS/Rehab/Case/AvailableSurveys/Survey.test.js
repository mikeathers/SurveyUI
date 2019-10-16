import React from "react";
import { mount } from "enzyme";

import AvailableSurveys from "./AvailableSurveys";

describe("Uncomplete Survey", () => {
  const props = {
    mi3dCase: {}
  };

  const wrapper = mount(<AvailableSurveys {...props} />);
  it("should not have a completed class applied when survey not complete", () => {
    // Assert
    expect(
      wrapper.find("#availableInitialSurvey").hasClass("survey__completed")
    ).toBe(false);
  });

  it("should not show the completedBy tag when survey not complete", () => {
    // Assert
    expect(wrapper.find("#survey-completed-by").length).toBe(0);
  });

  it("should render the Initial Survey button as enabled", () => {
    // Assert
    expect(
      wrapper
        .find("#availableInitialSurvey")
        .find("div")
        .hasClass("survey--unavailable")
    ).toBe(false);
  });

  it("should render the Clinician Survey button as disabled", () => {
    // Assert
    expect(
      wrapper
        .find("#availableClinicianSurvey")
        .find("div")
        .hasClass("survey--unavailable")
    ).toBe(true);
  });
});

describe("Complete Survey", () => {
  const props = {
    mi3dCase: {
      completedInitialSurvey: {
        name: "Initial",
        completed: true,
        completedBy: "Test User"
      },
      completedClinicianSurvey: null
    }
  };
  const wrapper = mount(<AvailableSurveys {...props} />);

  it("should add a completed css class to any completed surveys", () => {
    // Assert
    setTimeout(
      () =>
        expect(
          wrapper
            .find("#availableInitialSurvey")
            .find("div")
            .hasClass("survey__completed")
        ).toBe(true),
      2000
    );
  });

  it("should show the completedBy tag when the survey is complete", () => {
    // Assert
    setTimeout(
      () => expect(wrapper.find("#survey-completed-by").length).toBe(1),
      2000
    );
  });

  it("should show the completedBy in the completedBy tag", () => {
    // Assert
    setTimeout(
      () =>
        expect(wrapper.find("#survey-completed-by").text()).toBe(
          `Completed by Test User`
        ),
      2000
    );
  });
});
