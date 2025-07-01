import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../V2/components/common/Navbar";
import Footer from "../V2/components/common/Footer";
import useTitleUpdater from "../V2/hooks/useTitleUpdater";
import useScrollToTop from "../V2/hooks/useScrollToTop";

const LayoutV2 = () => {
  useTitleUpdater();
  useScrollToTop();

  return (
    <div className="min-h-[100vh] w-[100vw] flex flex-col font-inter">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutV2;
