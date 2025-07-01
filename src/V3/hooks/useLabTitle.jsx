import { useEffect } from "react";

const useLabTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;

    document.title = title;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useLabTitle;
