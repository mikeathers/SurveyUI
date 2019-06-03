import React, { Component } from "react";
import { Form, TextArea } from "components/Common";
import { followUp } from "questions/clinicianSurveyQuestions";
import "./Question.scss";

export default class Question extends Component {
  render() {
    const { question, index } = this.props;
    return (
      <div className="clinician-question">
        <div>
          <p className="clinician-question__first">
            <span>{index}</span>
            {question.text}
          </p>

          <p className="clinician-question__referral">
            Refer to: Follow up {question.followup}
          </p>
        </div>
        <Form>
          <p>Additional Information:</p>
          <TextArea />
        </Form>
      </div>
    );
  }
}
