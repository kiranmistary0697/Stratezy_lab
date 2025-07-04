import { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";

export function HistoryRouter({ history, children }) {
  const [location, setLocation] = useState(history.location);

  useLayoutEffect(() => {
    const unsubscribe = history.listen(({ location }) => {
      setLocation(location);
    });
    return unsubscribe;
  }, [history]);

  return <Router location={location} navigator={history}>{children}</Router>;
}
