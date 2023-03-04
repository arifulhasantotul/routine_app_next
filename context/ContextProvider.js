import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);

  const { pathname } = useRouter();

  const [pageURL, setPageURL] = useState("");

  useEffect(() => {
    setPageURL(pathname);

    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize, setScreenSize, pathname]);

  return (
    <StateContext.Provider
      value={{
        screenSize,
        setScreenSize,
        pageURL,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default ContextProvider;

export const useStateContext = () => useContext(StateContext);
