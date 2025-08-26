import { Outlet } from "react-router-dom";

import useTitleUpdater from "../V2/hooks/useTitleUpdater";
import useScrollToTop from "../V2/hooks/useScrollToTop";
import NavigationHeader from "../app/NavigationHeader";

const LayoutV3 = () => {
  useTitleUpdater();
  useScrollToTop();

  return (
    <div className="min-h-[100vh] w-[100vw] flex flex-col font-inter">
      <NavigationHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutV3;
