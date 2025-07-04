import React from "react";
import { Route, Routes } from "react-router-dom";
import LayoutV2 from "../Layouts/LayoutV2";
import Homepage from "../V2/pages/Homepage";
import Products from "../V2/pages/Products";
import TermsAndCondtions from "../V2/pages/TermsAndConditions";
import SignIn from "../V2/pages/SignIn.jsx";
import Signup from "../V2/pages/Signup";
import Logout from "../V2/pages/Logout.jsx";
import PrivacyPolicy from "../V2/pages/PrivacyPolicy";
import RiskDisclosure from "../V2/pages/RiskDisclosure";
import ContextWrapper from "../V2/contexts/ContextWrapper";
import AdditionalDetails from "../V2/pages/AdditionalDetails";
import Plan from "../app/Plan.jsx";
import ProtectedRoute from "../V2/components/core/Auth/ProtectedRoute.jsx";
import routes from "../V2/constants/Routes.js";
import Strategies from "../V3/pages/Strategies";

import Backtest from "../V3/pages/Backtests";
import Deploy from "../V3/pages/Deploy";
import Global from "../V3/pages/GlobalFunctions";
import CreateFunction from "../V3/pages/DevStudio";

import CreateStratezy from "../V3/pages/Strategies/CreateStratezy/CreateStratezy";

import BacktestDetail from "../V3/pages/Backtests/BacktestDetail";
import BackTestOutput from "../V3/pages/Backtests/BackTestOutput";
import DeployPage from "../V3/pages/Deploy/DeployDetails/DeployPage";
import Plans from "../V3/pages/Plans/Plans";
import EditStrategy from "../V3/pages/Strategies/EditStrategy";

import LayoutV3 from "../Layouts/LayoutV3.jsx";
import ViewBacktestResult from "../V3/pages/Strategies/ViewStrategy/ViewModal/ViewBacktestResult.jsx";
import ViewOtherVersion from "../V3/pages/Strategies/ViewStrategy/ViewModal/ViewOtherVersion.jsx";
import EditFunction from "../V3/pages/DevStudio/CreateFunction/EditFunction.jsx";

export default function AppRoute() {
  return (
      <Routes>
        {/* Route for v2 layout */}
        <Route element={<ContextWrapper />}>
          <Route element={<LayoutV2 />}>
            <Route path={routes.homepage} element={<Homepage />} />
            <Route path={routes.products} element={<Products />} />
            <Route
              path={routes.termsAndConditions}
              element={<TermsAndCondtions />}
            />
            <Route path={routes.signin} element={<SignIn />} />
            <Route path={routes.logout} element={<Logout />} />
            <Route path={routes.signup} element={<Signup />} />
            <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />
            <Route path={routes.riskDisclosure} element={<RiskDisclosure />} />
            <Route path={routes.plan} element={<Plan />} />
          </Route>

          <Route
            path={routes.additionalDetails}
            element={<AdditionalDetails />}
          />

          <Route element={<LayoutV3 />}>
            <Route
              path={`${routes.app}/*`}
              element={
                <ProtectedRoute>
                  <Strategies />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.strategiesRoute}/*`}
              element={
                <ProtectedRoute>
                  <Strategies />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.strategiesCreateRoute}/*`}
              element={
                <ProtectedRoute>
                  <CreateStratezy />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path={`${routes.strategiesViewRoute}/*`}
              element={
                <ProtectedRoute>
                  <ViewStrategy />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path={`${routes.strategiesEditRoute}/*`}
              element={
                <ProtectedRoute>
                  <EditStrategy />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.backtestTab}/*`}
              element={
                <ProtectedRoute>
                  <ViewBacktestResult />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.version}/*`}
              element={
                <ProtectedRoute>
                  <ViewOtherVersion />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.backtestRoute}/*`}
              element={
                <ProtectedRoute>
                  <Backtest />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.deployRoute}/*`}
              element={
                <ProtectedRoute>
                  <Deploy />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.deployDetail}/*`}
              element={
                <ProtectedRoute>
                  <DeployPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.globalRoute}/*`}
              element={
                <ProtectedRoute>
                  <Global />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.devStudio}/*`}
              element={
                <ProtectedRoute>
                  <CreateFunction />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.editDevStudio}/*`}
              element={
                <ProtectedRoute>
                  <EditFunction />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.backtestDetail}/*`}
              element={
                <ProtectedRoute>
                  <BacktestDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.backtestOutput}/*`}
              element={
                <ProtectedRoute>
                  <BackTestOutput />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.plansRoute}/*`}
              element={
                <ProtectedRoute>
                  <Plans />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
  );
}
