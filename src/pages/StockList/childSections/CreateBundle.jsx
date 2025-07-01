import { useState } from "react";
import Input from "../../../components/input/Input";
import { Color, Icons, Images } from "../../../constants/AppResource";
import SelectionDropdown from "../../../components/Dropdown/SelectionDropdown";
import Dropdown from "../../../components/Dropdown/Dropdown";
import TextArea from "../../../components/Textarea/Textarea";
import VerificationModal from "./VerificationModal";
import DailyStockModal from "./DailyStockModal";

const stockData = [
  { ticker: "GOOG", companyname: "Google" },
  { ticker: "TSLA", companyname: "Tesla" },
  { ticker: "MSFT", companyname: "Microsoft" },
  { ticker: "FB", companyname: "Meta" },
  { ticker: "TI", companyname: "Texas Instruments" },
  { ticker: "DSNY", companyname: "Disney" },
];

const dynamicFilterData = [
  {name:'Daily price jumps' , image : Images.RectangleImage },
  {name:'Daily price dips' , image : Images.RectangleImage },
  {name:'52-week highs' , image : Images.RectangleImage },
  {name:'52-week lows' , image : Images.RectangleImage },
  {name:'Highest options volume' , image : Images.RectangleImage },
  {name:'Custom screener' , image : Images.RectangleImage },
]

const CreateNewBundle = ({
  newBundleInput,
  setNewBundleInput,
  handleNewBundleInputInputValue,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [isDailyStockModal, setIsDailyStockModal] = useState(false);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const handleIsDailyStockUnderVerifyModal = (status) => {
    setIsVerifyModalOpen(false);
    setIsDailyStockModal(true);
  };

  return (
    <div>
      <p className="font-medium text-textColor" >
        Create New Bundle
      </p>

      <div className="grid grid-cols-12 gap-3 mt-5">
        <div className=" col-span-12 lg:col-span-4 lg:pr-5">
          <div>
            <p className="text-textColor text-sm" >Name</p>
            <Input
              name="name"
              value={newBundleInput.name}
              onChange={handleNewBundleInputInputValue}
              bgColor={Color.fadeGray}
            />
          </div>
          <br></br>
          <div>
            <p className="text-textColor text-sm">Exchange</p>
            <Input
              name="exchange"
              value={newBundleInput.exchange}
              onChange={handleNewBundleInputInputValue}
              bgColor={Color.fadeGray}
            />
          </div>
          <br></br>
          <div>
            <p className="text-textColor text-sm">
              Description
            </p>
            <Input
              name="description"
              value={newBundleInput.description}
              onChange={handleNewBundleInputInputValue}
              bgColor={Color.fadeGray}
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 lg:pl-8 mt-5 lg:mt-0 pt-5 lg:pt-0 border-t lg:border-t-0 lg:border-l border-black lg:pb-12  ">
          <div className="flex flex-wrap lg:gap-5 border-b-2">
            <div
              className={`p-2 cursor-pointer ${
                activeTab === 0 ? "border-b-2 border-switchBlueColor" : ""
              }`}
              onClick={() => handleTabClick(0)}
            >
              <p className={`text-placeholderGray text-sm ${activeTab===0 ? 'text-switchBlueColor' :''} `}>
                Selected Stocks
              </p>
            </div>
            <div
              className={`p-2 cursor-pointer ${
                activeTab === 1 ? "border-b-2 border-switchBlueColor" : ""
              }`}
              onClick={() => handleTabClick(1)}
            >
              <p className={`text-placeholderGray text-sm ${activeTab===1 ? 'text-switchBlueColor' :''} `}>
                Dynamic Filter
              </p>
            </div>
            <div
              className={`p-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 2 ? "border-b-2 border-switchBlueColor" : ""
              }`}
              onClick={() => handleTabClick(2)}
            >
              <img src={Icons.UserIcon} className="h-[14px] w-[15px]" />
              <p className={`text-placeholderGray text-sm ${activeTab===2 ? 'text-switchBlueColor' :''} `}>
                Dynamic Filter - Advanced
              </p>
            </div>
          </div>

          <div className="mt-4">
            {activeTab === 0 && (
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 lg:col-span-4 pt-6">
                  <p className="text-textColor text-sm">
                    Search
                  </p>
                  <div className="flex items-center gap-1">
                    <Dropdown
                      options={["option1", "option2"]}
                      placeholder="Select..."
                    />
                    <img
                      src={Icons.PlusCircleIcon}
                      
                      className="w-[24px] h-[24px]"
                    />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-7 lg:pl-8 lg:pr-8">
                  <div className="flex justify-between items-center ">
                    <p className="text-textColor text-sm">
                      Ticker
                    </p>
                    <p className="text-textColor text-sm">
                      Company Name
                    </p>
                  </div>
                  {stockData.map((i, index) => (
                    <div
                      className="flex justify-between items-center border-b pb-2 pt-2"
                      key={index}
                      style={{
                        border: stockData.length == index + 1 && "none",
                      }}
                    >
                      <p
                        className="text-placeholderGray text-sm"
                      >
                        {i.ticker}
                      </p>
                      <p
                       className="text-placeholderGray text-sm"
                      >
                        {i.companyname}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 1 && 
            <div>
              <p className="text-sm">Choose your starting point</p>
              <div className="flex gap-7 flex-wrap justify-start items-center pt-3">
                  {
                    dynamicFilterData.map((i,index)=>(
                      <div key={index}>
                    <div><img src={i.image} className="h-[110px] w-[139px]" /></div>
                    <p className="text-xs text-black pt-1">{i.name}</p>
                  </div>
                    ))
                  }
              </div>
              
            </div>
            }

            {activeTab === 2 && (
              <div>
                <p>Code</p>
                <TextArea
                  value={newBundleInput.advancedFilterTextArea}
                  onChange={handleNewBundleInputInputValue}
                  minHeight="210px"
                  placeholder={"Start typing here..."}
                  borderStyle="border"
                  style={{ border: "1px solid #E5E7EB" }}
                  name="advancedFilterTextArea"
                />
                <div>
                  <div className="flex justify-between items-center mt-2">
                    <div
                      
                      className="text-placeholderGray text-xs font-normal"
                    >
                      Click{" "}
                      <a href="/" className="text-lightBlue">
                        here
                      </a>{" "}
                      for list of Helper functions
                    </div>
                    <div
                      className={`border pt-1.5 pb-1.5 pl-3 pr-3  rounded-lg  font-medium cursor-pointer text-white bg-switchBlueColor text-sm`}
                      
                      onClick={() => setIsVerifyModalOpen(true)}
                    >
                      {isVerifyModalOpen ? "Verify" : "Evaluate"}
                    </div>
                  </div>
                  <div
                    
                    className="text-placeholderGray text-xs font-normal"
                  >
                    Click{" "}
                    <a href="/" className="text-lightBlue">
                      here
                    </a>{" "}
                    for list of Stock Bundles - combine multiple to create new
                    Stock Filter
                  </div>
                </div>

                <VerificationModal
                  isOpen={isVerifyModalOpen}
                  onClose={() => setIsVerifyModalOpen(false)}
                  handleIsDailyStockUnderVerifyModal={
                    handleIsDailyStockUnderVerifyModal
                  }
                />
                <DailyStockModal
                  isOpen={isDailyStockModal}
                  onClose={() => setIsDailyStockModal(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewBundle;
