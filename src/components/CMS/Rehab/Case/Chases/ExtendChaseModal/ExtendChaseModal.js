import React, { Component } from "react";
import * as api from "api";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import {withErrorHandling} from "HOCs";

import {
  Label,
  Button,
  Message,
  FlexBox,
  FormRow,
  FormGroup,
  ButtonContainer
} from "components/Common";

import "./ExtendChaseModal.scss";

class ExtendChaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      showMessage: false,
      errorMessage: false,
      newChaseDate: new Date(),
      updateChaseDateSubmitted: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleNewChaseDateChange = date => {
    this._isMounted && this.setState({ newChaseDate: date });
  };

  chaseToExtend = () => ({
    chaseDate: this.state.newChaseDate,
    actionedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId,
    chaseId: this.props.chase.chaseId
  });

  updateChaseDate = async () => {
    this.setState({ updateChaseDateSubmitted: true });
    const response = await api.extendChase(this.chaseToExtend());
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        this.showSuccessMessage("Chase date has been updated successfully");
        this.props.completeExtendingChase();
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: false
    });
    setTimeout(
      () =>
        this.setState({ showMessage: false, updateChaseDateSubmitted: false }),
      3000
    );
  };

  showErrorMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: true,
      updateChaseDateSubmitted: false
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  render() {
    return (
      <Modal
        id="extendChaseModal"
        ariaHideApp={false}
        className="extend-chase-modal"
        isOpen={this.props.isModalOpen}
        contentLabel="Extends Chase Modal"
      >
        <div id="extendChaseModalTitle" className="extend-chase-modal__header">
          <h3>Extend Chase Date</h3>
        </div>
        <hr />
        <div className="extend-chase-modal__body">
          <FormRow>
            <FormGroup>
              <Label text="New Chase Date:" />
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={this.state.newChaseDate}
                onChange={this.handleNewChaseDateChange}
                id="completeChaseModalExerciseStartDate"
              />
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="extend-chase-modal__footer">
          <ButtonContainer
            justifyContent={
              this.state.showMessage ? "space-between" : "flex-end"
            }
          >
            <Message
              marginRight={15}
              message={this.state.message}
              show={this.state.showMessage}
              error={this.state.errorMessage}
            />
            <FlexBox>
              <Button
                secondary
                content="Cancel"
                onClick={this.props.closeModal}
                id="extendChaseModalCancelButton"
                disabled={this.state.updateChaseDateSubmitted}
              />
              <Button
                primary
                content="Update Chase Date"
                onClick={this.updateChaseDate}
                disabled={this.state.updateChaseDateSubmitted}
                loading={this.state.updateChaseDateSubmitted}
              />
            </FlexBox>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}

export default withErrorHandling(ExtendChaseModal);
