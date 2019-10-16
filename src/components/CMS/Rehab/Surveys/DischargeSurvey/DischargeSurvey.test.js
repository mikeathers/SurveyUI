import React from "react";
import { shallow } from "enzyme";

import DischargeSurvey from "./DischargeSurvey";

const painKillerQuestions = {
  questionText:
    "Are you taking any regular prescribed or non-prescribed medication, ie steroids or anti-coagulants?",
  selectionAnswers: ["Pills", "Tablets"],
  questionGroupId: "pastMedicalHistory",
  other: "Lots of drugs"
};

const props = {
  clinicianSurveyQuestions: [painKillerQuestions],
  completedClinicianSurvey: {}
};

const wrapper = shallow(<DischargeSurvey {...props} />);

describe("DischargeSurvey", () => {
  beforeEach(() => {
    wrapper.setState({
      psfsActivities: [],
      currentPainKillers: [],
      painScores: []
    });
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#dischargeSurvey").length).toBe(1);
  });

  it("should render an Injured Party Details component", () => {
    // Assert
    expect(wrapper.find("#dischargeSurveyInjuredPartyDetails").length).toBe(1);
  });

  it("should render a VAS Scores component", () => {
    //Assert
    expect(wrapper.find("#dischargeSurveyVAS").length).toBe(1);
  });

  it("should render a PSFS Scores component", () => {
    //Assert
    expect(wrapper.find("#dischargeSurveyPSFSActivities").length).toBe(1);
  });

  it("should render a PainKillers component if the IP answered that they are taking pain killers", () => {
    //Assert
    expect(wrapper.find("#dischargeSurveyPainKillers").length).toBe(1);
  });

  it("should render a CaseCompletion component", () => {
    //Assert
    expect(wrapper.find("#dischargeSurveyCaseCompletion").length).toBe(1);
  });
});
