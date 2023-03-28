import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
import { api } from "~/utils/api";

export const CreatePost = () => {
  const { user } = useUser();
  const [text, setText] = useState<string>("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.posts.createPost.useMutation({
    onSuccess() {
      setText("");
      void ctx.posts.getAll.invalidate();
    },
  });

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    mutate({
      content: text,
      authorId: user?.id || "",
    });
  };

  return (
    <div className="flex">
      <Image
        src={user?.profileImageUrl || ""}
        width={56}
        height={56}
        alt="profile-img"
        className="mr-4 h-14 w-14 rounded-full"
      />
      <input
        type="text"
        value={isLoading ? "..." : text}
        disabled={isLoading}
        placeholder="Give your sweet tweet"
        className="grow bg-transparent outline-none"
        onChange={(event) => setText(event.target.value)}
        onKeyUp={handleKeyPress}
      />
      <button type="button" onClick={handleSubmit}>
        {isLoading ? "..." : "Submit"}
      </button>
    </div>
  );
};
