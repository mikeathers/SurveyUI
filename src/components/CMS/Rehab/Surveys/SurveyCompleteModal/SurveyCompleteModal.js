import React, { Component } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import {withErrorHandling} from "HOCs";
import {
  FormGroup,
  FormRow,
  ButtonContainer,
  Button,
  Label
} from "components/Common";

import "./SurveyCompleteModal.scss";

class SurveyCompleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screeningDate: new Date(),
      surveySubmitted: false
    };
  }

  handleDateChange = date => {
    this.setState({ screeningDate: date });
    this.props.returnCompletedDate(date);
  };

  completeSurvey = () => {
    this.setState({ surveySubmitted: true });
    this.props.completeSurvey();
  };

  render() {
    const { isModalOpen, closeModal } = this.props;
    const { surveySubmitted } = this.state;
    return (
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        contentLabel="Complete Survey Modal"
        className="survey-complete-modal"
      >
        <div className="survey-complete-modal__title">
          <h3>Survey Completed</h3>
        </div>
        <hr />
        <div className="survey-complete-modal__body">
          <p>
            Make sure all questions have been answered correctly before
            continuing
          </p>
          <FormRow>
            <FormGroup flexBasis="100">
              <Label text="Completed Date:" />
              <DatePicker
                selected={this.state.screeningDate}
                onChange={this.handleDateChange}
                dateFormat="dd/MM/yyyy"
              />
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="survey-complete-modal__footer">
          <ButtonContainer justifyContent="flex-end">
            <Button
              secondary
              content="Cancel"
              onClick={closeModal}
              disabled={surveySubmitted}
            />
            <Button
              primary
              content="Continue"
              onClick={this.completeSurvey}
              disabled={surveySubmitted}
              loading={surveySubmitted}
            />
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}

export default withErrorHandling(SurveyCompleteModal);
