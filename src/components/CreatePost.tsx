import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { api } from "~/utils/api";

export const CreatePost = () => {
  const { user } = useUser();
  const [text, setText] = useState<string>("");

  const ctx = api.useContext();

  const { mutate } = api.posts.createPost.useMutation({
    onSuccess() {
      setText("");
      void ctx.posts.getAll.invalidate();
    },
  });

  const handleKeyPress = (event: any) => {
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
      <img
        src={user?.profileImageUrl}
        alt="profile-img"
        className="mr-4 h-14 w-14 rounded-full"
      />
      <input
        type="text"
        value={text}
        placeholder="Give your sweet tweet"
        className="grow bg-transparent outline-none"
        onChange={(event) => setText(event.target.value)}
        onKeyUp={handleKeyPress}
      />
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};
