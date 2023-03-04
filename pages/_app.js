import PageLoading from "@/components/PageLoading/PageLoading";
import ContextProvider from "@/context/ContextProvider";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const nextRouter = useRouter();
  const [ssrRendering, setSsrRendering] = useState(false);
  // this useEffect is for the page transition && page loading
  useEffect(() => {
    const handleStart = (url) =>
      url !== nextRouter.asPath ? setSsrRendering(true) : null;
    const handleComplete = (url) =>
      url === nextRouter.asPath ? setSsrRendering(false) : null;

    nextRouter.events.on("routeChangeStart", handleStart);
    nextRouter.events.on("routeChangeComplete", handleComplete);
    nextRouter.events.on("routeChangeError", handleComplete);

    return () => {
      nextRouter.events.off("routeChangeStart", handleStart);
      nextRouter.events.off("routeChangeComplete", handleComplete);
      nextRouter.events.off("routeChangeError", handleComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextRouter.asPath]);
  return (
    <>
      {!ssrRendering ? (
        <ContextProvider>
          <Component {...pageProps} />
        </ContextProvider>
      ) : (
        <ContextProvider>
          <PageLoading />
        </ContextProvider>
      )}
    </>
  );
}

export default MyApp;
