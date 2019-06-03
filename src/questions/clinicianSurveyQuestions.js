export const followup1 = [
  {
    answer: "No",
    text: "Continue with survey"
  },
  {
    answer: "Yes",
    text: "Have you been to see A&E or your GP?",
    followUp: [
      {
        answer: "Yes",
        text: "Place case into face to face"
      },
      {
        answer: "No",
        text: "Recommend injured party goes to A&E"
      }
    ]
  }
];

export const followup2 = [
  {
    answer: "No",
    text: "Continue with survey"
  },
  {
    answer: "Yes",
    text: "Did you have the condition before the accident?",
    followUp: [
      {
        answer: "Yes",
        text: "Has your condition worsened since the accident?",
        followUp: [
          {
            answer: "Yes",
            text: "Have you been to A&E or your GP?",
            followUp: [
              {
                answer: "Yes",
                text: "Place case into face to face"
              },
              {
                answer: "No",
                text: "Recommend injured party goes to their GP"
              }
            ]
          }
        ]
      },
      {
        answer: "No",
        text: "Have you had this condition since the accident?",
        followUp: [
          {
            answer: "Yes",
            text: "Have you been to A&E or GP?",
            followUp: [
              {
                answer: "Yes",
                text: "Place case into face to face"
              },
              {
                answer: "No",
                text: "Recommend injured party goes to A&E"
              }
            ]
          },
          {
            answer: "No",
            text: "Continue with the survey",
            followUp: []
          }
        ]
      }
    ]
  }
];

export const followup3 = [
  {
    answer: "No",
    text: "Recommend injured party goes to A&E"
  },
  {
    answer: "Yes"
  }
];

export const questionGroups = [
  {
    type: "Lumbar Spine",
    questionGroupId: 1,
    questions: [
      {
        questionId: 1,
        text:
          "Since the accident do you have any tingling or numbness around your genital area or back passage?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 2,
        text: "Since the accident have you had any changes in sexual function?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 3,
        text:
          "Since the accident have you been stumbling ot losing your balance when walking?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 4,
        text:
          "Since the accident have you had any symptoms of weakness and/or pain that is present in both legs?",
        followup: 1,
        type: "followup1"
      }
    ]
  },
  {
    type: "Cervical Spine",
    questionGroupId: 2,
    questions: [
      {
        questionId: 1,
        text: "Since the accident have you had blurred or double vision?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 2,
        text: "Since the accident have you had any problems with your speech?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 3,
        text: "Since the accident have you had any problems swallowing?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 4,
        text: "Since the accident have you had any continuous dizziness?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 5,
        text:
          "Since the accident have you had a sudden loss of consciousness and falling to the floor?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 6,
        text:
          "Since the accident has your ability to co-ordinate your amrs changed? I.E unable to pick up a cup ",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 7,
        text:
          "Since the accident have you or anybody else noticed any sudden movements of the coloured part of your eye(s)?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 8,
        text:
          "Since the accident is the sensation in and around your mouth and tongue normal?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 9,
        text:
          "Since the accident have you had any repeated and regular nausea/vomiting?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 10,
        text:
          "Since the accident have you had any symptoms of weakness and/or pain that is present in both arms?",
        followup: 1,
        type: "followup1"
      }
    ]
  },
  {
    type: "Thoracic Spine",
    questionGroupId: 3,
    questions: [
      {
        questionId: 1,
        text:
          "Since the accident have you had any problems with deep breathing?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 2,
        text:
          "Since the accident have you had pain radiating from one side of your rib cage to the other?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 3,
        text: "Since the accident is your pain severe and unrelenting?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 4,
        text: "Can you ease the pain?",
        followup: 1,
        type: "followup1"
      },
      {
        questionId: 5,
        text:
          "Since the accident have you had any symptoms of weakness and/or pain that is present in both your arms and legs?",
        followup: 1,
        type: "followup1"
      }
    ]
  },
  {
    type: "Past Medical History",
    questionGroupId: 4,
    questions: [
      {
        questionId: 1,
        text:
          "Before and since your accident have you had any unexplained weight loss?",
        followup: 1,
        type: "followup1"
      }
    ]
  }
];
