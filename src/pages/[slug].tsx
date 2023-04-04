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

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: profileData } = api.profile.getUserByUsername.useQuery({
    username,
  });

  const { data: postsData, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: profileData?.id || "",
  });

  if (!profileData) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-2xl">
        Something went wrong!
      </div>
    );
  }

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
          <button
            className="h-11 w-32  rounded-lg border-2 border-cyan-800  text-center"
            // TODO: Add edit profile functionality
          >
            <p className="font-semibold">Edit Profile ✏️</p>
          </button>
        </div>
        <div className="mt-4  ml-6 text-2xl">{profileData?.fullName}</div>
        <div className="mb-8 ml-6 text-lg text-cyan-800">{`@${
          profileData?.username ?? ""
        }`}</div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex w-full flex-col justify-center">
            <div className="flex border-b border-slate-500 p-2">
              <div className="ml-2 flex-1 items-center justify-center text-lg font-bold">
                Sweets
              </div>
            </div>
            {postsData?.map((item, index) => (
              <Post key={index} post={item?.post} author={item?.author} />
            ))}
          </div>
        )}
      </PageLayout>
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
