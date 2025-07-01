import React, { useState } from "react";
import { Color, Icons } from "../../../constants/AppResource";
import Input from "../../../components/input/Input";

const MacdModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [macdModalInput, setMacdModalInput] = useState({
    panel: "",
    yaxis: "",
  });
  const handleMacdModalInput = (e) => {
    setMacdModalInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-full w-[432px] min-h-[505px]  flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-midDark">MACD</h2>
          <img
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={onClose}
            src={Icons.CloseIcon}
          />
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto">
          <div>
            <p className="text-sm text-textColor pb-[3px]">Fast MA Period</p>
            <InputField type="number" />
          </div>
          <br></br>
          <div>
            <p className="text-sm text-textColor pb-[3px]">Slow MA Period</p>
            <InputField type="number" />
          </div>
          <br></br>
          <div>
            <p className="text-sm text-textColor pb-[3px]">Signal Period</p>
            <InputField type="number" />
          </div>
          <br></br>
          <div>
            <p className="text-sm text-textColor pb-[5px]">Panel</p>
            <Input
              name="panel"
              value={macdModalInput.panel}
              onChange={handleMacdModalInput}
            />
          </div>
          <br></br>
          <div>
            <p className="text-sm text-textColor pb-[5px]">Y-Axis Value</p>
            <Input
              name="yaxis"
              value={macdModalInput.yaxis}
              onChange={handleMacdModalInput}
            />
          </div>

          <div className="pt-3">
            <div
              className={`border pt-1.5 pb-1.5 pl-3 pr-3  rounded-lg  font-medium text-center cursor-pointer text-white bg-switchBlueColor text-sm`}
            >
              Apply
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacdModal;

const InputField = ({ type = "text", placeholder = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent border border-stroke dark:border-dark-3 py-[3px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2 text-xs border-mintColor"
    />
  );
};
