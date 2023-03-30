import moment from "moment";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { DEFAULT_AVATAR } from "~/constants";
import { Post } from "~/types/post";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";

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
  const ctx = api.useContext();

  const { mutate: deletePost, isLoading } = api.posts.deletePost.useMutation({
    onSuccess() {
      void ctx.posts.invalidate();
    },
    onError(err) {
      toast.error(`${err.message}, Please try again later`);
    },
  });

  const handleDeletingPost = () => {
    deletePost({ postId: post?.id });
  };

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
        <div className="flex items-center ">
          <div className="text-lg font-semibold text-sky-700">
            {author?.username}
          </div>
          <div className="flex justify-center px-2">
            <p className="text-center text-sm">
              {moment(post.created_at)?.fromNow()}
            </p>
          </div>
          <div className="pl-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <button
                disabled={isLoading}
                onClick={handleDeletingPost}
                className="text-end text-sm"
              >
                ❌
              </button>
            )}
          </div>
        </div>
        <div className="text-base">{post?.content}</div>
      </div>
    </div>
  );
};

export default Post;
