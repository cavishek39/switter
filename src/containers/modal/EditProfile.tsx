import React, { PropsWithChildren, useState } from "react";
import ModalPopupContainer from "./ModalPopup";
import Image from "next/image";
import { User } from "@prisma/client";
import Input from "~/components/Input";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

type EditProfileProps = {
  user: User;
  isModalOpen: boolean;
  closeModal: () => void;
} & PropsWithChildren;

const imageContainer: React.CSSProperties = {
  position: "absolute",
  top: "38%",
  left: "50%",
  right: "50%",
  bottom: "50%",
  transform: "translate(-50%, -120%)",
  width: "128px",
  height: "128px",
  borderRadius: "64px",
};

const EditProfile = ({ user, isModalOpen, closeModal }: EditProfileProps) => {
  const [image, setImage] = useState<string>(user?.image || "");
  const [name, setName] = useState<string>(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [website, setWebsite] = useState<string>(user?.website || "");

  const { mutate } = api.user.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      handleModalClose();
    },
    onError: (error) => {
      toast.error(
        `${error.message}, ${
          !user?.id ? "Please sign in first" : "Please try again later"
        }`
      );
      handleModalClose();
    },
  });

  const handleModalClose = () => {
    closeModal();
  };

  const hasProfileInfoChanged = () => {
    const isNameChanged = name !== user?.name;
    const isBioChanged = bio !== user?.bio;
    const isLocationChanged = location !== user?.location;
    const isWebsiteChanged = website !== user?.website;

    return (
      !!user?.id &&
      (isNameChanged || isBioChanged || isLocationChanged || isWebsiteChanged)
    );
  };

  const handleSubmit = () => {
    if (hasProfileInfoChanged()) {
      mutate({
        user: {
          id: user.id,
          name,
          bio,
          image,
          location,
          website,
        },
      });
    }
  };

  return (
    <ModalPopupContainer
      closeModal={closeModal}
      isModalOpen={isModalOpen}
      user={user}
    >
      <div>
        <div className="items-center pl-4 align-middle">
          <h1 className="text-lg font-bold">Edit Profile</h1>
        </div>
        <div className="flex items-center justify-end p-2 align-middle">
          <button onClick={closeModal}>✖️</button>
        </div>
        <div className="h-24 flex-col">
          <div style={imageContainer} className=" border-slate-400 bg-zinc-900">
            <Image
              src={image}
              alt={`${name ?? ""}'s profile image`}
              width={128}
              height={128}
              className="rounded-full border-4 border-black "
            />
          </div>
        </div>
        <div className="flex-col items-center justify-center">
          <div className="p-2">
            <Input
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              defaultValue={name}
            />
          </div>
          <div className="p-2">
            <Input
              placeholder="Bio"
              onChange={(e) => setBio(e.target.value)}
              defaultValue={bio}
            />
          </div>
          <div className="p-2">
            <Input
              placeholder="Location"
              onChange={(e) => setLocation(e.target.value)}
              defaultValue={location}
            />
          </div>
          <div className="p-2">
            <Input
              placeholder="Website"
              onChange={(e) => setWebsite(e.target.value)}
              defaultValue={website}
            />
          </div>
        </div>
        <div className="m-2 flex w-full justify-center">
          <button
            disabled={!hasProfileInfoChanged()}
            className="rounded-md bg-blue-800 py-1 px-4 font-bold text-white disabled:bg-zinc-400 "
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </ModalPopupContainer>
  );
};

export default EditProfile;
