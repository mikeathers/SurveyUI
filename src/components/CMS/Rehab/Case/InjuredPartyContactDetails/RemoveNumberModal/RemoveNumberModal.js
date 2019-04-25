import React from "react";
import Modal from "react-modal";
import { ButtonContainer, Button } from "components/Common";
import "./RemoveNumberModal.scss";

const RemoveNumberModal = props => {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={props.isModalOpen}
      contentLabel="Are you sure?"
      className="remove-num-modal"
    >
      <div className="remove-num-modal__header">
        <h3>Remove Number</h3>
      </div>
      <hr />
      <div className="remove-num-modal__body">
        <p>Are you sure you want to remove this number?</p>
        <p>{props.numberToRemove}</p>
      </div>
      <hr />
      <div className="remove-num-modal__footer">
        <ButtonContainer justifyContent="flex-end" marginTop="15">
          <Button content="Close" secondary onClick={props.closeModal} />
          <Button
            content="Remove"
            type="danger"
            onClick={props.removeContactDetail}
          />
        </ButtonContainer>
      </div>
    </Modal>
  );
};

export default RemoveNumberModal;
