import React, { useState } from "react";
import { Color, Icons } from "../../constants/AppResource";
import Table from "../../components/Table/Table";
import CreateNewBundle from "./childSections/CreateBundle";
import InitialSection from "./childSections/InitialSection";
import { useNavigate } from "react-router-dom";

const tableData = [
  {
    name: "All Stocks",
    Exchange: "Nasdaq",
    Tickers: "GOOG, META + 300 more",
    Operation: "",
  },
  {
    name: "Nasdaq Small Cap",
    Exchange: "Nasdaq",
    Tickers: "TNK, DAC + 20 more",
    Operation: "",
  },
  {
    name: "Penny Stock Finder Function",
    Exchange: "Nasdaq",
    Tickers: "Dynamic",
    Operation: "",
  },
];


const StockList = () => {

  const [selectedRowIndex, setSelectedRowIndex] = useState(tableData[0]);
  const handleRowClick = (data) => {
    setOpenNewBundle(false);
    setSelectedRowIndex(data);
  };

  const [initialTextAreaInput, setInitialTextAreaInput] = useState(null); 
  const handleInitialTextAreaInput = (event) => {
    setInitialTextAreaInput(event.target.value);
  };

  const [isOpenNewBundle,setOpenNewBundle] = useState(false);


  const [newBundleInput, setNewBundleInput] = useState({
    name: "",
    exchange: "",
    description: "",
    advancedFilterTextArea: '',
  });
  const handleNewBundleInputInputValue = (e) => {
    setNewBundleInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const navigate = useNavigate();


  return (
    <div className={`p-2 lg:p-5 bg-darkGray `} >
      <div className="mt-3">
        <p className="text-textColor text-[18px]" >Stock Bundles</p>
      </div>
      <br></br>
      <div
        className=" border-dotted  border-2 rounded-lg overflow-hidden bg-fadeGray border-lightDark "
        
      >
        <div className="overflow-x-auto">
          <Table
            tableHeader={['name',"Exchange","Tickers",'Operation']}
            tableData={tableData}
            selectedRowIndex={selectedRowIndex}
            handleRowClick={handleRowClick}
          />
        </div>
        <br></br>

        <div className="m-4 lg:m-7 shadow-md border rounded-lg p-5 min-h-[488px] " >
          {
            !isOpenNewBundle ?  
            <InitialSection  
              handleInitialTextAreaInput={handleInitialTextAreaInput}
              initialTextAreaInput={initialTextAreaInput} 
              selectedTableData={selectedRowIndex}
              setOpenNewBundle={setOpenNewBundle}
            /> :
            <CreateNewBundle
            newBundleInput={newBundleInput}
            setNewBundleInput={setNewBundleInput}
            handleNewBundleInputInputValue={handleNewBundleInputInputValue}
          />

          }
         
        </div>

        <div className="flex justify-end mt-2 mr-4 mb-3">
          <div
            className={`border pt-1.5 pb-1.5 pl-3 pr-3  rounded-lg  font-medium cursor-pointer text-white bg-switchBlueColor text-[14px]`}
            onClick={()=>navigate("/strategy")}
         >
            {
              !isOpenNewBundle ? 'New':"Save"
            }
          </div>
        </div>
      </div>
    </div>
  );
};



export default StockList;
