import { SignInButton, useUser } from "@clerk/nextjs";
import React from "react";

const DontMissSection = () => {
  const { isSignedIn } = useUser();

  return (
    <React.Fragment>
      {!isSignedIn ? (
        <div className="fixed bottom-0 left-0 right-0 flex justify-between rounded-md bg-purple-900 p-4">
          <div>
            <h2 className="ml-2 text-2xl font-semibold">
              Don't miss what's happening
            </h2>
            <h2 className="ml-2 text-lg font-semibold">
              Sing in to react to Switter's best posts
            </h2>
          </div>
          <div>
            <button className="m-2 mr-10 rounded-md bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
              <SignInButton mode="modal" />
            </button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default DontMissSection;
