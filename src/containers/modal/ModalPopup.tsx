import { User } from "@prisma/client";
import React, { PropsWithChildren } from "react";
import Modal from "react-modal";

type ModalPopupContainerProps = {
  user: User;
  isModalOpen: boolean;
  closeModal: () => void;
} & PropsWithChildren;

const customStyles: Modal.Styles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "80%",
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
  children,
}: ModalPopupContainerProps) => {
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="scroll bg-zinc-900  md:max-w-2xl"
        shouldCloseOnOverlayClick={false}
        style={customStyles}
      >
        {children}
      </Modal>
    </div>
  );
};

export default ModalPopupContainer;
