import React, { Component } from "react";

import {
  Card,
  Form,
  Label,
  Button,
  FormRow,
  Message,
  FlexBox,
  TextArea,
  FormGroup,
  ButtonContainer
} from "components/Common";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

export default class SOAPForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      planText: "",
      analysisText: "",
      objectiveText: "",
      subjectiveText: "",
      showMessage: false,
      errorMessage: false,
      surveySubmitted: false,
      invalidVASItems: false,
      invalidPSFSItems: false,
      furtherTreatmentAdded: false,
      removeValidationWarning: false,
      soapSurvey: props.soapSurvey !== null ? props.soapSurvey : null
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateListOfStrings = validateListOfStrings.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentWillReceiveProps({
    invalidVASItems,
    invalidPSFSItems,
    furtherTreatmentAdded,
    removeValidationWarning
  }) {
    if (invalidPSFSItems !== undefined) this.setState({ invalidPSFSItems });
    if (invalidVASItems !== undefined) this.setState({ invalidVASItems });

    if (furtherTreatmentAdded !== undefined)
      this.setState({ furtherTreatmentAdded });

    if (removeValidationWarning !== undefined)
      this.setState({ removeValidationWarning }, () => {
        if (removeValidationWarning) this.hideErrorMessage();
      });
  }

  handleChange = (e, { name, value }) => {
    this.hideErrorMessage();
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { planText: this.state.planText },
      { analysisText: this.state.analysisText },
      { objectiveText: this.state.objectiveText },
      { subjectiveText: this.state.subjectiveText }
    ];
  };

  checkIfSurveyCanBeSubmitted = () => {
    return this.state.invalidPSFSItems && this.state.invalidPSFSItems;
  };

  submitSurvey = () => {
    const valid = this.handleVasAndPSFSValdiation();
    var list = validateListOfStrings(this.listToValidate());
    if (valid && list[list.length - 1].isValid) {
      const soapSurvey = {
        planText: this.state.planText,
        actionedBy: this.props.username,
        completedBy: this.props.username,
        caseId: this.props.mi3dCase.caseId,
        analysisText: this.state.analysisText,
        objectiveText: this.state.objectiveText,
        subjectiveText: this.state.subjectiveText
      };
      this.props.showSurveyCompleteModal(soapSurvey);
      this.setState({ surveySubmitted: true });
    } else {
      this.validateItems(list);
      this.setState({ surveySubmitted: false });
      this.showErrorMessage("Please complete all fields before submitting");
    }
  };

  handleVasAndPSFSValdiation = () => {
    const vasValid = this.props.checkIfVASIsValid();
    const psfsValid = this.props.checkIfPSFSIsValid();
    return vasValid && psfsValid;
  };

  clearForm = () => {
    this.removeValidationErrors(this.listToValidate());
    this.setState({
      message: "",
      planText: "",
      analysisText: "",
      objectiveText: "",
      subjectiveText: "",
      showMessage: false,
      errorMessage: false
    });
  };

  showErrorMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: true
    });
  };

  hideErrorMessage = () => {
    this.setState({
      message: "",
      showMessage: false,
      errorMessage: false
    });
  };

  extendCourseDuration = () => {
    this.props.extendCourseDuration();
    this.setState({ furtherTreatmentAdded: true });
  };

  render() {
    const {
      message,
      planText,
      showMessage,
      analysisText,
      errorMessage,
      objectiveText,
      subjectiveText,
      surveySubmitted
    } = this.state;
    return (
      <Card title="SOAP Questions" id="soapForm">
        <FormRow>
          <FormGroup>
            <Label text="Subjective:" />
            <Form>
              <TextArea
                name="subjectiveText"
                value={subjectiveText}
                onChange={this.handleChange}
                id="soapSurveySubjectiveTextBox"
                valid={this.validateItem("subjectiveText").toString()}
              />
            </Form>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label text="Objective:" />
            <Form>
              <TextArea
                name="objectiveText"
                value={objectiveText}
                onChange={this.handleChange}
                id="soapSurveyObjectiveTextBox"
                valid={this.validateItem("objectiveText").toString()}
              />
            </Form>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label text="Analysis:" />
            <Form>
              <TextArea
                name="analysisText"
                value={analysisText}
                onChange={this.handleChange}
                id="soapSurveyAnalysisTextBox"
                valid={this.validateItem("analysisText").toString()}
              />
            </Form>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label text="Plan:" />
            <Form>
              <TextArea
                name="planText"
                value={planText}
                id="soapSurveyPlanTextBox"
                onChange={this.handleChange}
                valid={this.validateItem("planText").toString()}
              />
            </Form>
          </FormGroup>
        </FormRow>
        <ButtonContainer marginTop="15" justifyContent="space-between">
          <Button
            secondary
            id="soapSurveyFurtherTreatmentBtn"
            content="Update Treatment"
            onClick={this.extendCourseDuration}
            disabled={
              this.props.furtherTreatmentAlreadyAdded ||
              this.state.furtherTreatmentAdded
            }
          />
          <FlexBox>
            <Message
              marginRight="20"
              message={message}
              show={showMessage}
              error={errorMessage}
              id="soapSurveyMessage"
            />
            <Button
              primary
              content="Submit Survey"
              id="soapSurveySubmitBtn"
              onClick={this.submitSurvey}
            />
          </FlexBox>
        </ButtonContainer>
      </Card>
    );
  }
}
