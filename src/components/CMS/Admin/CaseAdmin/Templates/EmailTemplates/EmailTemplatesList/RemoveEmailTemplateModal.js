import React from "react";
import { Modal, ButtonContainer, Button } from "components/Common";

const RemoveEmailTemplateModal = ({
  closeModal,
  removeEmailTemplate,
  selectedTemplate,
  removeModalOpen
}) => {
  return (
    <Modal
      isModalOpen={removeModalOpen}
      title="Remove Email Template"
      message="Are you sure you want to remove this template?"
      item={selectedTemplate !== null ? selectedTemplate.name : ""}
    >
      <ButtonContainer justifyContent="flex-end">
        <Button content="Close" secondary onClick={closeModal} />
        <Button content="Remove" type="danger" onClick={removeEmailTemplate} />
      </ButtonContainer>
    </Modal>
  );
};

export default RemoveEmailTemplateModal;
