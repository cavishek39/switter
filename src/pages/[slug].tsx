import type { GetStaticPropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import PageLayout from "./layout";
import Post from "~/components/Post";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { options } from "~/constants";
import { useUser } from "@clerk/nextjs";
import { use, useState } from "react";
import EditProfile from "~/containers/modal/EditProfile";
import type { User } from "@prisma/client";
import toast from "react-hot-toast";
import { getPlural } from "~/helpers";
import FollowButton from "~/components/FollowButton";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { isSignedIn, user } = useUser();

  const trpcUtils = api.useContext();

  const { data: profileData } = api.profile.getUserByUsername.useQuery({
    username,
  });

  const { data: postsData, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: profileData?.id || "",
  });

  const toggleFollowUser = api.profile.toggleFollowUser.useMutation({
    onSuccess: ({ isFollowing }) => {
      toast.success(`${isFollowing ? "Followed" : "UnFollowed"} successfully!`);

      // Updating the cache
      trpcUtils.profile.getUserByUsername.setData({ username }, (oldData) => {
        if (oldData == null) return;

        const countModifier = isFollowing ? 1 : -1;
        return {
          ...oldData,
          isFollowing: isFollowing,
          followersCount: (oldData?.followersCount || 0) + countModifier,
        };
      });
    },
    onError: (error) => {
      toast.error(
        `${error.message}, ${
          !user?.id ? "Please sign in first" : "Please try again later"
        }`
      );
    },
  });

  if (!profileData) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-2xl">
        Something went wrong!
      </div>
    );
  }

  const formattedDate = new Date(profileData?.createdAt);
  const newJoinedDate = formattedDate?.toLocaleDateString("en-US", options);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const userData: User = {
    id: profileData?.id,
    email: profileData?.email || "",
    bio: profileData?.bio || "",
    image: profileData?.profileImageUrl || "",
    location: profileData?.location || "",
    name: profileData?.fullName || "",
    username: profileData?.username || "",
    website: profileData?.website || "",
  };

  return (
    <>
      <Head>
        <title>{profileData?.username}</title>
      </Head>
      <PageLayout>
        {/* Trending Section */}
        <div className="relative h-48  border-slate-400 bg-zinc-900">
          <Image
            src={profileData?.profileImageUrl}
            alt={`${profileData?.username ?? ""}'s profile image`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="m-4 flex items-center justify-end  align-middle">
          {user?.username === username ? (
            <button
              className="h-11 w-32  rounded-lg border-2 border-cyan-800  text-center"
              onClick={openModal}
            >
              <p className="font-semibold">Edit Profile ✏️</p>
            </button>
          ) : (
            <FollowButton
              isFollowing={profileData?.isFollowing}
              isLoading={toggleFollowUser.isLoading}
              onClick={() =>
                toggleFollowUser.mutate({ followerId: profileData?.id || "" })
              }
            />
          )}
        </div>
        <div className="mt-4  ml-6 text-2xl">{profileData?.fullName}</div>
        <div className="mb-2 ml-6 text-lg text-cyan-800">{`@${
          profileData?.username ?? ""
        }`}</div>
        <div className="flex items-center">
          {/* <div className="mb-4 ml-6 text-base text-gray-600">{`🎂 ${profileData?.birthday}`}</div> */}
          <div className="mb-4 ml-6 text-base text-gray-600">{`🗓️ Joined ${newJoinedDate}`}</div>
        </div>
        <div className="flex items-center">
          <div className="mb-4 ml-6 text-base text-gray-600">{`${
            profileData?.followingCount || 0
          } Following`}</div>
          <div className="mb-4 ml-6 text-base text-gray-600">{`${
            profileData?.followersCount || 0
          } ${getPlural(
            profileData?.followersCount || 0,
            "Follower",
            "Followers"
          )}`}</div>
        </div>

        {isSignedIn && isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex w-full flex-col justify-center">
            <div className="flex border-b border-slate-500 p-2">
              <div className="ml-2 flex-1 items-center justify-center text-lg font-bold">
                Sweets
              </div>
            </div>
            {isSignedIn ? (
              <>
                {postsData?.map((item, index) => (
                  <Post key={index} post={item?.post} author={item?.author} />
                ))}
              </>
            ) : (
              <div className="mt-4  ml-6 text-center text-2xl">
                Login to see Sweets
              </div>
            )}
          </div>
        )}
      </PageLayout>
      <EditProfile
        user={userData}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma,
      currentUserId: null,
      revalidateSSG: null,
    },
    transformer: superjson,
  });
  const slug = context.params?.slug as string;

  if (typeof slug !== "string") {
    throw new Error("Slug is not a string");
  }

  const username = slug.replace(/@/g, "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default ProfilePage;
