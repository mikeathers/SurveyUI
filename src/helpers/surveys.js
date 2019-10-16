import * as api from "api";
import moment from "moment";
import _ from "lodash";

export async function createInitialSurveyDocument(
  completedQuestions,
  completedDate,
  injuredPartyDetails
) {
  const surveyForDocumentBuilder = {
    completedQuestions: completedQuestionsForDocument(completedQuestions),
    completedDate,
    ...injuredPartyDetails
  };

  const response = await api.createInitialSurveyDocument(
    surveyForDocumentBuilder
  );

  if (response !== undefined) {
    if (response.status === 200) {
      const documentPath = response.data;
      await addDocumentToMi3DCase(
        "Initial Survey",
        "Survey",
        documentPath,
        this.props.bluedogCase.bluedogCaseRef,
        this.props.username,
        this.props.mi3dCase.caseId,
        this.getCase,
        this.props.showErrorModal,
        completedDate
      );
      return documentPath;
    } else {
      const errors = {
        errorMessages: response.data,
        serviceName: "DocumentBuilder",
        functionName: "CreateSurveyDocument",
        actionedBy: this.props.username
      };
      api.logErrors(errors);
      return null;
    }
  }
  this.props.showErrorModal();
}

export async function createClinicianSurveyDocument(
  clinicianSurvey,
  injuredPartyDetails
) {
  const questionGroups = getQuestionGroupsForCompletedQuestions(
    clinicianSurvey.completedQuestions
  );

  const completedQuestionGroups = sortCompletedQuestionsIntoQuestionGroups(
    clinicianSurvey.completedQuestions,
    questionGroups
  );

  const survey = clinicianSurveyForDocumentBuilder(
    completedQuestionGroups,
    injuredPartyDetails,
    clinicianSurvey.completedDate
  );

  const parsedPsfsActivities = clinicianSurvey.completedClinicianSurveyPsfsActivities.map(
    activity => ({
      ...activity,
      initialPainScore: activity.painScore
    })
  );

  const clinicianSurveyToSave = {
    ...survey,
    wadScore: clinicianSurvey.wadScore,
    wadText: clinicianSurvey.wadText,
    psfsActivities: parsedPsfsActivities,
    bluedogCaseRef: this.props.bluedogCase.bluedogCaseRef
  };

  const response = await api.createClinicianSurveyDocument(
    clinicianSurveyToSave
  );

  if (response !== undefined) {
    if (response.status === 200) {
      const documentPath = response.data;
      await addDocumentToMi3DCase(
        "Clinician Survey",
        "Survey",
        documentPath,
        this.props.bluedogCase.bluedogCaseRef,
        this.props.username,
        this.props.mi3dCase.caseId,
        this.getCase,
        this.props.showErrorModal,
        clinicianSurvey.completedDate
      );
      return documentPath;
    } else {
      const errors = {
        errorMessages: response.data,
        serviceName: "DocumentBuilder",
        functionName: "CreateSurveyDocument",
        actionedBy: this.props.username
      };
      api.logErrors(errors);
    }
  } else this.props.showErrorModal();
}

export async function createSOAPSurveyDocument(
  soapForm,
  injuredPartyDetails,
  completedDate
) {
  const survey = {
    ...soapForm,
    ...injuredPartyDetails,
    clinicianName: this.props.username,
    completedDate: completedDate
  };
  const response = await api.createSOAPSurveyDocument(survey);
  if (response !== undefined) {
    if (response.status === 200) {
      const documentPath = response.data;
      await addDocumentToMi3DCase(
        "SOAP Survey",
        "Survey",
        documentPath,
        this.props.bluedogCase.bluedogCaseRef,
        this.props.username,
        this.props.mi3dCase.caseId,
        this.getCase,
        this.props.showErrorModal,
        completedDate
      );
      return documentPath;
    } else {
      const errors = {
        errorMessages: response.data,
        serviceName: "DocumentBuilder",
        actionedBy: this.props.username,
        functionName: "CreateSurveyDocument"
      };
      api.logErrors(errors);
    }
  } else this.props.showErrorModal();
}

export async function createDischargeSurveyDocument(
  dischargeSurveyDetails,
  completedDate
) {
  const response = await api.createDischargeSurveyDocument(
    dischargeSurveyDetails
  );
  if (response !== undefined) {
    if (response.status === 200) {
      const documentPath = response.data;
      await addDocumentToMi3DCase(
        "Discharge Survey",
        "Survey",
        documentPath,
        this.props.bluedogCase.bluedogCaseRef,
        this.props.username,
        this.props.mi3dCase.caseId,
        this.getCase,
        this.props.showErrorModal,
        completedDate
      );
      return documentPath;
    } else {
      const errors = {
        errorMessages: response.data,
        serviceName: "DocumentBuilder",
        actionedBy: this.props.username,
        functionName: "CreateSurveyDocument"
      };
      api.logErrors(errors);
    }
  } else this.props.showErrorModal();
}

const addDocumentToMi3DCase = async (
  name,
  type,
  documentPath,
  bluedogCaseRef,
  username,
  caseId,
  getCase,
  showErrorModal,
  completedDate = ""
) => {
  let parsedDate = moment(completedDate).format("DD/MM/YYYY");
  const surveyDocument = {
    path: documentPath,
    name,
    type,
    completedDate: parsedDate,
    actionedBy: username,
    caseId
  };

  const response = await api.addDocumentToCase(surveyDocument);

  if (response !== undefined) getCase(caseId);
  else showErrorModal();

  const document = {
    path: documentPath,
    filename: name === "Discharge Survey" ? "RH Discharge Report" : name,
    bluedogCaseRef
  };
  await addDocumentToBluedogCase(document);
};

const addDocumentToBluedogCase = async document => {
  await api.addDocumentToBluedogCase(document);
};

const getQuestionGroupsForCompletedQuestions = questions => {
  let questionGroups = [];
  questions.forEach(question => {
    if (!questionGroups.includes(question.questionGroupId))
      questionGroups.push(question.questionGroupId);
    else return;
  });

  let questionGroupsWithQuestions = [];

  questionGroups.forEach(questionGroup => {
    let bodyPart;
    let questionGroupName;
    if (questionGroup.includes("_")) {
      bodyPart = questionGroup
        .split("_")
        .pop()
        .replace(/([A-Z])/g, " $1")
        .trim();
    } else {
      questionGroupName = questionGroup.split(/(?=[A-Z])/).join(" ");
      questionGroupName =
        questionGroupName.charAt(0).toUpperCase() + questionGroupName.slice(1);
    }

    const group = {
      id: questionGroup,
      name:
        bodyPart !== undefined
          ? `Injured Body Part - ${bodyPart}`
          : questionGroupName,
      completedQuestions: []
    };
    questionGroupsWithQuestions.push(group);
  });

  return questionGroupsWithQuestions;
};

const sortCompletedQuestionsIntoQuestionGroups = (
  questions,
  questionGroups
) => {
  questions.forEach(question => {
    questionGroups.forEach(group => {
      if (question.questionGroupId === group.id) {
        group.completedQuestions.push(question);
      }
    });
  });

  return questionGroups;
};

const completedQuestionsForDocument = completedQuestions => {
  const parsedCompletedQuestions = completedQuestions.map(question => {
    switch (question.type) {
      case "selection":
        const answer = seperateSelectionAnswersWithCommans(question);
        return {
          answer,
          questionId: question.questionId,
          question: question.questionText,
          additionalInfo:
            question.additionalInfo !== undefined ? question.additionalInfo : ""
        };
      case "scale":
        return {
          question: question.questionText,
          questionId: question.questionId,
          answer: question.scaleAnswer.toString(),
          additionalInfo:
            question.additionalInfo !== undefined ? question.additionalInfo : ""
        };
      case "yesno":
        return {
          answer: question.yesNoAnswer,
          question: question.questionText,
          questionId: question.questionId,
          additionalInfo:
            question.additionalInfo !== undefined ? question.additionalInfo : ""
        };
      case "text":
        return {
          answer: question.textAnswer,
          questionId: question.questionId,
          question: question.questionText,
          additionalInfo:
            question.additionalInfo !== undefined ? question.additionalInfo : ""
        };
      case "dropdown":
        return {
          question: question.questionText,
          answer: question.dropdownAnswer,
          questionId: question.questionId,
          additionalInfo:
            question.additionalInfo !== undefined ? question.additionalInfo : ""
        };
      default:
        break;
    }
    return null;
  });

  return _.orderBy(parsedCompletedQuestions, ["questionId"]);
};

const seperateSelectionAnswersWithCommans = question => {
  let answer = "";
  question.selectionAnswers.forEach((word, key) =>
    ++key === question.selectionAnswers.length
      ? (answer += word)
      : (answer += word + ", ")
  );
  return answer;
};

const clinicianSurveyForDocumentBuilder = (
  completedQuestionGroups,
  injuredPartyDetails,
  completedDate
) => {
  const parsedCompletedQuestionGroups = completedQuestionGroups.map(group => ({
    ...group,
    completedQuestions: completedQuestionsForDocument(group.completedQuestions)
  }));
  return {
    completedQuestionGroups: parsedCompletedQuestionGroups,
    completedDate,
    ...injuredPartyDetails
  };
};
