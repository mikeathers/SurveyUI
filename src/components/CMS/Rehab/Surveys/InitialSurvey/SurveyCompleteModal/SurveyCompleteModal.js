import React, { Component } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import {withErrorHandling} from "HOCs";

import {
  Label,
  Button,
  FlexBox,
  FormRow,
  FormGroup,
  ButtonContainer
} from "components/Common";

import "./SurveyCompleteModal.scss";

class SurveyCompleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveySubmitted:
        props.surveySubmitted !== undefined ? props.surveySubmitted : false,
      backToCaseSubmitted:
        props.backToCaseSubmitted !== undefined
          ? props.backToCaseSubmitted
          : false,
      goToClinicianSurveySubmitted:
        props.goToClinicianSurveySubmitted !== undefined
          ? props.goToClinicianSurveySubmitted
          : false,
      screeningDate: new Date()
    };
  }

  componentWillReceiveProps({
    surveySubmitted,
    backToCaseSubmitted,
    goToClinicianSurveySubmitted
  }) {
    this.setState({
      surveySubmitted,
      backToCaseSubmitted,
      goToClinicianSurveySubmitted
    });
  }

  handleDateChange = date => {
    this.setState({ screeningDate: date });
    this.props.returnScreeningDate(date);
  };

  render() {
    const {
      closeModal,
      isModalOpen,
      goBackToCase,
      continueToClinicianSurvey
    } = this.props;
    return (
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        contentLabel="Complete Survey Modal"
        className="survey-complete-modal"
      >
        <div className="survey-complete-modal__header">
          <h3>Survey Completed</h3>
        </div>
        <hr />
        <div className="survey-complete-modal__body">
          <p>
            "The Initial Survey has been completed successfully, we are now
            going to ask some further medical questions, that can be of a
            sensitive nature, to determine the right treatment is prescribed for
            your injuries."
          </p>
        </div>
        <FormRow>
          <FormGroup flexBasis="100">
            <Label text="Screening Date:" />
            <DatePicker
              selected={this.state.screeningDate}
              onChange={this.handleDateChange}
              dateFormat="dd/MM/yyyy"
            />
          </FormGroup>
        </FormRow>
        <hr />
        <div className="survey-complete-modal__footer">
          <ButtonContainer marginTop="25" justifyContent="space-between">
            <Button
              secondary
              content="Cancel"
              onClick={closeModal}
              disabled={this.state.surveySubmitted}
            />
            <FlexBox>
              <Button
                secondary
                content="Submit survey and go back to case"
                onClick={goBackToCase}
                disabled={this.state.surveySubmitted}
                loading={this.state.backToCaseSubmitted}
              />
              <Button
                content="Submit survey and continue to clinician survey"
                primary
                onClick={continueToClinicianSurvey}
                disabled={this.state.surveySubmitted}
                loading={this.state.goToClinicianSurveySubmitted}
              />
            </FlexBox>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}

export default withErrorHandling(SurveyCompleteModal);
