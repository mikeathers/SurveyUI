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

const questions = [
  {
    questionId: 1,
    type: "yesno",
    text: "Did you suffer any injury as a result of the accident?",
    knockout: "No",
    instantKnockout: true,
    knockoutText:
      "You have indicated that you did not experience any symptoms which require physiotherapy. We will not be referring you to a physiotherapist."
  },
  {
    questionId: 2,
    type: "yesno",
    text: "Do you have any symptoms now?",
    knockout: "No",
    instantKnockout: true,
    knockoutText:
      "You have indicated that you are currently not experiencing any symptoms which require physiotherapy. We will not be referring you to a physiotherapist."
  },
  {
    questionId: 3,
    type: "yesno",
    text: "Are you having any treatment, for example Physiotherapy?",
    knockout: "Yes",
    instantKnockout: true,
    knockoutText:
      "You have indicated that you are currently receiving treatment from a physiotherapist therefore we will not be referring you for rehabiliation, however we will send you an information pack containing advice which may be of some assistance."
  },
  {
    questionId: 4,
    type: "selection",
    text: "What areas are affected?",
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
    knockout: {
      count: 3,
      knockoutSelection: bodypartsKnockOuts
    }
  },
  {
    questionId: 5,
    type: "scale",
    text:
      "If zero means 'no pain' and ten means 'pain as bad as it could be'. On a scale or 0-10, what is your level of pain? If more than one area is affected by pain, score the most painful."
  },
  {
    questionId: 6,
    type: "yesno",
    text: "Has there been loss of movement in the affected area(s)?"
  },
  {
    questionId: 7,
    type: "yesno",
    text: "Does pain disturb sleep?"
  },
  {
    questionId: 8,
    type: "yesno",
    text: "Have you developed any headaches following the accident?",
    knockout: "No"
  },
  {
    questionId: 9,
    type: "yesno",
    text:
      "Have you developed any tingling sensations as a result of the accident?"
  },
  {
    questionId: 10,
    type: "yesno",
    text: "Have you returned to work/school?",
    knockout: "Yes"
  },
  {
    questionId: 11,
    type: "yesno",
    text: "Are you participating in your normal hobbies?",
    knockout: "Yes"
  },
  {
    questionId: 12,
    type: "yesno",
    text: "Are you taking pain killers?"
  }
];
export default questions;
