import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import Modal from "react-modal";
import Input from "~/components/Input";

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
    height: "60%",
    padding: "20px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const imageContainer: React.CSSProperties = {
  position: "absolute",
  top: "45%",
  left: "50%",
  right: "50%",
  bottom: "50%",
  transform: "translate(-50%, -120%)",
  width: "128px",
  height: "128px",
  borderRadius: "64px",
};

Modal.setAppElement("#__next");

const ModalPopupContainer = ({
  isModalOpen,
  closeModal,
}: ModalPopupContainerProps) => {
  const { user } = useUser();

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="scroll bg-zinc-900  md:max-w-2xl"
        style={customStyles}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div className="flex items-center justify-end p-2  align-middle">
            <button onClick={closeModal} className="">
              ✖️
            </button>
          </div>
          <div className="h-24 flex-col">
            <div
              style={imageContainer}
              className=" border-slate-400 bg-zinc-900"
            >
              <Image
                src={user?.profileImageUrl || ""}
                alt={`${user?.username ?? ""}'s profile image`}
                width={128}
                height={128}
                className="rounded-full border-4 border-black "
              />
            </div>
          </div>
          <div className="flex-col items-center justify-center">
            <div className="p-2">
              <Input
                onSubmit={(e) => console.log(e.target)}
                value={user?.fullName || ""}
                onChange={(e) => console.log(e.target.value)}
                placeholder="Name"
                defaultValue={user?.fullName || ""}
              />
            </div>
            <div className="p-2">
              <Input
                placeholder="Bio"
                onSubmit={(e) => console.log(e.target)}
                value={user?.fullName || ""}
                onChange={(e) => console.log(e.target.value)}
                defaultValue={user?.fullName || ""}
              />
            </div>
            <div className="p-2">
              <Input
                placeholder="Location"
                onSubmit={(e) => console.log(e.target)}
                value={user?.fullName || ""}
                onChange={(e) => console.log(e.target.value)}
                defaultValue={user?.fullName || ""}
              />
            </div>
            <div className="p-2">
              <Input
                placeholder="Website"
                onSubmit={(e) => console.log(e.target)}
                value={user?.fullName || ""}
                onChange={(e) => console.log(e.target.value)}
                defaultValue={user?.fullName || ""}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalPopupContainer;
