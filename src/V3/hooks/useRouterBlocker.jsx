// useRouterBlocker.js
import { useEffect, useRef, useState } from "react";
import { history } from "../../Histroy/histroy";

export const useRouterBlocker = ({ when }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const unblockRef = useRef(null);

  useEffect(() => {
    if (when) {
      unblockRef.current = history.block((tx) => {
        setNextPath(tx.location.pathname);
        setShowPrompt(true);
        return false; // block nav
      });
    }

    return () => {
      if (unblockRef.current) {
        unblockRef.current();
      }
    };
  }, [when]);

  const confirmNavigation = () => {
    if (unblockRef.current) {
      unblockRef.current();
    }
    setShowPrompt(false);
    history.push(nextPath); // allow nav
  };

  const cancelNavigation = () => {
    setShowPrompt(false);
  };

  return {
    showPrompt,
    confirmNavigation,
    cancelNavigation,
  };
};
