import React, { useState } from "react";
import { Icons } from "../../constants/AppResource";

const DropdownCounter = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = "",
  placeholder = "Enter a value",
}) => {
  const [value, setValue] = useState(initialValue);

  const increment = () => {
    const numericValue = parseInt(value || 0, 10);
    if (numericValue + step <= max) {
      setValue(numericValue + step);
    }
  };

  const decrement = () => {
    const numericValue = parseInt(value || 0, 10);
    if (numericValue - step >= min) {
      setValue(numericValue - step);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setValue("");
    } else {
      const newValue = parseInt(inputValue, 10);
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setValue(newValue);
      }
    }
  };

  return (
    <div className="flex items-center border relative border-switchGrayColor outline-none rounded-lg w-full max-w-md  bg-white"  >
      {/* Dollar Icon */}
      <div className="flex items-center px-4 py-2">
        <img
          src={Icons.DollarIcon}
          alt="Dollar Icon"
          className="h-[20px] w-[20px]"
        />
      </div>

      {/* Value Input */}
      <input
        type="text"
        className="w-full text-start border-none outline-none text-gray-600 placeholder-gray-400 "
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
      />

      {/* Decrement Icon */}
      <button
        className="flex items-center absolute right-[2.5rem]  h-[100%] justify-center w-10 border-l border-gray-300 text-gray-600 hover:text-gray-800"
        onClick={decrement}
      >
        <img
          src={Icons.MinusIcon}
          alt="Minus Icon"
          
          className="h-[15px] w-[15px]"
        />
      </button>

      {/* Increment Icon */}
      <button
        className="flex items-center absolute right-0 h-[100%]   justify-center w-10 border-l border-gray-300 text-gray-600 hover:text-gray-800"
        onClick={increment}
      >
        <img
          src={Icons.PlusIcon}
          alt="Plus Icon"
          className="h-[15px] w-[15px]"

        />
      </button>
    </div>
  );
};

export default DropdownCounter;
