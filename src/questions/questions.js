const questions = [
  {
    id: 1,
    type: "text",
    text:
      "What activities have you not been able to complete since the accident?"
  },
  {
    id: 2,
    type: "scale",
    text: "On a scale of 1 to 10, how much pain are you in?"
  },
  {
    id: 3,
    type: "multichoice",
    text: "How much pain are you currently in?",
    answers: ["Lots of pain", "A moderate amount of pain", "Not that much pain"]
  },
  {
    id: 4,
    type: "selection",
    text: "Which parts of your body hurt?",
    options: [
      "Head",
      "Neck",
      "Right Shoulder",
      "Left Shoulder",
      "Chest",
      "Right Arm",
      "Left Arm",
      "Right Hip",
      "Left Hip",
      "Right Knee",
      "Left Knee",
      "Right Foot",
      "Left Foot"
    ]
  },
  {
    id: 5,
    type: "yesno",
    text: "Are you currently seeing a physiotherapist?",
    followupUsed: true,
    followup: {
      answerToTrigger: "Yes",
      action: "showDropdown",
      question: "Who arranged the treatment?",
      options: [
        {
          text: "GP",
          value: "GP"
        },
        {
          text: "Insurer",
          value: "Insurer"
        },
        {
          text: "Solicitor",
          value: "Solicitor"
        }
      ]
    }
  }
];

export default questions;
