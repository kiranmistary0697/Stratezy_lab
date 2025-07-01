import { useState } from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownCounter from "../../components/Dropdown/DropdownCounter";
import Input from "../../components/input/Input";
import Toggle from "../../components/ToggleSwitch/Toggle";
import { Color } from "../../constants/AppResource";
import SelectionDropdown from "../../components/Dropdown/SelectionDropdown";
import InputDropdown from "../../components/Dropdown/InputDropdown";
import { useNavigate } from "react-router-dom";

function Backtests() {
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const selectionoptions = [
    "ascending",
    "Custom Order",
    "descending",
    "High Momentum First",
    "Option 5",
  ];

  const [inputValue, setInputValue] = useState({
    PortfolioRisk: "",
    MaxInvestment: "",
  });

  const handleInputValue = (e) => {
    setInputValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [toggleStates, setToggleStates] = useState({
    toggle1: false,
    toggle2: false,
  });

  const handleToggleChange = (toggleKey, state) => {
    setToggleStates((prev) => ({
      ...prev,
      [toggleKey]: state,
    }));
    console.log(`${toggleKey} is:`, state ? "ON" : "OFF");
  };

  const navigate = useNavigate()

  return (
    <div className="w-screen pt-10 pb-10">
      <main className="w-[95%] shadow-md rounded-3xl m-auto p-6 border ">
        <div>
          <div className={`text-[24px] pb-5 font-medium `} >
            Create Backtest
          </div>
          <hr></hr>
        </div>

        <div className="grid grid-cols-12  pt-5 ">
          <div className="col-span-12 lg:col-span-3  ">
            <div>
              <p>Stock selection</p>
              <Dropdown options={options} placeholder="Select..." />
            </div>
            <br></br>
            <div>
              <p>Strategy selection</p>
              <Dropdown options={options} placeholder="Select..." />
            </div>
            <br></br>
            <div>
              <p>Initial Capital</p>
              <DropdownCounter
                min={0}
                max={50}
                step={5}
                initialValue=""
                placeholder="Amount"
              />
            </div>
            <br></br>
            <div>
              <p>Portfolio Risk</p>
              <Input
                name="PortfolioRisk"
                value={inputValue.PortfolioRisk}
                onChange={handleInputValue}
                placeholder="Type.."
              />
            </div>
            <br></br>
            <div>
              <p>Max Investment/Trade</p>
              <Input
                name="MaxInvestment"
                value={inputValue.MaxInvestment}
                onChange={handleInputValue}
                placeholder="Type.."
              />
            </div>
            <br></br>
            <div>
              <p>Max Investment/Trade</p>
              <Input
                name="MaxInvestment"
                value={inputValue.MaxInvestment}
                onChange={handleInputValue}
                placeholder="Type.."
              />
            </div>
            <br></br>
            <div className="flex items-center gap-3">
              <p>Same Day Trade</p>
              <Toggle
                id="toggle1"
                checked={toggleStates.toggle1}
                onChange={(state) => handleToggleChange("toggle1", state)}
                switchColor="#E5E7EB"
                dotColor="#1F2937"
                checkedDotColor="#10B981"
              />
            </div>
            <br></br>
            <div className="flex items-center gap-3">
              <p>Trading Stop Loss</p>
              <Toggle
                id="toggle2"
                checked={toggleStates.toggle2}
                onChange={(state) => handleToggleChange("toggle2", state)}
                switchColor="#E5E7EB"
                dotColor="#1F2937"
                checkedDotColor="#10B981"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9 pt-5 md:ml-5 md:mr-5 lg:border-l border-black lg:pl-4 ">
            <div className="border rounded-lg shadow-md p-5 md:p-8">
              <div>
                <p>Dynamic Portfolio Adjustment Rules</p>
              </div>

              <div className="grid grid-cols-12 lg:gap-4 pb-10">
                <div className="col-span-12 lg:col-span-6">
                  <br></br>
                  <Dropdown options={options} placeholder="Global Entry Rule" />
                  <br></br>
                  <Dropdown options={options} placeholder="Trade Entry" />
                  <br></br>
                  <Dropdown options={options} placeholder="Global Exit Rule" />
                  <br></br>
                  <Dropdown options={options} placeholder="Trade Exit" />
                  <br></br>
                  <InputDropdown options={['Size Per Volatility']} placeholder="Protfolio Sizing" />
                  <br></br>
                  <SelectionDropdown
                    options={selectionoptions}
                    placeholder="Trade Order Rules"
                  />
                  <br></br>
                </div>
                <div className="col-span-12 lg:col-span-6"></div>
              </div>
            </div>

            <div className="flex gap-4 mt-10 mb-5 justify-end">
              <div
                className={`border pt-1.5 pb-1.5 pl-3 pr-3 text-switchBlueColor  text-sm rounded-lg  font-medium cursor-pointer border-lightBlue`}
              >
                Save
              </div>
              <div
                className={`border pt-1.5 text-white bg-switchBlueColor text-sm pb-1.5 pl-3 pr-3  rounded-lg  font-medium cursor-pointer`}
                onClick={()=>navigate("/stocklist")}
              >
                Simulate
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Backtests;
