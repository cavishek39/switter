import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import DontMissSection from "~/components/DontMissSection";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Switter</title>
        <meta name="description" content="❤️‍🔥" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
      <DontMissSection />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
