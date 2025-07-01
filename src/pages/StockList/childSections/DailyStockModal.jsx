import React, { useEffect, useState } from "react";
import { Color, Icons } from "../../../constants/AppResource";
import StocklineChart from "../../../components/Charts/StocklineChart";
import TinyAreaChart from "../../../components/Charts/TinyAreaChart";
import ProgressLineChart from "../../../components/Charts/ProgressLineChart";
import MacdModal from "./MacdModal";
import FilterSection from "./FilterSection";

const DailyStockModal = ({ isOpen, onClose, children }) => {
  const [isFilterSectionOpen, setFilterSectionOpen] = useState(false);
  const [ismacdModalOpen, setMacdModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  const staticData = [];
  let prev = 100;
  for (let i = 0; i < 500; i++) {
    prev += 5 - Math.random() * 10;
    staticData.push({ x: i, y: prev });
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-full  w-[1164px] h-[90%]   flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h2
            className="font-medium text-midDark text-base"
          >
            Verification Results
          </h2>
          <img
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={onClose}
            src={Icons.CloseIcon}
          />
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="border rounded-lg p-3">
            <h2
              className="font-medium pl-9 pb-5 text-midDark text-lg"
              
            >
              Daily stocks in filter
            </h2>
            <div
              onClick={() => setFilterSectionOpen(true)}
              className="cursor-pointer"
            >
              {/* <StocklineChart /> */}
              <ProgressLineChart data={staticData} title={"Stock Count"} />
            </div>

            <FilterSection
              isOpen={isFilterSectionOpen}
              onClose={() => setFilterSectionOpen(false)}
            />

            <MacdModal
              isOpen={ismacdModalOpen}
              onClose={() => setMacdModalOpen(false)}
            />
          </div>
          <div
            className="pt-5 cursor-pointer"
            onClick={() => setMacdModalOpen(true)}
          >
            <StockTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStockModal;

const StockTable = () => {
  const data = [
    {
      ticker: "GOOG",
      movement: "ADDED",
      open: "Data",
      close: "Data",
      last: 90,
      trend: [
        { name: "Page A", uv: 1, pv: 2, amt: 1 },
        { name: "Page B", uv: 20, pv: 198, amt: 20 },
        { name: "Page C", uv: 20, pv: 198, amt: 20 },
      ],
    },
    {
      ticker: "NCNC",
      movement: "ADDED",
      open: "Data",
      close: "Data",
      last: 55,
      trend: [
        { name: "Page A", uv: 1, pv: 2, amt: 1 },
        { name: "Page B", uv: 20, pv: 198, amt: 20 },
        { name: "Page C", uv: 20, pv: 198, amt: 20 },
      ],
    },
    {
      ticker: "GM",
      movement: "REMOVED",
      open: "Data",
      close: "Data",
      last: 35,
      trend: [
        { name: "Page A", uv: 20, pv: 198, amt: 20 },
        { name: "Page B", uv: 20, pv: 198, amt: 20 },
        { name: "Page C", uv: 1, pv: 2, amt: 1 },
      ],
    },
    {
      ticker: "BP",
      movement: "ADDED",
      open: "Data",
      close: "Data",
      last: 70,
      trend: [
        { name: "Page A", uv: 1, pv: 2, amt: 1 },
        { name: "Page B", uv: 20, pv: 198, amt: 20 },
        { name: "Page C", uv: 20, pv: 198, amt: 20 },
      ],
    },
    {
      ticker: "PGE",
      movement: "ADDED",
      open: "Data",
      close: "Data",
      last: 58,
      trend: [
        { name: "Page A", uv: 1, pv: 2, amt: 1 },
        { name: "Page B", uv: 20, pv: 198, amt: 20 },
        { name: "Page C", uv: 20, pv: 198, amt: 20 },
      ],
    },
    {
      ticker: "MSFT",
      movement: "REMOVED",
      open: "Data",
      close: "Data",
      last: 40,
      trend: [
        { name: "Page A", uv: 20, pv: 198, amt: 20 },
        { name: "Page B", uv: 20, pv: 198, amt: 20 },
        { name: "Page C", uv: 1, pv: 2, amt: 1 },
      ],
    },
  ];

  return (
    <div className="flex flex-col ">
      <div className="-my-2 overflow-x-auto ">
        <div className="py-2 align-middle inline-block min-w-full ">
          <table className="min-w-full  divide-gray-200 border rounded-lg  overflow-hidden">
            <thead className="bg-gray-50 ">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-xs font-medium text-gray-600   border-2 border-gray-200  "
                >
                  +
                </th>
                <th
                  scope="col"
                  className="px-3 text-left text-xs font-bold text-gray-600  uppercase  border-2 border-gray-200 "
                >
                  Ticker
                </th>
                <th
                  scope="col"
                  className="px-3  text-left text-xs font-bold text-gray-600 uppercase  border-2 border-gray-200 "
                >
                  Trend
                </th>
                <th
                  scope="col"
                  className="px-3  text-left text-xs font-bold text-gray-600 uppercase  border-2 border-gray-200 "
                >
                  Open
                </th>
                <th
                  scope="col"
                  className="px-3  text-left text-xs font-bold text-gray-600 uppercase  border-2 border-gray-200 "
                >
                  Close
                </th>
                <th
                  scope="col"
                  className="px-3  text-left text-xs font-bold text-gray-600 uppercase  border-2 border-gray-200 "
                >
                  Movement
                </th>
                <th
                  scope="col"
                  className="px-3  text-right text-xs font-bold text-gray-600 uppercase  border-2 border-gray-200 "
                >
                  @@1
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row.ticker}>
                  <td className="border-2 border-gray-200"></td>
                  <td className="px-3 py-2 whitespace-nowrap border-2 border-gray-200">
                    <div
                      className="text-[12px] font-medium text-fadeDark"
                    >
                      {row.ticker}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap border-2 border-gray-200 w-[50px]">
                    <div
                      className="text-sm  text-fadeDark font-light"
                    >
                      <TinyAreaChart data={row.trend} />
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap border-2 border-gray-200">
                    <div
                      className="text-sm text-fadeDark font-light"
                    >
                      {row.open}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap border-2 border-gray-200">
                    <div
                      className="text-sm text-fadeDark font-light "
                      
                    >
                      {row.close}
                    </div>
                  </td>
                  <td className="pl-3 whitespace-nowrap border-2 border-gray-200 ">
                    <span
                      className={`  text-xs leading-5  rounded-full font-light`}
                      style={{
                        
                        color:
                          row.movement === "ADDED"
                            ? Color.lightGreen
                            : Color.lightRed,
                      }}
                    >
                      {row.movement}
                    </span>
                  </td>

                  <td className="px-3 text-right  whitespace-nowrap border-2 border-gray-200">
                    <div
                      className="text-sm text-fadeDark font-light"
                      
                    >
                      {row.last}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
