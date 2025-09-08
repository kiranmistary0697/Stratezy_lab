import Button from "../../common/Button";
import { servicesData } from "../../../constants/OurServicesSectionData";
import { useNavigate } from "react-router-dom";
import routes from "../../../constants/Routes";
import { useAuth } from "../../../contexts/AuthContext";

const OurServices = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-[rgba(61,105,211,0.06)]">
      <div className="grid lg:grid-cols-2 items-center max-w-maxContent mx-auto lg:px-[135px] lg:py-[80px] px-[20px] py-[60px] gap-x-[30px] gap-y-[50px] tracking-[0.591px]">
        {/* Left */}
        <div className="lg:max-w-[570] flex flex-col items-start gap-x-[50px] gap-y-[20px] lg:mr-[25px]">
          <p className="text-primary-blue lg:text-[24px] text-[20px] leading-[60px] font-semibold font-lato">
            Enabling Smart Trading for everyone
          </p>
          <h1 className="text-primary lg:text-[38px] text-[30px] leading-[50px] lg:leading-[60px] font-semibold">
            Simplified Strategies, Backtesting, and Deployment
          </h1>
          <p className="text-secondary lg:text-[24px] text-[20px] lg:leading-[33.6px] leading-[28px]">
            From strategy creation to backtesting and seamless integration with
            leading broker houses, Orion transforms complexity into simplicity.
          </p>
          <div className="hidden lg:flex items-center gap-x-5">
            {!isAuthenticated && (
              <Button variant="filled" onClick={() => navigate(routes.signup)}>
                Request Access
              </Button>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col lg:gap-y-11 gap-y-[50px]">
          {servicesData.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-y-5">
              <img className="h-[90px] w-[90px]" src={item.image} />
              <h4 className="text-primary text-[26px] font-medium leading-[31.2px]">
                {item.title}
              </h4>
              <p className="text-secondary lg:text-[24px] text-[20px] lg:leading-[33.6px] leading-[28px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurServices;
