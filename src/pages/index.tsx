import { type NextPage } from "next";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useEffect, useMemo } from "react";

import { api } from "~/utils/api";
import { CreatePost } from "~/components/CreatePost";
import Post from "~/components/Post";
import Link from "next/link";

import { LoadingSpinner } from "~/components/LoadingSpinner";

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  const { isSignedIn, user } = useUser();

  const cachedPosts = useMemo(() => data, [data]);

  // console.log("Cached posts ", cachedPosts[cachedPosts?.length - 1]?.post);

  const { mutate: upsertUser } = api.user.upsertUser.useMutation({
    /* onError: (err) => {
      toast.error(
        `${err.message}, ${
          !user?.id ? "Please sign in first" : "Please try again later"
        }`
      );
    }, */
  });

  useEffect(() => {
    if (isSignedIn && !!user) {
      // console.log("User is signed in", { isSignedIn, user });
      upsertUser({
        user: {
          id: user?.id || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
          image: user?.profileImageUrl || "",
          name: user?.fullName || "",
          username: user?.username || "",
        },
      });
    }
  }, [isSignedIn, user, upsertUser]);

  return (
    <>
      <main className="flex h-full justify-center">
        {/* Trending Section */}
        <div className=" items-start justify-start">
          <h1 className="p-4 text-center text-2xl font-semibold">Trending</h1>
          <div className="p-4 text-center text-xl font-semibold">#general</div>
        </div>
        <div className=" h-full w-full flex-col items-center justify-center border-x border-slate-500  md:max-w-2xl">
          <div className="flex w-full justify-end border-b p-4">
            <div className="flex-1 items-center justify-center">
              <Link href={"/"}>
                <h1 className=" pb-3 text-center text-3xl font-extrabold tracking-tight text-[hsl(280,100%,70%)] sm:text-[5rem]">
                  Switter
                </h1>
              </Link>
            </div>
            {isSignedIn && (
              <div className="flex h-9 justify-center rounded-lg bg-slate-500 px-3">
                <SignOutButton />
              </div>
            )}
          </div>

          <div className=" border-b border-slate-500 p-6">
            <CreatePost />
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex w-full flex-col justify-center">
              {cachedPosts?.map((item) => (
                <Post
                  key={item?.post?.id}
                  post={item?.post}
                  author={item?.author}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
