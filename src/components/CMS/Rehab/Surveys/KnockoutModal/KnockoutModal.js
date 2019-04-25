import React, { Component } from "react";
import Modal from "react-modal";
import { ButtonContainer, Button, FormRow } from "components/Common";
import "./KnockoutModal.scss";

export default class KnockoutModal extends Component {
  renderAnswer = knockout => {
    if (knockout.question.type === "selection") {
      return knockout.answer.map((answer, key) => {
        return (
          <span key={key} className="knockout-modal__selection">
            {++key === knockout.answer.length ? answer : `${answer},`}
          </span>
        );
      });
    } else {
      return <span>{knockout.answer}</span>;
    }
  };

  render() {
    const height = 210 + this.props.knockouts.length * 68;

    const customStyles = {
      content: {
        height: `${height}px`
      }
    };
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isModalOpen}
        contentLabel="Knockout Modal"
        className="knockout-modal"
        style={customStyles}
      >
        <div className="knockout-modal__title">
          <h3>Case not eligible for Mi3D</h3>
        </div>
        <hr />
        <div className="knockout-modal__body">
          <FormRow marginBottom="25">
            <p className="knockout-modal__text">
              Knockout questions and answers
            </p>
          </FormRow>
          {this.props.knockouts.map((knockout, key) => (
            <div key={key} className="knockout-modal__knockout">
              <p className="knockout-modal__question">
                {knockout.question.text}
              </p>
              <p>{this.renderAnswer(knockout)}</p>
            </div>
          ))}
        </div>
        <hr />
        <div className="knockout-modal__footer">
          <ButtonContainer justifyContent="flex-end" marginTop="15">
            <Button
              content="Cancel"
              secondary
              onClick={this.props.closeModal}
            />
            <Button content="Hold Case" primary onClick={this.props.holdCase} />
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
