import React from "react";
import { mount } from "enzyme";
import SurveyBuilder from "./SurveyBuilder";

const bluedogCase = {
  firstName: "Test",
  lastName: "User",
  houseNo: "1",
  address1: "First Street",
  address2: "Horwich",
  address3: "Bolton",
  address4: "Lancashire",
  postCode: "BL8 8LP",
  instructingPartyName: "Direct Line Insurance"
};
const completedQuestions = [
  {
    question: {
      text: "Test question 1"
    },
    id: 0,
    answer: "Yes"
  },
  {
    question: {
      text: "Test question 2"
    },
    id: 1,
    answer: "Yes"
  },
  {
    question: {
      text: "Test question 3"
    },
    id: 2,
    answer: "Yes"
  }
];
const props = {
  bluedogCase,
  completedQuestions,
  getCorrectAnswerForQuestionType: jest.fn()
};
const wrapper = mount(<SurveyBuilder {...props} />);

describe("SurveyBuilder", () => {
  it("should render without crashing", () => {
    // Assert
    expect(wrapper.length).toBe(1);
  });

  it("should render a logo image", () => {
    // Assert
    const logo = wrapper.find("#surveyBuilderLogo");
    expect(logo.length).toBe(1);
  });

  it("should render the injured party name, address and instructing party from props", () => {
    // Assert
    expect(wrapper.find("#surveyBuilderIPName").text()).toBe(
      `${bluedogCase.firstName} ${bluedogCase.lastName}`
    );
    expect(wrapper.find("#surveyBuilderAddress1").text()).toBe(
      `${bluedogCase.houseNo} ${bluedogCase.address1}`
    );
    expect(wrapper.find("#surveyBuilderAddress2").text()).toBe(
      bluedogCase.address2
    );
    expect(wrapper.find("#surveyBuilderAddress3").text()).toBe(
      bluedogCase.address3
    );
    expect(wrapper.find("#surveyBuilderAddress4").text()).toBe(
      bluedogCase.address4
    );
    expect(wrapper.find("#surveyBuilderPostcode").text()).toBe(
      bluedogCase.postCode
    );
    expect(wrapper.find("#surveyBuilderInstructingPartyName").text()).toBe(
      `On behalf of ${bluedogCase.instructingPartyName}`
    );
  });

  it("should render a list of questions from props", () => {
    // Assert
    expect(wrapper.find(".completed-question").length).toBe(3);
  });

  it("should add a question to the list of questions when a new one is received through props", () => {
    // Arrange
    const wrapper = mount(<SurveyBuilder {...props} />);
    expect(wrapper.find(".completed-question").length).toBe(3);
    const newQuestion = {
      question: {
        text: "Test question 4"
      },
      id: 3,
      answer: "Yes"
    };
    const newProps = {
      ...props,
      completedQuestions: [...props.completedQuestions, newQuestion]
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find(".completed-question").length).toBe(4);
  });

  it("should remove a question from the list of questions when a new one is removed through props", () => {
    // Arrange
    const wrapper = mount(<SurveyBuilder {...props} />);
    expect(wrapper.find(".completed-question").length).toBe(3);

    const updatedQuestions = [
      {
        question: {
          text: "Test question 1"
        },
        id: 0,
        answer: "Yes"
      },
      {
        question: {
          text: "Test question 2"
        },
        id: 1,
        answer: "Yes"
      }
    ];
    const newProps = {
      completedQuestions: updatedQuestions
    };

    // Act
    wrapper.setProps({ ...newProps });
    wrapper.update();

    // Assert
    expect(wrapper.find(".completed-question").length).toBe(2);
  });
});
