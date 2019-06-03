import React, { Component } from "react";
import { Row, Col, Card } from "components/Common";
import { questionGroups } from "questions/clinicianSurveyQuestions";
import Question from "./Question/Question";
import Actions from "./Actions/Actions";
import "./ClinicianSurvey.scss";

export default class ClinicianSurvey extends Component {
  state = {
    offSetTop: 0
  };
  componentWillMount() {
    window.addEventListener("scroll", () => {
      this.setState({ offSetTop: window.scrollY });
    });
  }
  renderQuestions = (question, key, index) => {
    switch (question.type) {
      case "followup1":
        return <Question question={question} key={key} index={index} />;
    }
  };
  render() {
    return (
      <Row className="clinician-survey">
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              {questionGroups.map((questionGroup, key) => (
                <Card
                  title={questionGroup.type}
                  key={key}
                  collapse={true}
                  isOpenByDefault={false}
                >
                  {questionGroup.questions.map((question, key) =>
                    this.renderQuestions(question, key, ++key)
                  )}
                </Card>
              ))}
            </Col>
          </Row>
        </Col>
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              <Actions offSetTop={this.state.offSetTop} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
