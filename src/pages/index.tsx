import { type NextPage } from "next";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { CreatePost } from "~/components/CreatePost";
import Post from "~/components/Post";

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  const { isSignedIn } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-2xl">
        Something went wrong!
      </div>
    );
  }

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
              <h1 className=" pb-3 text-center text-3xl font-extrabold tracking-tight text-[hsl(280,100%,70%)] sm:text-[5rem]">
                Switter
              </h1>
            </div>
            {!isSignedIn ? (
              <div className="flex h-9 justify-center rounded-lg bg-slate-500 px-3">
                <SignInButton mode="modal" />
              </div>
            ) : (
              <div className="flex h-9 justify-center rounded-lg bg-slate-500 px-3">
                <SignOutButton />
              </div>
            )}
          </div>

          <div className=" border-b border-slate-500 p-6">
            <CreatePost />
          </div>
          <div className="flex w-full flex-col justify-center">
            {data?.map((item, index) => (
              <Post key={index} post={item?.post} author={item?.author} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
