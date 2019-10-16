import React from "react";
import { shallow } from "enzyme";
import SOAPSurvey from "./SOAPSurvey";

const painKillerQuestion = {
  questionText:
    "Are you taking any regular prescribed or non-prescribed medication, ie steroids or anti-coagulants?",
  selectionAnswers: ["Tablets", "Pills"],
  additionalInfo: "Other drugs",
  questionGroupId: "fullDrugHistory",
  scaleAnswer: 0
};

const clinicianSurveyQuestions = [painKillerQuestion];

const props = {
  bluedogCase: { incidentDate: "" },
  mi3dCase: { bluedogCaseRef: "" },
  username: "Test User",
  clinicianSurveyQuestions,
  completedClinicianSurvey: {},
  completedDischargeSurvey: {},
  completedSOAPSurvey: {}
};

const wrapper = shallow(<SOAPSurvey {...props} />);

describe("SOAP Survey", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#soapSurvey").length).toBe(1);
  });

  it("should render SOAPForm", () => {
    // Assert
    expect(wrapper.find("#soapForm").length).toBe(1);
  });

  it("should render InjuredPartyDetails", () => {
    // Assert
    expect(wrapper.find("#soapSurveyInjuredPartyDetails").length).toBe(1);
  });

  it("should render VAS", () => {
    // Assert
    expect(wrapper.find("#soapSurveyVAS").length).toBe(1);
  });

  it("should render PSFS", () => {
    // Assert
    expect(wrapper.find("#soapSurveyPSFSActivities").length).toBe(1);
  });
});
