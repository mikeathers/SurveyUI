import React from "react";
import Modal from "react-modal";
import { ButtonContainer, Button } from "components/Common";
import "./ErrorModal.scss";

const sModal = props => {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={props.isModalOpen}
      contentLabel="Default Modal"
      className="error-modal"
    >
      <div className="error-modal__header">
        <h3>An Error Has Occured</h3>
      </div>
      <hr />
      <div className="error-modal__body">
        <p>
          {props.errorMessage !== null
            ? props.errorMessage
            : "An error has occured whilst processing this request, please try again later or contact the System Administrator."}
        </p>
      </div>
      <hr />
      <div className="error-modal__footer">
        <ButtonContainer marginTop="25" justifyContent="flex-end">
          <Button content="Close" secondary onClick={props.closeModal} />
        </ButtonContainer>
      </div>
    </Modal>
  );
};

export { sModal as ErrorModal };
