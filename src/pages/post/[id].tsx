import { type NextPage } from "next";
import Head from "next/head";
// import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

const SinglePostPage: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  // const { isSignedIn } = useUser();

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
        <title>Post</title>
      </Head>
      <main className="flex h-full justify-center">
        <h1>SinglePostPage</h1>
      </main>
    </>
  );
};

export default SinglePostPage;
