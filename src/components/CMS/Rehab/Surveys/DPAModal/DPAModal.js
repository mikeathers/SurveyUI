import React, { Component } from "react";
import Modal from "react-modal";
import {
  ButtonContainer,
  Button,
  Label,
  Dropdown,
  Form,
  FormRow,
  FormGroup,
  TextArea
} from "components/Common";
import "./DPAModal.scss";

export default class DPAModal extends Component {
  render() {
    const reasons = [
      {
        text: "The client feels physiotherapy will not benefit them",
        value: "1"
      },
      {
        text: "The client is concerned about being liable for payment",
        value: "2"
      }
    ];
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isModalOpen}
        contentLabel="DPA Modal"
        className="dpa-modal"
      >
        <div className="dpa-modal__title">
          <h3>Put the case on hold</h3>
        </div>
        <hr />
        <div className="dpa-modal__body">
          <FormRow>
            <p className="dpa-modal__text">
              Unfortunately if we are unable to disclose information to others
              invloved in the processing of your claim we cannot continue with
              the questionnaire. Thank you for your time.
            </p>
          </FormRow>
          <FormRow marginBottom="25">
            <FormGroup flexBasis="100">
              <Label width="100" text={this.props.reasonText} />
              <Dropdown
                selection
                options={reasons}
                placeholder="Select Reason.."
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup flexBasis="100">
              <Label width="100" text="Additional Information" />
              <Form>
                <TextArea />
              </Form>
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="dpa-modal__footer">
          <ButtonContainer justifyContent="flex-end" marginTop="25">
            <Button
              content="Cancel"
              secondary
              onClick={this.props.closeModal}
            />
            <Button content={this.props.buttonContent} primary />
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
