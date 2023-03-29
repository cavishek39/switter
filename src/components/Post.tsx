import Image from "next/image";
import React from "react";
import { DEFAULT_AVATAR } from "~/constants";
import { Post } from "~/types/post";

type PostProps = {
  post: Post;
  author:
    | {
        id: string;
        username: string | null;
        profileImageUrl: string;
      }
    | undefined;
};

const Post = ({ post, author }: PostProps) => {
  return (
    <div key={post?.id} className="flex border-b border-slate-500 p-6">
      <Image
        src={author?.profileImageUrl || DEFAULT_AVATAR}
        width={56}
        height={56}
        alt="profile-img"
        className="mr-4 h-14 w-14 rounded-full"
      />
      <div className="items-center justify-center">
        <div className="text-lg font-semibold text-sky-700">
          {author?.username}
        </div>
        <div className="text-base">{post?.content}</div>
      </div>
    </div>
  );
};

export default Post;
