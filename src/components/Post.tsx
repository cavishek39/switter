import { useUser } from "@clerk/nextjs";
import moment from "moment";
import Image from "next/image";
import React, { memo, useState } from "react";
import toast from "react-hot-toast";
import { DEFAULT_AVATAR } from "~/constants";
import { Post } from "~/types/post";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";
import Link from "next/link";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";

type PostProps = {
  post: Post;
  author:
    | {
        id: string | undefined;
        username: string | null | undefined;
        profileImageUrl: string | undefined;
        fullName: string;
        createdAt: number | undefined;
      }
    | undefined;
};

const Post = ({ post, author }: PostProps) => {
  const { user } = useUser();
  const ctx = api.useContext();

  const [showInput, setShowInput] = useState<boolean>(false);
  const [text, setText] = useState<string>(post?.content);

  const { mutate: deletePost, isLoading: deletingPost } =
    api.posts.deletePost.useMutation({
      onSuccess() {
        void ctx.posts.invalidate();
      },
      onError(err) {
        toast.error(`${err.message}, Please try again later`);
      },
    });

  const { mutate: updatePost, isLoading: updatingPost } =
    api.posts.updatePost.useMutation({
      onSuccess() {
        setText("");
        setShowInput(false);
        void ctx.posts.getAll.invalidate();
      },
      onError(err) {
        setText("");
        setShowInput(false);
        toast.error(
          `${err.message}, ${
            !user?.id ? "Please sign in first" : "Please try again later"
          }`
        );
      },
    });

  const { mutate: likePost, isLoading: likingPost } =
    api.posts.likePost.useMutation({
      onSuccess() {
        void ctx.posts.getAll.invalidate();
      },
      onError(err) {
        toast.error(
          `${err.message}, ${
            !user?.id ? "Please sign in first" : "Please try again later"
          }`
        );
      },
    });

  const { mutate: dislikePost, isLoading: disLikingPost } =
    api.posts.dislikePost.useMutation({
      onSuccess() {
        void ctx.posts.getAll.invalidate();
      },
      onError(err) {
        toast.error(
          `${err.message}, ${
            !user?.id ? "Please sign in first" : "Please try again later"
          }`
        );
      },
    });

  const handleDeletingPost = () => {
    deletePost({ postId: post?.id });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    updatePost({
      content: text,
      postId: post?.id,
      authorId: post?.authorId,
    });
  };

  const isPostLikedByMe = (): boolean => {
    return post.likes > 0 && post?.likedById === user?.id;
  };

  const handleLikeOrDislikePost = () => {
    if (!isPostLikedByMe()) {
      likePost({
        postId: post?.id,
        userId: user?.id || "",
      });
    } else {
      dislikePost({
        postId: post?.id || "",
        userId: user?.id || "",
      });
    }
  };

  return (
    <div className="border-b border-slate-500 p-6">
      <div key={post?.id} className="flex">
        <Image
          src={author?.profileImageUrl || DEFAULT_AVATAR}
          width={56}
          height={56}
          alt="profile-img"
          className="mr-4 h-14 w-14 rounded-full"
        />
        <div className="items-center justify-center">
          <div className="flex items-center ">
            <Link href={`/@${author?.username ?? ""}`}>
              <div className="text-lg font-semibold text-sky-700">
                {author?.username}
              </div>
            </Link>
            <Link href={`/post/${post?.id}`}>
              <div className="flex justify-center px-2">
                <p className="text-center text-sm">
                  {moment(post.created_at)?.fromNow()}
                </p>
              </div>
            </Link>
            <div
              className="px-4"
              hidden={post?.authorId !== user?.id || deletingPost}
            >
              <button
                disabled={updatingPost || deletingPost}
                className="text-end text-sm text-cyan-700"
                onClick={() => {
                  setShowInput(!showInput);
                }}
              >
                {showInput ? "cancel" : "✏️"}
              </button>
            </div>
            <div
              className="pl-4"
              hidden={post?.authorId !== user?.id || updatingPost}
            >
              {deletingPost ? (
                <LoadingSpinner />
              ) : (
                <button
                  disabled={updatingPost || deletingPost}
                  onClick={handleDeletingPost}
                  className="text-end text-sm"
                >
                  ❌
                </button>
              )}
            </div>
          </div>
          {showInput ? (
            <div className="flex">
              <input
                type="text"
                defaultValue={post?.content}
                value={updatingPost ? "..." : text}
                disabled={updatingPost}
                placeholder="Give your sweet tweet"
                className="grow bg-transparent outline-none"
                onChange={(event) => setText(event.target.value)}
                onKeyUp={handleKeyPress}
              />
              {updatingPost ? (
                <LoadingSpinner />
              ) : (
                <button
                  type="button"
                  className="text-lg"
                  onClick={handleSubmit}
                  disabled={updatingPost || !text}
                >
                  ➡️
                </button>
              )}
            </div>
          ) : (
            <div className="flex">
              <p className="text-base">{post?.content}</p>
              {post?.isEdited && <p className="px-2 text-gray-500">(edited)</p>}
            </div>
          )}
        </div>
      </div>
      <div className="py-1 pl-20">
        <button
          disabled={!user?.id || likingPost || disLikingPost}
          onClick={handleLikeOrDislikePost}
        >
          {isPostLikedByMe() ? (
            <div>
              <FavoriteOutlinedIcon color="error" />
              <h2 className="text-sm">{post?.likes}</h2>
            </div>
          ) : (
            <div>
              <FavoriteBorderOutlined />
              <h2 className="text-sm">{post?.likes}</h2>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(Post);
