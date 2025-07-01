import React from "react";
import HeroImage from "../../../assets/HeroImage.png";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import routes from "../../../constants/Routes";
import { useAuth } from "../../../contexts/AuthContext";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const HeroSection = () => {
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="grid lg:grid-cols-2 items-center max-w-maxContent mx-auto lg:px-[135px] lg:py-[150px] px-[20px] py-[60px] gap-x-[55px] gap-y-[24px]">
      <div className="lg:max-w-[545px] flex flex-col items-start gap-y-[22px] lg:gap-y-[24px]">
        <h1 className="text-primary lg:text-[45px] text-[30px] leading-[50px] lg:leading-[60px] font-semibold">
          Start Investing, Smarter Today.
        </h1>
        <p className="text-secondary lg:text-[24px] text-[20px] leading-9">
          Simplified Investing Strategy Discovery, Creation, Backtesting, and
          Deployment Platform
        </p>

        {!isAuthenticated && (
          <div className="flex flex-wrap items-center gap-5 w-full">
            <Button
              variant="filled"
              className="w-full lg:w-fit"
              onClick={() => navigate(routes.signup)}
            >
              Request Access
            </Button>
            <Button
              className="w-full lg:w-fit"
              onClick={() => navigate(routes.signin)}
            >
              Sign in
            </Button>
          </div>
        )}
      </div>
      <div className="lg:max-w-[570px]">
        <img
          src={HeroImage}
          alt="hero-image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default HeroSection;
