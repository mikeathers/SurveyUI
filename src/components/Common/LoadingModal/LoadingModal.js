import React from "react";
import "./LoadingModal.scss";
import Modal from "react-modal";
import LoadingBars from "../LoadingBars/LoadingBars";

const LoadingModal = ({ message, isModalOpen }) => (
  <Modal
    ariaHideApp={false}
    isOpen={isModalOpen}
    contentLabel="Loading Modal"
    className="loading-modal"
  >
    <div className="loading-modal__body">
      <LoadingBars />
    </div>
  </Modal>
);

export { LoadingModal };
