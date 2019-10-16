import React from "react";
import { shallow } from "enzyme";
import ClinicianSurvey from "./ClinicianSurvey";
window.scrollTo = jest.fn();

const initialSurveyQuestions = [
  {
    completedQuestionId: 647,
    completedSurveyId: 0,
    questionId: 4,
    questionText: "What areas are affected?",
    scaleAnswer: 0,
    selectionAnswers: ["Neck", "Mid Back"],
    type: "selection",
    yesNoAnswer: ""
  },
  {
    completedQuestionId: 648,
    completedSurveyId: 0,
    questionId: 4,
    questionText: "Do you take pain killers?",
    scaleAnswer: 0,
    selectionAnswers: null,
    type: "selection",
    yesNoAnswer: "Yes"
  }
];

const props = {
  initialSurveyQuestions,
  completedQuestions: [],
  psfsActivities: [],
  mi3dCase: {},
  completedClinicianSurvey: {}
};

const wrapper = shallow(<ClinicianSurvey {...props} />);

describe("ClinicianSurvey", () => {
  beforeEach(() => {
    wrapper.setProps({ ...props });
    wrapper.instance().handleInitialSurveyQuestions(initialSurveyQuestions);
    wrapper.update();
  });

  it("should render without crashing", () => {
    // Arrange
    expect(wrapper.length).toBe(1);
  });

  it("should render the Actions component", () => {
    // Arrange
    expect(wrapper.find("#clinicianSurveyActions").length).toBe(1);
  });

  it("should render a card for Cervical Spine when Neck has been passed in as a selected body part", () => {
    // Assert
    expect(wrapper.find("#cervicalSpineCard").length).toBe(1);
  });

  it("should not render a card for Lumbar Spine when Lower Back has not been passed in as a selected body part", () => {
    // Assert
    expect(wrapper.find("#lumbarSpineCard").length).toBe(0);
  });

  it("should render a card for Injured Body Part - Mid Back when Mid Back has been passed in as a selected body part", () => {
    // Assert
    expect(wrapper.find("#injuredBodyPartMidBackCard").length).toBe(1);
  });

  it("should render a card for Past Medical History", () => {
    // Arrange
    expect(wrapper.find("#pastMedicalHistoryCard").length).toBe(1);
  });

  it("should render a card for Full Drug History when IP has answered they take pain killers in the initial survey", () => {
    // Arrange
    expect(wrapper.find("#fullDrugHistoryCard").length).toBe(1);
  });

  it("should render a card for Additional Information", () => {
    // Arrange
    expect(wrapper.find("#additionalInformationCard").length).toBe(1);
  });

  it("should show Cervical Card as disabled if the survey has already been completed", () => {
    // Arrange
    const newProps = {
      ...props,
      dpaAccepted: true,
      completed: true
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find("#cervicalSpineCard").prop("disabled")).toBe(true);
  });

  it("should show Actions as disabled if the survey has already been completed", () => {
    // Arrange
    const newProps = {
      ...props,
      dpaAccepted: true,
      completed: true
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    const actionComponent = wrapper.find("#clinicianSurveyActions").dive();
    const actionsCard = actionComponent.find("#clinicianSurveyActionsCard");
    expect(actionsCard.prop("disabled")).toBe(true);
  });

  it("should render the WADScore components", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyWADScore").length).toBe(1);
  });

  it("should render the PSFSScore components", () => {
    // Assert
    expect(wrapper.find("#clinicianSurveyPSFSScore").length).toBe(1);
  });

  it("should return false when completedQuestions equals the length of the questions array, a WADScore has been selected and atleast 1 psfsActivity has been added", () => {
    // Arrange
    wrapper.setState({
      completedQuestionsLength: 1,
      completedQuestions: [{ id: 0 }],
      wadScore: "llb",
      psfsActivities: [{ id: 0 }]
    });
    wrapper.update();

    // Act
    var surveyNotComplete = wrapper.instance().surveyNotComplete();

    // Assert
    expect(surveyNotComplete).toBe(false);
  });

  it("should return true when completedQuestions does not equal the length of the questions array, a WADScore has not been selected and atleast 1 psfsActivity has not been added", () => {
    // Arrange
    wrapper.setState({
      completedQuestionsLength: 1,
      completedQuestions: [],
      wadScore: "",
      psfsActivities: []
    });
    wrapper.update();

    // Act
    var surveyNotComplete = wrapper.instance().surveyNotComplete();

    // Assert
    expect(surveyNotComplete).toBe(true);
  });
});
