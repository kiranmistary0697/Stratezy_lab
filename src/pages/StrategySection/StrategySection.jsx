import React, { useState } from "react";
import { Color, Icons } from "../../constants/AppResource";
import Table from "../../components/Table/Table";
import InitialSection from "./childSection/InitialSection";
import CreateNewStrategy from "./childSection/CreateNewStrategy";
import CreateNewBundle from "../StockList/childSections/CreateBundle";


const tableData = [
  {
    name: "My Momentum 14 Days",
    Description: "Only the fast movers",
    Backtest: "None",
    Operation: "",
  },
  {
    name: "Nasdaq Small Cap",
    Description: "Price < $20 and High Rel Vol",
    Backtest: "My Defense BT",
    Operation: "",
  },
  {
    name: "My RSI 50",
    Description: "Nasdaq",
    Backtest: "None",
    Operation: "",
  },
];




const StrategySection = () => {

  const [selectedRowIndex, setSelectedRowIndex] = useState(tableData[0]);
  const handleRowClick = (data) => {
    setOpenNewStrategy(false);
    setSelectedRowIndex(data);
  };

  const [initialTextAreaInput, setInitialTextAreaInput] = useState(null); 
  const handleInitialTextAreaInput = (event) => {
    setInitialTextAreaInput(event.target.value);
  };

  const [isOpenNewStrategy,setOpenNewStrategy] = useState(false);

  const [newStrategyInput, setNewStrategyInput] = useState({
    name: "",
    codeTextArea: "",
    description: "",
    advancedFilterTextArea: '',
  });
  const handlenewStrategyValue = (e) => {
    setNewStrategyInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  


  return (
    <div className={`p-2 lg:p-5 bg-darkGray `} >
      <div className="mt-3">
        <p className="text-lg text-textColor" >Strategy</p>
      </div>
      <br></br>
      <div
        className=" border-dotted  border-2 bg-fadeGray border-lightDark rounded-lg overflow-hidden "
        
      >
        <div className="overflow-x-auto">
          <Table
            tableHeader={['name',"Description","Backtest",'Operation']}
            tableData={tableData}
            selectedRowIndex={selectedRowIndex}
            handleRowClick={handleRowClick}
          />
        </div>
        <br></br>

        <div className="m-4 lg:m-7 shadow-md border rounded-lg p-5 min-h-[488px] " >
          {
            !isOpenNewStrategy ?  
            <InitialSection  
              handleInitialTextAreaInput={handleInitialTextAreaInput}
              initialTextAreaInput={initialTextAreaInput} 
              selectedTableData={selectedRowIndex}
              setOpenNewStrategy={setOpenNewStrategy}
            /> 
            :
            <CreateNewStrategy
               newStrategyInput={newStrategyInput}
                setNewStrategyInput={setNewStrategyInput}
                handlenewStrategyValue={handlenewStrategyValue}
            />
            

          }
         
        </div>

        <div className="flex justify-end mt-2 mr-4 mb-3">
          <div
            className={`border pt-1.5 pb-1.5 pl-3 pr-3  text-white bg-switchBlueColor text-sm rounded-lg  font-medium cursor-pointer`}
            
          >
            New
          </div>
        </div>
      </div>
    </div>
  );
};



export default StrategySection;
