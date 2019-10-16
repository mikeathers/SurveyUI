import React from "react";
import Modal from "react-modal";
import { Button, ButtonContainer } from "components/Common";

import "./CaseLockedModal.scss";

const CaseLockedModal = props => {
  const { isModalOpen, lockedBy } = props;
  return (
    <Modal
      id="caseLockedModal"
      ariaHideApp={false}
      isOpen={isModalOpen}
      contentLabel="Case Locked Modal"
      className="case-locked-modal"
    >
      <div id="caseLockedModalTitle" className="case-locked-modal__header">
        <h3>Case is Locked</h3>
      </div>
      <hr />
      <div className="case-locked-modal__body">
        <p id="caseLockedModalMessage">
          The Case is currently being edited by {lockedBy}. Please try again
          later.
        </p>
      </div>
      <hr />
      <div className="case-locked-modal__footer">
        <ButtonContainer
          id="caseLockedModalGoBackButtonContainer"
          justifyContent="flex-end"
        >
          <Button
            id="caseLockedModalGoBackButton"
            content="Go Back"
            secondary
            onClick={() => props.goBackToCaseList()}
          />
        </ButtonContainer>
      </div>
    </Modal>
  );
};

export default CaseLockedModal;
