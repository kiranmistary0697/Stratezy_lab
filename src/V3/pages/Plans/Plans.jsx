import React, { useState } from "react";
import { Box } from "@mui/material";
import PlansHeader from "./PlansHeader";
import PlansCard from "./PlansCard";
import { usePostMutation } from "../../../slices/api";
import { SUBSCRIPTION_ID } from "../../../constants/Enum";

const freePlanList = [
  "50 Backtest Credits",
  "1 Deployment free for one month ",
  "Dev Studio.",
];

const proPlanList = [
  "1000 Backtest Credits",
  "2 simultaneous Deployments",
  "Dev Studio.",
];
const Plans = () => {
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [buttonText, setButtonText] = useState({
    Free: "Current Plan",
    Pro: "Subscribe",
  });
  const [newSubscription] = usePostMutation();

  const handleChangePlan = async (plan) => {
    if (plan === "Pro") {
      setCurrentPlan("Pro");
      setButtonText({ Free: "Use this Plan", Pro: "Current Plan" });
    } else {
      setCurrentPlan("Free");
      setButtonText({ Free: "Current Plan", Pro: "Subscribe" });
    }

    try {
      const { data } = await newSubscription({
        endpoint: "/stockclient/create-session",
        payload: { priceId: SUBSCRIPTION_ID },
      }).unwrap();

      if (data && data.url) {
        window.location = data.url;
      }
    } catch (error) {
      console.error("error while subscribe", error);
    }
  };

  return (
    <Box className="sm:h-[calc(100vh-100px)] overflow-auto">
      <div className="justify-items-center items-center bg-white h-full space-y-8">
        <PlansHeader />
        <div className="flex gap-8 items-center px-5 max-md:flex-col">
          <PlansCard
            title="Free Plan"
            description="The quickest and easiest way to try Orion for free. Upgrade anytime."
            price={0}
            isCurrentPlan={currentPlan === "Free"}
            features={freePlanList}
            buttonText={buttonText.Free}
            buttonClassName={
              currentPlan === "Free"
                ? "text-[#666666] bg-[#E0E1E4]"
                : "text-white bg-[#3D69D3]"
            }
            handleChangeButtonText={() => handleChangePlan("Free")}
          />
          <PlansCard
            title="Pro Plan"
            description="Backtest & experiment multiple times with your strategies as per your wish"
            price={25}
            isRecommended={true}
            features={proPlanList}
            buttonText={buttonText.Pro}
            buttonClassName={
              currentPlan === "Pro"
                ? "text-[#666666] bg-[#E0E1E4]"
                : "text-white bg-[#3D69D3]"
            }
            handleChangeButtonText={() => handleChangePlan("Pro")}
          />
        </div>
      </div>
    </Box>
  );
};

export default Plans;
