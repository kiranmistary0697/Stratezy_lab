import React, { useState } from "react";
import { Color, Icons } from "../../../constants/AppResource";

const VerificationModal = ({
  isOpen,
  onClose,
  children,
  handleIsDailyStockUnderVerifyModal,
}) => {
  if (!isOpen) return null;

  const [selectedTimeframe, setselectedTimeframe] = useState("1 week");
  const handleTimeframeClick = (option) => {
    setselectedTimeframe(option);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-full w-[1018px] h-[374px] sm:w-[70%] sm:h-auto flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-medium text-midDark">Verification Parameters</h2>
          <img
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={onClose}
            src={Icons.CloseIcon}
          />
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto">
          <p className="text-sm text-placeholderGray">
            Define the default values for arguments as well as testing
            boundaries
          </p>
          <div className="pt-3">
            <p className="text-midDark text-sm">Verification Timeframe</p>
            <div className="inline-flex gap-3 items-center w-auto rounded-lg p-1 mt-3 bg-midGray">
              {["1 week", "1 month", "Custom"].map((option) => (
                <div
                  key={option}
                  className={`pt-1 pb-1 pl-3 pr-3 rounded cursor-pointer text-sm ${
                    selectedTimeframe === option ? "bg-white" : "bg-transparent"
                  }`}
                  onClick={() => handleTimeframeClick(option)}
                  style={{
                    color:
                      selectedTimeframe === option
                        ? Color.switchBlueColor
                        : Color.placeholderGray,
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3">
            <p className="text-sm text-midDark">Default Arguments</p>
            <div className="pt-3  pr-3 md:pl-0 md:pr-0 grid grid-cols-12 gap-2">
              <div className="col-span-12 md:col-span-6">
                <p className="text-xs text-midDark">Descriptor</p>
                <InputField placeholder="@@1" />
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="text-sm text-midDark">Default Value</p>
                <div className="flex gap-1">
                  <InputField type="number" />
                  <img src={Icons.PlusAddIcon} className="w-[16px] h-[16px]" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="text-sm text-midDark">Descriptor</p>
                <InputField placeholder="@@1" />
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="text-sm text-midDark">Default Value</p>
                <div className="flex gap-1">
                  <InputField type="number" />
                  <img src={Icons.PlusAddIcon} className="h-[16px] w-[16px]" />
                </div>
              </div>
            </div>
            <div
              className={`border pt-1.5 pb-1.5 pl-3 pr-3 mt-3 text-white bg-switchBlueColor text-sm  rounded-lg  font-medium text-center cursor-pointer`}
              onClick={handleIsDailyStockUnderVerifyModal}
            >
              Evaluate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;

const InputField = ({ type = "text", placeholder = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent border border-stroke text-xs border-mintColor dark:border-dark-3 py-[3px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
    />
  );
};
