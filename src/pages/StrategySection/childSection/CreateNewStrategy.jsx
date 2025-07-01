import { useState } from "react";
import Input from "../../../components/input/Input";
import { Color, Icons, Images } from "../../../constants/AppResource";
import SelectionDropdown from "../../../components/Dropdown/SelectionDropdown";
import Dropdown from "../../../components/Dropdown/Dropdown";
import TextArea from "../../../components/Textarea/Textarea";
import Toggle from "../../../components/ToggleSwitch/Toggle";

const dropdownOptions = [
  "My Momentum 14 Days",
  "Nasdaq Small Cap",
  "Volume Tracker",
  "Moving Average",
];

const CreateNewStrategy = ({
  newStrategyInput,
  setNewStrategyInput,
  handlenewStrategyValue,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [toggleStates, setToggleStates] = useState({
    toggle1: false,
  });
  const handleToggleChange = (toggleKey, state) => {
    setToggleStates((prev) => ({
      ...prev,
      [toggleKey]: state,
    }));
  };

  
  return (
    <div>
      <p className="font-medium text-textColor" >
        Define New Strategy 
      </p>

      <div className="grid grid-cols-12 gap-3 mt-5">
        {/* left section */}
        <div className=" col-span-12 lg:col-span-4 lg:pr-5 ">
          <div   >
            <p className="text-sm text-textColor" >Name</p>
            <Input
              name="name"
              value={newStrategyInput.name}
              onChange={handlenewStrategyValue}
              bgColor={Color.fadeGray}
            />
          </div>
          <br></br>
          <div>
            <p  className="text-sm text-textColor" >
              Description
            </p>
            <Input
              name="description"
              value={newStrategyInput.description}
              onChange={handlenewStrategyValue}
              bgColor={Color.fadeGray}

            />
          </div>
          <br></br>
          <div className="flex items-center gap-2 pl-4">
            <Toggle
              id="toggle1"
              checked={toggleStates.toggle1}
              onChange={(state) => handleToggleChange("toggle1", state)}
            />
            <p
              
              className="text-sm text-placeholderGray font-light" 
            >
              Create a Strategy from stratch
            </p>
          </div>
          <br></br>
          {
            !toggleStates.toggle1 && 
            <div>
            <p
              
              className="text-sm text-textColor pb-[5px]" 
            >
              Base Strategy
            </p>
            <Dropdown
              placeholder="Choose the Strategy to Customize"
              options={dropdownOptions}
            />
          </div>
          }
        </div>

        {/* right section */}
        <div className="col-span-12 lg:col-span-8 lg:pl-8 mt-5 pt-5 lg:pt-0 lg:mt-0 border-t lg:border-t-0 lg:border-l border-black lg:pb-12 ">
          <div className="mt-4">
            <p>Code</p>
            <TextArea
              value={newStrategyInput.codeTextArea}
              onChange={handlenewStrategyValue}
              minHeight="210px"
              placeholder={"Select a Base Strategy to customize"}
              borderStyle="border"
              style={{ border: "1px solid #E5E7EB" }}
              name="codeTextArea"
            />
            <div>
              <div className="flex justify-between items-center mt-2">
                <div
                  
                  className="text-xs text-placeholderGray font-normal" 
                >
                  Click{" "}
                  <a href="/" className="text-lightBlue" >
                    here
                  </a>{" "}
                  for list of Helper functions
                </div>
                <div
                  className={`border pt-1.5 pb-1.5 pl-3 pr-3 text-white bg-switchBlueColor text-sm  rounded-lg  font-medium cursor-pointer`}
                  
                >
                  Evaluate
                </div>
              </div>
              <div
                
                className="text-xs text-placeholderGray font-normal" 
              >
                Click{" "}
                <a href="/" className="text-lightBlue" >
                  here
                </a>{" "}
                for list of Stock Bundles - combine multiple to create new Stock
                Filter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewStrategy;
