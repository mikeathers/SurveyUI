import React from "react";
import { shallow, mount } from "enzyme";
import Chases from "./Chases";
import CompleteChaseItem from "./CompleteChaseItem";
import IncompleteChaseItem from "./IncompleteChaseItem";

const props = {
  chases: [
    {
      name: "PostClinicalAssessmentChaseOne",
      description: "Check that the injured party has started exercise",
      compliant: false,
      complete: false,
      chaseId: 1
    },
    {
      name: "PostClinicalAssessmentChaseTwo",
      description: "Check that the injured party has started exercise",
      compliant: true,
      complete: true,
      chaseId: 2
    },
    {
      name: "SOAPSurveyChaseOne",
      description: "Check that the injured party has started exercise",
      compliant: true,
      complete: true,
      chaseId: 3
    }
  ]
};
const wrapper = mount(<Chases {...props} />);

describe("Chases", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#chases").length).toBe(1);
  });

  it("should render a list with 1 IncompleteChaseItem when received from props", () => {
    // Assert
    expect(wrapper.find(IncompleteChaseItem).length).toBe(1);
  });

  it("should render a list with 2 CompleteChaseItem when received from props", () => {
    // Assert
    expect(wrapper.find(CompleteChaseItem).length).toBe(2);
  });
});
