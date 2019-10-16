import React from "react";
import { shallow } from "enzyme";
import CompleteChaseModal from "./CompleteChaseModal";

const props = {
  isModalOpen: true,
  closeModal: jest.fn(),
  chase: {
    name: "PostClinicalAssessmentChaseOne"
  }
};

const wrapper = shallow(<CompleteChaseModal {...props} />);

describe("CompleteChaseModal", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#completeChaseModal").length).toBe(1);
  });

  it("should show the exercise start date textbox when the name of the chase received in from props is PostClinicalAssessmentChaseOne", () => {
    // Assert
    expect(wrapper.find("#completeChaseModalExerciseStartDate").length).toBe(1);
  });

  it("should not show the exercise start date textbox when the name of the chase received in from props is not PostClinicalAssessmentChaseOne", () => {
    // Arrange
    const newProps = {
      ...props,
      chase: {
        name: "SOAPSurveyChaseOne"
      }
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find("#completeChaseModalExerciseStartDate").length).toBe(0);
  });
});
