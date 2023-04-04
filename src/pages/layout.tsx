import type { PropsWithChildren } from "react";

export const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-full justify-center">
      <div className=" h-full w-full flex-col items-center justify-center border-x border-slate-500  md:max-w-2xl">
        <div className="flex w-full justify-end border-b p-4">
          <div className="flex-1 items-center justify-center">
            <h1 className=" pb-3 text-center text-3xl font-extrabold tracking-tight text-[hsl(280,100%,70%)] sm:text-[5rem]">
              Switter
            </h1>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
};
