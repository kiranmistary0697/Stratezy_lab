import React, { useEffect } from "react";
import AppRoute from "./routes/AppRoute";
import { ToastContainer } from "react-toastify";

// import { stockActions } from "./slices/page/reducer";

function App() {
  return (
    <>
      <AppRoute />
      <ToastContainer />
    </>
  );
}

export default App;
