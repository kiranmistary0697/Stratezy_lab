import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import routes from "../../../constants/Routes";
import { useAuth } from "../../../contexts/AuthContext";

const InvestorSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-maxContent flex flex-col items-center mx-auto px-5 md:px-[100px] py-[60px] md:py-[120px] text-center gap-y-[1.875rem]">
      <h3 className="text-primary text-3xl md:text-[2.5rem] font-semibold leading-[50px] md:leading-[60px]">
        For every investor, not just the professional traders
      </h3>
      <div className="max-w-[960px] flex flex-col gap-y-[0.625rem] text-secondary text-xl md:text-[1.75rem]">
        <p className="leading-7 lg:leading-[39.2px] md:mx-6">
          Orion is for the dreamers, the learners, and the doers. We designed
          our platform to meet you where you are on your trading journey - with
          friendly, intuitive experience that grows with you. Because the art of
          investing belongs to everyone.
        </p>
        <span className="leading-[44px]">Start Investing Smarter Today.</span>
      </div>
      {!isAuthenticated && (
        <Button
          variant="filled"
          className="w-full md:w-fit"
          onClick={() => navigate(routes.signup)}
        >
          Request Access
        </Button>
      )}
    </div>
  );
};

export default InvestorSection;
