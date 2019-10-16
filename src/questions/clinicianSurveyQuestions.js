const painDescriptions = [
  {
    text: "Dull Ache",
    value: "Dull Ache"
  },
  {
    text: "Sharp",
    value: "Sharp"
  },
  {
    text: "Stabbing",
    value: "Stabbing"
  },
  {
    text: "Shooting",
    value: "Shooting"
  },
  {
    text: "Burning",
    value: "Burning"
  },
  {
    text: "Other",
    value: "Other"
  }
];

const painFrequency = [
  {
    text: "Constant",
    value: "Constant"
  },
  {
    text: "Intermittent",
    value: "Intermittent"
  }
];

export const followup1 = [
  {
    answer: "Yes",
    questionText: "Have you been to A&E or your GP?",
    followUp: [
      {
        answer: "Yes",
        questionText: "Place case into face to face"
      },
      {
        answer: "No",
        questionText: "Recommend injured party goes to A&E"
      }
    ]
  }
];

export const followup2 = [
  {
    answer: "Yes",
    questionText: "Have you been to A&E or your GP?",
    followUp: [
      {
        answer: "Yes",
        questionText: "Place case into face to face"
      },
      {
        answer: "No",
        questionText: "Recommend injured party goes to see their GP"
      }
    ]
  }
];

export const followup3 = [
  {
    answer: "Yes",
    questionText: "Did you have the condition before the accident?",
    followUp: [
      {
        answer: "Yes",
        questionText: "Has your condition worsened since the accident?",
        followUp: [
          {
            answer: "Yes",
            questionText: "Have you been to A&E or your GP?",
            followUp: [
              {
                answer: "Yes",
                questionText: "Place case into face to face"
              },
              {
                answer: "No",
                questionText: "Recommend injured party goes to their GP"
              }
            ]
          }
        ]
      },
      {
        answer: "No",
        questionText: "Has this condition occured following the accident?",
        followUp: [
          {
            answer: "Yes",
            questionText: "Have you been to A&E or GP?",
            followUp: [
              {
                answer: "Yes",
                questionText: "Place case into face to face"
              },
              {
                answer: "No",
                questionText: "Recommend injured party goes to A&E"
              }
            ]
          }
        ]
      }
    ]
  }
];

export const followup4 = [
  {
    answer: "Yes",
    questionText: "Place case in face to face"
  }
];

export const followup5 = [
  {
    answer: "Yes",
    questionText: "Did you have the condition before the accident?",
    followUp: [
      {
        answer: "Yes",
        questionText: "Has your condition worsened since the accident?",
        followUp: [
          {
            answer: "Yes",
            questionText: "Have you been to A&E or your GP?",
            followUp: [
              {
                answer: "Yes",
                questionText:
                  "Clinical fact finding- outcome based on information provided- case can go into F2F or Mi3D"
              },
              {
                answer: "No",
                questionText:
                  "Recommend injured party goes to their GP or A&E or continue with script"
              }
            ]
          }
        ]
      },
      {
        answer: "No",
        questionText: "Has this condition occured following the accident?",
        followUp: [
          {
            answer: "Yes",
            questionText: "Have you been to A&E or GP?",
            followUp: [
              {
                answer: "Yes",
                questionText:
                  "Clinical fact finding- outcome based on information provided- case can go into F2F or Mi3D"
              },
              {
                answer: "No",
                questionText:
                  "Recommend injured party goes to A&E or GP or continue with script"
              }
            ]
          }
        ]
      }
    ]
  }
];

export const knockoutQuestions = [
  {
    type: "Lumbar Spine",
    id: "lumbarSpine",
    questionGroupId: 1,
    openByDefault: false,
    questions: [
      {
        questionId: 1,
        questionText: "Since the accident, has your bladder function changed?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 2,
        questionText: "Since the accident, has your bowel function changed?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 3,
        questionText:
          "Since the accident do you have any tingling or numbness around your genital area or back passage?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 4,
        questionText:
          "Since the accident have you had any changes in sexual function?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 5,
        questionText:
          "Since the accident have you been stumbling or losing your balance when walking?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 6,
        questionText:
          "Since the accident have you had any symptoms of weakness and/or pain that is present in both legs?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      }
    ]
  },
  {
    type: "Cervical Spine",
    id: "cervicalSpine",
    questionGroupId: 2,
    openByDefault: false,
    questions: [
      {
        questionId: 1,
        questionText:
          "Since the accident have you had blurred or double vision?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 2,
        questionText:
          "Since the accident have you had any problems with your speech?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 3,
        questionText:
          "Since the accident have you had any problems swallowing?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 4,
        questionText:
          "Since the accident have you had any continuous dizziness?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 5,
        questionText:
          "Since the accident have you had a sudden loss of consciousness and falling to the floor?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 6,
        questionText:
          "Since the accident has your ability to co-ordinate your arms changed? I.E unable to pick up a cup ",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 7,
        questionText:
          "Since the accident have you or anybody else noticed any sudden movements of the coloured part of your eye(s)?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 8,
        questionText:
          "Since the accident is the sensation in and around your mouth and tongue impaired?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 9,
        questionText:
          "Since the accident have you had any repeated and regular nausea/vomiting?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 10,
        questionText:
          "Since the accident have you had any symptoms of weakness and/or pain that is present in both arms?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      }
    ]
  },
  {
    type: "Thoracic Spine",
    id: "thoracicSpine",
    questionGroupId: 3,
    openByDefault: false,
    questions: [
      {
        questionId: 1,
        questionText:
          "Since the accident have you had any problems with deep breathing?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 2,
        questionText:
          "Since the accident have you had pain radiating from one side of your rib cage to the other?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 3,
        questionText: "Since the accident is your pain severe and unrelenting?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 4,
        questionText: "Can you ease the pain?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      },
      {
        questionId: 5,
        questionText:
          "Since the accident have you had any symptoms of weakness and/or pain that is present in both your arms and legs?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "followup"
      }
    ]
  }
];

export const questionGroups = [
  {
    type: "Past Medical History",
    id: "pastMedicalHistory",
    openByDefault: true,
    questionGroupId: 4,
    questions: [
      {
        questionId: 1,
        questionText:
          "Before and since your accident have you had any unexplained weight loss?",
        followup: 2,
        followUpToDisplay: "followUpTwo",
        type: "followup"
      },
      {
        questionId: 2,
        questionText: "Do you have Diabetes?",
        followup: 1,
        followUpToDisplay: "followUpOne",
        type: "diabetes"
      },
      {
        questionId: 3,
        questionText: "Do you have Epilepsy?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "followup"
      },
      {
        questionId: 4,
        questionText: "Do you have a heart problem?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "followup"
      },
      {
        questionId: 5,
        questionText: "Do you have a circulatory or blood pressure problem?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "followup"
      },
      {
        questionId: 6,
        questionText: "Do you have any respiratory problems?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "followup"
      },
      {
        questionId: 7,
        questionText: "Do you have a Osteopenia or Osteoprosis?",
        followup: 4,
        followUpToDisplay: "followUpFour",
        type: "followup"
      },
      {
        questionId: 8,
        questionText: "Do you have Rheumatoid Arthritis or Osteoarthritis?",
        followup: 4,
        followUpToDisplay: "followUpFour",
        type: "followup"
      },
      {
        questionId: 9,
        questionText:
          "Have you had any operations (including previous spinal surgery/surgery to injured sites)? ",
        followup: 4,
        followUpToDisplay: "followUpFour",
        type: "factfinding"
      },
      {
        questionId: 10,
        questionText: "Have you ever had cancer?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "factfinding"
      },
      {
        questionId: 11,
        questionText: "If female, are you/could you be pregnant?",
        followup: 4,
        followUpToDisplay: "followUpFour",
        type: "followup"
      },
      {
        questionId: 12,
        questionText:
          "Do you suffer from any pre-existing conditions and if so, have your symptoms worsened since the accident?",
        followup: 5,
        followUpToDisplay: "followUpFive",
        type: "followup"
      },
      {
        questionId: 13,
        questionText:
          "Have you broken any bones previously or in the accident?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "factfinding"
      }
    ]
  },
  {
    type: "Full Drug History",
    id: "fullDrugHistory",
    questionGroupId: 5,
    openByDefault: false,
    questions: [
      {
        questionId: 1,
        questionText:
          "Are you taking any regular prescribed or non-prescribed medication, ie steroids or anti-coagulants?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "painkillers",
        options: [
          "Ibuprofen",
          "Paracetamol",
          "Naproxen",
          "Diazepam",
          "Co-codamol",
          "Other"
        ]
      }
    ]
  },
  {
    type: "Additional Information",
    id: "additionalInformation",
    openByDefault: true,
    questionGroupId: 6,
    questions: [
      {
        questionId: 1,
        questionText:
          "Is there anything else in your medical or social history that we might have missed that you would like to add?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "factfinding"
      },
      {
        questionId: 2,
        questionText: "What is your occupation?",
        followup: 3,
        followUpToDisplay: "followUpThree",
        type: "freetext"
      }
    ]
  }
];

export const bodyPartQuestions = {
  questionGroupId: 7,
  type: "Injured Body Parts",
  id: "injuredBodyParts",
  openByDefault: true,
  questions: [
    {
      questionId: 1,
      questionText:
        "Based on injuries you sustained (as previously discussed), please rate the pain and discomfort on a scale of 0-10",
      type: "scale"
    },
    {
      questionId: 2,
      questionText:
        "Would you describe the pain as being constant or intermittent?",
      type: "dropdown",
      options: painFrequency
    },
    {
      questionId: 3,
      questionText: "How would you describe the pain?",
      type: "dropdown",
      options: painDescriptions
    },
    {
      questionId: 4,
      questionText: "Do you have pain that is present throughout the night?",
      followup: 5,
      followUpToDisplay: "followUpFive",
      type: "followup"
    },
    {
      questionId: 5,
      questionText: "What aggravates your symptoms?",
      type: "freetext"
    },
    {
      questionId: 6,
      questionText: "What eases your symptoms?",
      type: "freetext"
    }
  ]
};
