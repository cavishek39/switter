import React from "react";

type FollowButtonProps = {
  isFollowing: boolean | undefined;
  isLoading: boolean;
  onClick: () => void;
};

const FollowButton = ({
  isFollowing,
  isLoading,
  onClick,
}: FollowButtonProps) => {
  return (
    <button
      className="h-11 w-32  rounded-lg border-2 border-cyan-800  text-center"
      disabled={isLoading}
      onClick={onClick}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
