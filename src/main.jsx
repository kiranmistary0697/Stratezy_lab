// import React from 'react';
// import { createRoot } from "react-dom/client";
// import './index.css'
// import { lazy, Suspense } from "react";
// import { KcPage } from "./keycloak-theme/kc.gen";
// const AppEntrypoint = lazy(() => import("./main.app"));

// // The following block can be uncommented to test a specific page with `yarn dev`
// // Don't forget to comment back or your bundle size will increase
// /*
// import { getKcContextMock } from "./keycloak-theme/login/KcPageStory";

// if (import.meta.env.DEV) {
//     window.kcContext = getKcContextMock({
//         pageId: "login.ftl",
//         overrides: {}
//     });
// }
// */

// createRoot(document.getElementById("root")).render(
//     <>
//         {window.kcContext ? (
//             <KcPage kcContext={window.kcContext} />
//         ) : (
//             <Suspense>
//                 <AppEntrypoint />
//             </Suspense>
//         )}
//     </>
// );

import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";
import { api } from "./slices/api";
import { Provider } from "react-redux";
import AppEntrypoint from "./main.app";

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});
root.render(
    <Provider store={store}>
      <AppEntrypoint />
    </Provider>
);
