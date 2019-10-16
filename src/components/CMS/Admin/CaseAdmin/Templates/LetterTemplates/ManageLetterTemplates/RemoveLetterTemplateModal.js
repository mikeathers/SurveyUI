import React from "react";
import { Modal, ButtonContainer, Button } from "components/Common";

const RemoveLetterTemplateModal = ({
  removeModalOpen,
  selectedTemplateName,
  closeModal,
  removeLetterTemplate
}) => (
  <Modal
    isModalOpen={removeModalOpen}
    title="Remove Letter Template"
    message="Are you sure you want to remove this letter template?"
    item={selectedTemplateName}
  >
    <ButtonContainer justifyContent="flex-end">
      <Button content="Close" secondary onClick={closeModal} />
      <Button content="Remove" type="danger" onClick={removeLetterTemplate} />
    </ButtonContainer>
  </Modal>
);

export default RemoveLetterTemplateModal;
