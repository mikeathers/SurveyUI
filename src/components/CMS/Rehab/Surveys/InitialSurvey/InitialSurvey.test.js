import React from "react";
import { shallow, mount } from "enzyme";
import Root from "Root";
import InitialSurvey from "./InitialSurvey";
import YesNoQuestion from "./YesNoQuestion/YesNoQuestion";
import ScaleQuestion from "./ScaleQuestion/ScaleQuestion";
import SelectionQuestion from "./SelectionQuestion/SelectionQuestion";
import StopCaseModal from "../../StopCaseModal/StopCaseModal";
import SurveyBuilder from "../SurveyBuilder/SurveyBuilder";

const props = {
  saveCompletedSurvey: jest.fn(),
  returnUpdatedQuestion: jest.fn(),
  mi3dCase: {
    dpaAccepted: false
  },
  bluedogCase: {},
  completed: false,
  completedQuestions: [],
  getCorrectAnswerForQuestionType: jest.fn(),
  completedInitialSurvey: {},
  parseCompletedSurvey: jest.fn()
};

const wrapper = mount(<InitialSurvey {...props} />);

describe("InitialSurvey", () => {
  beforeEach(() => {
    wrapper.setState({
      completedQuestions: [],
      caseModalOpen: false,
      modalButtonText: "",
      modalReasonText: "",
      modalTitle: "",
      modalStatement: "",
      message: "",
      errorMessage: false,
      showMessage: false,
      completedQuestions: [],
      noTreatmentNeededAnswers: [],
      faceToFaceNeededAnswers: []
    });
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.length).toBe(1);
  });

  it("should render a list of 10 YesNoQuestions", () => {
    // Assert
    expect(wrapper.find(YesNoQuestion).length).toBe(10);
  });

  it("should render 1 SelectionQuestion", () => {
    // Assert
    expect(wrapper.find(SelectionQuestion).length).toBe(1);
  });

  it("should render 1 ScaleQuestion", () => {
    // Assert
    expect(wrapper.find(ScaleQuestion).length).toBe(1);
  });

  it("should render the SurveyBuilder", () => {
    // Assert
    const surveyBuilder = wrapper.find(SurveyBuilder);
    expect(surveyBuilder.length).toBe(1);
  });

  it("should show the survey as disabled if DPA hasnt been accepted", () => {
    // Arrange
    const props = {
      returnUpdatedQuestion: jest.fn(),
      mi3dCase: {
        dpaAccepted: false
      },
      completed: false,
      completedQuestions: []
    };
    const wrapper = shallow(<InitialSurvey {...props} />);
    const surveyCard = wrapper.find("#initialSurveyCard").first();

    // Assert
    expect(surveyCard.prop("disabled")).toBe(true);
  });

  it("should show the survey as disabled if the survey has already been completed", () => {
    // Arrange
    const props = {
      returnUpdatedQuestion: jest.fn(),
      mi3dCase: {
        dpaAccepted: true
      },
      completed: true,
      completedQuestions: []
    };
    const wrapper = shallow(<InitialSurvey {...props} />);
    const surveyCard = wrapper.find("#initialSurveyCard").first();

    // Assert
    expect(surveyCard.prop("disabled")).toBe(true);
  });

  it("should show a validation warning if the survey gets submitted with unanswered questions", () => {
    // Arrange
    const validationMessage = wrapper.find("#initialSurveyValidationMessage");
    expect(validationMessage.first().prop("show")).toBe(false);

    // Act
    wrapper.instance().handleSubmitSurvey();
    wrapper.update();

    // Assert
    const updatedValidationMessage = wrapper.find(
      "#initialSurveyValidationMessage"
    );
    expect(updatedValidationMessage.first().prop("show")).toBe(true);
  });

  it("should show the SurveyCompleteModal when a survey has been completed", () => {
    // Act
    const completedQuestions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    wrapper.setState({ completedQuestions });
    wrapper.update();

    // Act
    wrapper.instance().handleSubmitSurvey();
    wrapper.update();

    // Assert
    expect(wrapper.find("#clinicianSurveySurveyCompleteModal").length).toBe(1);
  });
});
