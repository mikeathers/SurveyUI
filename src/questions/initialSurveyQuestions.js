import * as stopCaseReasons from "helpers/stopCaseReasons";

const bodypartsKnockOuts = [
  ["Neck", "Right Arm"],
  ["Neck", "Left Arm"],
  ["Upper Back", "Right Arm"],
  ["Upper Back", "Left Arm"],
  ["Mid Back", "Right Leg"],
  ["Mid Back", "Left Leg"],
  ["Lower Back", "Right Leg"],
  ["Lower Back", "Left Leg"],
  ["Neck", "Lower Back"]
];

export const faceToFaceStatement =
  "The answers you have provided indicate that you need face to face treatment";
export const noTreatmentNeededStatement =
  "The answers you have provided indicate that you dont need treatment";

export const questions = [
  {
    questionId: 1,
    type: "yesno",
    questionText: "Did you suffer any injury as a result of the accident?",
    instantKnockoutAnswer: "No",
    instantKnockout: true,
    stopCaseReason: stopCaseReasons.initialSurveyKONoInjury,
    statement:
      "You have indicated that you did not experience any symptoms which require physiotherapy. We will not be referring you to a physiotherapist."
  },
  {
    questionId: 2,
    type: "yesno",
    questionText: "Do you have any symptoms now?",
    instantKnockoutAnswer: "No",
    instantKnockout: true,
    stopCaseReason: stopCaseReasons.initialSurveyKONoSymptoms,
    statement:
      "You have indicated that you are currently not experiencing any symptoms which require physiotherapy. We will not be referring you to a physiotherapist."
  },
  {
    questionId: 3,
    type: "yesno",
    questionText: "Are you having any treatment, for example Physiotherapy?",
    instantKnockoutAnswer: "Yes",
    instantKnockout: true,
    stopCaseReason: stopCaseReasons.initialSurveyKOAlreadyHavingTreatment,
    statement:
      "You have indicated that you are currently receiving treatment from a physiotherapist therefore we will not be referring you for rehabiliation."
  },
  {
    questionId: 4,
    type: "selection",
    questionText: "What areas are affected?",
    options: [
      "Head",
      "Neck",
      "Right Shoulder",
      "Left Shoulder",
      "Chest",
      "Right Arm",
      "Left Arm",
      "Right Leg",
      "Left Leg",
      "Hip",
      "Upper Back",
      "Mid Back",
      "Lower Back"
    ],
    knockoutAnswer: {
      count: 3,
      knockoutSelection: bodypartsKnockOuts
    },
    statement: faceToFaceStatement
  },
  {
    questionId: 5,
    type: "scale",
    questionText:
      "If zero means 'no pain' and ten means 'pain as bad as it could be'. On a scale or 0-10, what is your level of pain? If more than one area is affected by pain, score the most painful.",
    noTreatmentNeededAnswer: 3,
    statement: noTreatmentNeededStatement
  },
  {
    questionId: 6,
    type: "yesno",
    questionText: "Has there been loss of movement in the affected area(s)?",
    knockoutAnswer: "Yes",
    statement: faceToFaceStatement
  },
  {
    questionId: 7,
    type: "yesno",
    questionText: "Does pain disturb sleep?"
  },
  {
    questionId: 8,
    type: "yesno",
    questionText: "Have you developed any headaches following the accident?",
    noTreatmentNeededAnswer: "No",
    statement: noTreatmentNeededStatement
  },
  {
    questionId: 9,
    type: "yesno",
    questionText:
      "Have you developed any tingling sensations as a result of the accident?",
    knockoutAnswer: "Yes",
    statement: faceToFaceStatement
  },
  {
    questionId: 10,
    type: "yesno",
    questionText: "Have you returned to work/school?",
    noTreatmentNeededAnswer: "Yes",
    statement: noTreatmentNeededStatement,
    naQuestion: true
  },
  {
    questionId: 11,
    type: "yesno",
    questionText: "Are you participating in your normal hobbies?",
    noTreatmentNeededAnswer: "Yes",
    statement: noTreatmentNeededStatement
  },
  {
    questionId: 12,
    type: "yesno",
    questionText: "Are you taking pain killers?"
  }
];
