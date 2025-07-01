import React, { useEffect } from "react";
import { Color, Icons } from "../../../constants/AppResource";
import "./section.css";
import TinyLineChart from "../../../components/Charts/TinyLineChart";

const leftSection = {
  technical: [
    { key: "Average volume" },
    { key: "Today's volume" },
    { key: "Relative volume" },
    { key: "New 52-week high/low" },
    { key: "1-week relative high/low" },
    { key: "1-month relative high/low" },
    { key: "3-month relative high/low" },
  ],
  price: [
    { key: "Share price" },
    { key: "Daily % change" },
    { key: "Weekly % change" },
    { key: "Monthly% change" },
    { key: "Three monthly% change" },
    { key: "Yearly % change" },
  ],
  market: [{ key: "Market cap" }],
};
const rightSection = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    chart: "",
    optionvol: "3.31M",
    price: "$148.21",
    chg: "0.05%",
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
  {
    symbol: "MARA",
    name: "MARA Holding",
    chart: "",
    optionvol: "2.77M",
    price: "$338.21",
    chg: "3.14%",
  },
];

const generateZigZagData = (points, min, max) => {
    const data = [];
    let currentValue = Math.floor((min + max) / 2); 
  
    for (let i = 0; i < points; i++) {
      const randomStep = Math.floor(Math.random() * (max - min) * 0.1) * (Math.random() > 0.5 ? 1 : -1);
      currentValue = Math.max(min, Math.min(max, currentValue + randomStep)); // Keep within bounds
      data.push({ name: `Point ${i + 1}`, value: currentValue });
    }
    return data;
  };
  

const FilterSection = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-stealGray bg-opacity-20 z-50"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-full w-[1164px] h-[95%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h2
            className="font-medium text-midDark text-base"
          >
            Filters
          </h2>
          <img
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={onClose}
            src={Icons.CloseIcon}
          />
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto md:overflow-hidden md:h-[90%]">
          <div className="grid grid-cols-12 gap-2">
            {/* Left Section */}
            <div
              className="col-span-5 md:col-span-3 bg-black pt-3 pb-3 pl-5 pr-3 overflow-y-auto hide-scrollbar"
              style={{ maxHeight: "calc(100vh - 150px)" }}
            >
              <p className="font-medium text-xs text-white">Technical</p>
              {leftSection.technical.map((i, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer border-b-[.5px] pb-3 pt-3 border-gray-700 hover:bg-slate-900"
                >
                  <p className="text-gray-300 text-[11px]">{i.key}</p>
                  <img
                    src={Icons.ArrowInputIcon}
                    className="h-[5px] rotate-[-90deg]"
                  />
                </div>
              ))}
              <p className="font-medium text-xs text-white pt-3">Price</p>
              {leftSection.price.map((i, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer border-b-[.5px] hover:bg-slate-900 pb-3 pt-3 border-gray-700"
                >
                  <p className="text-gray-300 text-[11px]">{i.key}</p>
                  <img
                    src={Icons.ArrowInputIcon}
                    className="h-[5px] rotate-[-90deg]"
                  />
                </div>
              ))}
              <p className="font-medium text-xs text-white pt-3">Market</p>
              {leftSection.market.map((i, index) => (
                <div
                  key={index}
                  className="flex items-center hover:bg-slate-900 justify-between cursor-pointer border-b-[.5px] pb-3 pt-3 border-gray-700"
                >
                  <p className="text-gray-300 text-[11px]">{i.key}</p>
                  <img
                    src={Icons.ArrowInputIcon}
                    className="h-[5px] rotate-[-90deg]"
                  />
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div
              className="col-span-7 md:col-span-9 bg-black overflow-y-auto hide-scrollbar"
              style={{ maxHeight: "calc(100vh - 150px)" }}
            >
              <div className="pb-10 w-full h-full overflow-scroll hide-scrollbar ">
                <div className="p-3">
                  <h2
                    className="font-medium text-base text-white"
                  >
                    Highest options volume
                  </h2>
                  <div className="flex gap-2">
                    <p className="text-[10px] text-gray-400 ">
                      {rightSection.length}+ items
                    </p>
                    <p className="text-[10px] text-gray-400 ">
                      updated 15 minutes ago
                    </p>
                  </div>
                </div>
                <table className="w-full text-left ">
                  <thead>
                    <tr className="border-b-[0.1px] border-gray-700">
                      <th className="p-3 border-b-[0.1px] border-gray-700 w-[10px] ">
                        <img
                          src={Icons.PencilAltGrayIcon}
                          className="h-[14px] "
                        />
                      </th>
                      <th className="p-3 w-[20%] hover:border-b hover:border-white cursor-pointer ">
                        <p className="font-bold leading-none text-gray-400 text-[10px]  ">
                          Symbol
                        </p>
                      </th>
                      <th className="p-3  hover:border-b hover:border-white cursor-pointer ">
                        <p className="font-bold leading-none text-gray-400 text-[10px]  ">
                          1D Chart
                        </p>
                      </th>
                      <th className="p-3  hover:border-b hover:border-white cursor-pointer ">
                        <p className="font-bold leading-none text-gray-400 text-[10px]  ">
                        ↓ Options Vol.
                        </p>
                      </th>
                      <th className="p-3  hover:border-b hover:border-white cursor-pointer ">
                        <p className="font-bold leading-none text-gray-400 text-[10px]  ">
                          Price
                        </p>
                      </th>
                      <th className="p-3  hover:border-b hover:border-white cursor-pointer ">
                        <p className="font-bold leading-none text-gray-400 text-[10px]  ">
                          1D % Chg
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rightSection.map((i, index) => (
                      <tr
                        key={index}
                        className="border-b-[0.1px] border-gray-700 cursor-pointer hover:bg-slate-900"
                      >
                        <td className="p-4 ">
                          <p className=" text-white text-[10px]">{index + 1}</p>
                        </td>
                        <td className="p-4 ">
                          <p className=" font-medium text-white text-[10px]">
                            {i.symbol}
                          </p>
                          <p className=" font-medium text-gray-400 text-[10px]">
                            {i.name}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className=" text-white text-[10px] w-[50px] ">
                            <TinyLineChart
                              data={generateZigZagData(100, 20, 50)}
                            />
                          </p>
                        </td>
                        <td className="p-4 ">
                          <p className=" text-white text-[10px]">
                            {i.optionvol}
                          </p>
                        </td>
                        <td className="p-4 ">
                          <p className=" text-white text-[10px]">{i.price}</p>
                        </td>
                        <td className="p-4 ">
                          <p className=" text-white text-[10px]">{i.chg}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Evaluate Button */}
        <div
          className="border pt-1.5 w-full pb-1.5 pl-3 pr-3 mt-3 rounded-lg font-medium text-center cursor-pointer  text-white bg-switchBlueColor text-sm"
          
        >
          Evaluate
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
