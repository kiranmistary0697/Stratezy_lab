import { useState, useCallback, useMemo, useEffect } from "react";
import { Divider, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import DeployDetailHeader from "./DeployDetailHeader";
import NavigationTabs from "../../Strategies/ViewStrategy/NavigationTabs";

import CapitalPage from "./DepolyPage/CapitalPage/CapitalPage";
import Holdings from "./DepolyPage/HoldingsPage/Holdings";
import TradeToDo from "./DepolyPage/TradeToDoPage/TradeToDo";
import TradeHistory from "./DepolyPage/TradeHistroyPage/TradeHistory";
import Performance from "./DepolyPage/Performance";
import DetailsPage from "./DepolyPage/DetailPage/DetailsPage";
import { useLazyGetQuery } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";

const tabComponents = [
  DetailsPage,
  CapitalPage,
  Holdings,
  TradeToDo,
  TradeHistory,
  Performance,
];

const DeployPage = () => {
  const [getDeployData] = useLazyGetQuery();
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const id = queryParams.get("id");

  const [tabIndex, setTabIndex] = useState(0);
  const [deploy, setDeploy] = useState([]);
  const deployFilterData = deploy.find(({ reqId }) => reqId === id);

  useEffect(() => {
    const fetchDeployData = async () => {
      if (!id) return;
      try {
        const { data } = await getDeployData({
          endpoint: "deploy/strategy/findall",
          tags: [tagTypes.GET_DEPLOY],
        }).unwrap();
        setDeploy(data);
      } catch (error) {
        console.error("Failed to fetch deploy data:", error);
      }
    };

    fetchDeployData();
  }, [id]);

  const handleTabChange = useCallback(
    (_, newIndex) => setTabIndex(newIndex),
    []
  );

  const TabComponent = tabComponents[tabIndex];

  return (
    <div className="p-8 h-[calc(100%-80px)]">
      <div className="bg-white flex flex-col border border-[#E0E1E4] h-full overflow-auto">
        <div>
          <DeployDetailHeader strategy={deployFilterData} />
          <NavigationTabs
            tabs={[
              "Details",
              "Capital",
              "Holdings",
              "Trade To-do",
              "Trade History",
              "Performance",
            ]}
            value={tabIndex}
            onChange={handleTabChange}
          />
          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
        </div>
        {/* <div className="flex-grow overflow-auto"> */}
        <div className="p-8 space-y-4 flex-grow overflow-auto">
          <Grid item xs={12} md={6} lg={8}>
            <TabComponent data={deployFilterData} />
          </Grid>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default DeployPage;
