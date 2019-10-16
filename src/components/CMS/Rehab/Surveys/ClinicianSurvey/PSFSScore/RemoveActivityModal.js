import React from "react";
import { Modal, Button, ButtonContainer } from "components/Common";

const RemoveActivityModal = ({
  removeActivity,
  removeModalOpen,
  selectedActivity,
  closeRemoveModal
}) => (
  <Modal
    title="Remove Activity"
    isModalOpen={removeModalOpen}
    message="Are you sure you want to remove this activity?"
    item={selectedActivity !== undefined && selectedActivity.activity}
  >
    <ButtonContainer justifyContent="flex-end">
      <Button content="Close" secondary onClick={() => closeRemoveModal()} />
      <Button
        type="danger"
        content="Remove"
        id="removeActivityModalRemoveBtn"
        onClick={() => removeActivity(selectedActivity)}
      />
    </ButtonContainer>
  </Modal>
);

export default RemoveActivityModal;
