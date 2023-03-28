import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { CreatePost } from "~/components/CreatePost";

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  const { user, isSignedIn } = useUser();

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
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full flex-col items-center justify-center border-x border-slate-500  md:max-w-2xl">
          <div className="flex w-full justify-end border-b p-4">
            {!isSignedIn ? (
              <div className="flex justify-center rounded-lg bg-slate-500 px-3 py-2">
                <SignInButton mode="modal" />
              </div>
            ) : (
              <div className="flex justify-center rounded-lg bg-slate-500 px-3 py-2">
                <SignOutButton />
              </div>
            )}
          </div>

          <div className=" border-b border-slate-500 p-6">
            <CreatePost />
          </div>
          <div className="flex w-full flex-col justify-center">
            {data?.map((item, index) => (
              <div key={index} className="flex border-b border-slate-500 p-6">
                <img
                  src={item?.author?.profileImageUrl}
                  alt="profile-img"
                  className="mr-4 h-14 w-14 rounded-full"
                />
                <div key={index} className="items-center justify-center">
                  <div className="text-lg font-semibold text-sky-700">
                    {item?.author?.username}
                  </div>
                  <div className="text-base">{item?.post?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
