import React, { Component } from "react";
import * as reason from "helpers/stopCaseReasons";
import {
  Card,
  Label,
  Input,
  Button,
  Message,
  FormRow,
  FlexBox,
  Checkbox,
  FormGroup,
  ButtonContainer
} from "components/Common";

class CourseDurationForm extends Component {
  faceToFaceRequested = () => {
    this.props.handleOpenStopCaseModal(
      "Injured party has requested Face to Face treatment",
      "Stop Case",
      "We would be happy to refer you to face to face treatment.",
      reason.clinicianSurveyCompletedF2FRequested
    );
  };

  treatmentDeclined = () => {
    this.props.handleOpenStopCaseModal(
      "Injured party has declined any further treatment",
      "Stop Case",
      "Are you sure you don't want to proceed with any further treatment?",
      reason.clinicianSurveyCompletedTreatmentDeclined
    );
  };

  render() {
    const {
      message,
      salasoId,
      showMessage,
      validateItem,
      errorMessage,
      handleChange,
      completeSurvey,
      courseDuration,
      surveyCompleted,
      prescribedExercises,
      surpressCorrespondence,
      handleSurpressCorrespondence
    } = this.props;
    return (
      <Card title="Complete Survey">
        <div className="completed-survey__course-duration">
          <FormRow>
            <FormGroup>
              <Label text="Salaso Course ID:" />
              <FlexBox alignItems="center">
                <Input
                  type="number"
                  name="salasoId"
                  marginright="10"
                  value={salasoId}
                  placeholder="12345"
                  onChange={handleChange}
                  valid={validateItem("salasoId").toString()}
                />
              </FlexBox>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label text="Course Duration:" />
              <FlexBox alignItems="center">
                <Input
                  type="number"
                  marginright="10"
                  name="courseDuration"
                  placeholder="10"
                  value={courseDuration}
                  onChange={handleChange}
                  valid={validateItem("courseDuration").toString()}
                />
                <p>weeks</p>
              </FlexBox>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label text="Number of Prescribed Exercises:" />
              <FlexBox alignItems="center">
                <Input
                  type="number"
                  placeholder="10"
                  marginright="10"
                  onChange={handleChange}
                  name="prescribedExercises"
                  value={prescribedExercises}
                  valid={validateItem("prescribedExercises").toString()}
                />
              </FlexBox>
            </FormGroup>
          </FormRow>
          <FormRow marginTop="15">
            <FormGroup flexBasis="100" inline>
              <Checkbox
                label="Surpress Instructing Party Correspondence:"
                checked={surpressCorrespondence}
                onChange={handleSurpressCorrespondence}
              />
            </FormGroup>
          </FormRow>

          <Message
            marginRight={35}
            message={message}
            show={showMessage}
            error={errorMessage}
          />
          <ButtonContainer marginTop="25" justifyContent="flex-end">
            <Button
              secondary
              onClick={this.treatmentDeclined}
              content="Injured party declined treatment"
            />
            <Button
              secondary
              onClick={this.faceToFaceRequested}
              content="Face to face requested"
            />

            <Button
              primary
              onClick={completeSurvey}
              disabled={surveyCompleted}
              loading={surveyCompleted}
              content="Happy to continue with Mi3D"
            />
          </ButtonContainer>
        </div>
      </Card>
    );
  }
}

export default CourseDurationForm;
