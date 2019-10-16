import React, { Component } from "react";
import * as api from "api";
import * as emailTemplates from "helpers/emailTemplates";
import * as systemActivities from "helpers/systemActivities";

import {
  emailInstructingParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import { addSystemActivity, updateSystemActivity } from "helpers/util";

import Modal from "react-modal";
import {withErrorHandling} from "HOCs";

import {
  Label,
  Input,
  Button,
  FormRow,
  FlexBox,
  Message,
  FormGroup,
  ButtonContainer
} from "components/Common";

import {
  validateItems,
  validateItem,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import "./UpdateCaseDetailsModal.scss";

class UpdateCaseDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chaseType: "",
      message: "",
      showMessage: false,
      errorMessage: false,
      extendedCourseDuration: 0,
      courseDetailsSubmitted: false,
      extendedNumberOfPrescribedExercises: 0,
      salasoId: props.salasoId !== undefined ? props.salasoId : "",
      courseDuration:
        props.courseDuration !== undefined ? props.courseDuration : "",
      numberOfPrescribedExercises:
        props.numberOfPrescribedExercises !== undefined
          ? props.numberOfPrescribedExercises
          : "",
      furtherTreatmentChaseNeeded:
        props.furtherTreatmentChaseNeeded !== undefined
          ? props.furtherTreatmentChaseNeeded
          : false
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.emailInstructingParty = emailInstructingParty.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
  }

  componentDidMount() {
    if (this.props.bluedogCase !== undefined)
      this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  componentWillReceiveProps({ furtherTreatmentChaseNeeded, chaseType }) {
    if (furtherTreatmentChaseNeeded !== undefined)
      this.setState({ furtherTreatmentChaseNeeded });
    if (chaseType !== undefined) this.setState({ chaseType });
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    if (name === "courseDuration" || name === "numberOfPrescribedExercises") {
      if (value >= 0 && value <= 30) this.setState({ [name]: value });
    } else this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { salasoId: this.state.salasoId.toString() },
      {
        extendedCourseDuration:
          this.state.extendedCourseDuration === 0
            ? ""
            : this.state.extendedCourseDuration
      },
      {
        extendedNumberOfPrescribedExercises:
          this.state.extendedNumberOfPrescribedExercises === 0
            ? ""
            : this.state.numberOfPrescribedExercises
      }
    ];
  };

  validateCourseDuration = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.setCourseDetails();
      if (
        this.state.furtherTreatmentChaseNeeded &&
        this.state.chaseType === "Discharge"
      )
        setTimeout(() => this.props.goBackToCase(), 3000);
    } else {
      this.validateItems(list);
      this.showErrorMessage("Please fill in all fields before submitting");
    }
  };

  courseDetails = () => ({
    salasoId: this.state.salasoId,
    chaseType: this.state.chaseType,
    actionedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId,
    courseDurationInWeeks: this.state.courseDuration,
    extendedCourseDuration: this.state.extendedCourseDuration,
    furtherTreatmentNeeded: this.state.furtherTreatmentChaseNeeded,
    numberOfPrescribedExercises: this.state.numberOfPrescribedExercises,
    extendedNumberOfPrescribedExercises: this.state
      .extendedNumberOfPrescribedExercises
  });

  setCourseDetails = async () => {
    const response = await api.setCourseDetails(this.courseDetails());
    this.setState({ courseDetailsSubmitted: true });
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.chaseType === "Discharge" &&
          this.props.updateMi3dCase(response.data);
        this.props.chaseType === "SOAP" &&
          this.props.returnFurtherTreatmentAdded();
        this.showSuccessMessage("Treatment has been updated successfully");
        setTimeout(() => this.props.closeModal(), 2000);
        await this.handleEmailInstructingParty();
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  handleEmailInstructingParty = async () => {
    const { bluedogCaseValues } = this.state;
    const { chaseType } = this.props;
    let activity;
    const emailTemplateName = emailTemplates.emailInsPCourseDurationExtended;

    if (chaseType === "Discharge")
      activity = systemActivities.emailInsPCourseDurationExtendedDischarge;
    else activity = systemActivities.emailInsPCourseDurationExtendedSOAP;

    const systemActivity = {
      activity,
      type: "Email",
      state: "Pending",
      emailTemplateName,
      bluedogActionName: null,
      surveyDocumentNeedsSending: false,
      sendTo: "Instructing Party"
    };

    await this.emailInstructingParty(
      systemActivity,
      emailTemplateName,
      bluedogCaseValues
    );
  };

  showErrorMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: true,
      courseDetailsSubmitted: false
    });
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: false
    });
  };

  render() {
    return (
      <Modal
        ariaHideApp={false}
        id="updateCaseDetailsModal"
        isOpen={this.props.isModalOpen}
        className="update-case-details-modal"
        contentLabel="Update Case Detils Modal"
      >
        <div className="update-case-details-modal__header">
          <h3>Update Course Duration</h3>
        </div>

        <hr />

        <div className="update-case-details-modal__body">
          <FormRow marginBottom="15">
            <FormGroup flexBasis="30">
              <Label text="Salaso ID:" />
              <FlexBox alignItems="center">
                <Input
                  width="40"
                  type="number"
                  name="salasoId"
                  marginright="10"
                  placeholder="12345"
                  id="salasoIdTextBox"
                  value={this.state.salasoId}
                  onChange={this.handleChange}
                  valid={this.validateItem("salasoId").toString()}
                />
              </FlexBox>
            </FormGroup>
          </FormRow>

          <FormRow marginBottom="15">
            <FormGroup flexBasis="30">
              <Label text="Extended Course Duration:" />
              <FlexBox alignItems="center">
                <Input
                  width="40"
                  type="number"
                  placeholder="10"
                  marginright="10"
                  onChange={this.handleChange}
                  name="extendedCourseDuration"
                  id="extendedCourseDurationTextBox"
                  value={this.state.extendedCourseDuration}
                  valid={this.validateItem("extendedCourseDuration").toString()}
                />
                <p>weeks</p>
              </FlexBox>
            </FormGroup>

            <FormGroup flexBasis="50">
              <Label text="Extended Number of Prescribed Exercises:" />
              <FlexBox alignItems="center">
                <Input
                  width="40"
                  type="number"
                  placeholder="5"
                  marginright="10"
                  onChange={this.handleChange}
                  name="extendedNumberOfPrescribedExercises"
                  id="extendedNumberOfPrescribedExercisesTextBox"
                  value={this.state.extendedNumberOfPrescribedExercises}
                  valid={this.validateItem(
                    "extendedNumberOfPrescribedExercises"
                  ).toString()}
                />
              </FlexBox>
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="update-case-details-modal__footer">
          <ButtonContainer
            justifyContent={
              this.state.showMessage ? "space-between" : "flex-end"
            }
          >
            <Message
              marginRight={35}
              id="updateCaseDetailsMessage"
              message={this.state.message}
              show={this.state.showMessage}
              error={this.state.errorMessage}
            />
            <FlexBox>
              <Button
                content="Cancel"
                secondary
                onClick={this.props.cancel}
                disabled={this.state.courseDetailsSubmitted}
              />
              <Button
                primary
                content="Update"
                id="updateCourseDurationBtn"
                onClick={this.validateCourseDuration}
                disabled={this.state.courseDetailsSubmitted}
                loading={this.state.courseDetailsSubmitted}
              />
            </FlexBox>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
export default withErrorHandling(UpdateCaseDetailsModal);
