import React from "react";
import Modal from "react-modal";

type ModalPopupContainerProps = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const customStyles: Modal.Styles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "50%",
    padding: "20px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

Modal.setAppElement("#__next");

const ModalPopupContainer = ({
  isModalOpen,
  closeModal,
}: ModalPopupContainerProps) => {
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="h-96 w-96 items-center justify-center bg-zinc-900 align-middle md:max-w-2xl"
        style={customStyles}
      >
        <h2>Modal Content</h2>
        <p>This is the content of the modal.</p>
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </div>
  );
};

export default ModalPopupContainer;
