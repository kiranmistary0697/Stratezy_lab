import React, { useState, useRef, useEffect } from "react";
import { Color, Icons } from "../../constants/AppResource";

const InputDropdown = ({ options, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleCustomValueChange = (e) => {
    setCustomValue(e.target.value);
    setSelectedOption(customValue);
  };

  const handleCustomValueSubmit = () => {
    if (customValue.trim() !== "") {
      setSelectedOption(customValue);
      setCustomValue("");
      setIsOpen(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      !dropdownRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md">
      {/* Dropdown Input */}
      <div
        ref={dropdownRef}
        className="flex justify-between border-switchGrayColor outline-none text-sm items-center px-4 py-2 border rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none"
        onClick={toggleDropdown}
      >
        <span className="text-placeholderGray">
          {selectedOption || placeholder}
        </span>
        <img
          src={Icons.ArrowInputIcon}
          alt="Arrow Icon"
          className="h-[10px] w-[10px]"
        />
      </div>

      {/* Dropdown Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute left-0 mt-2 w-full bg-white border-[0.5px] border-gray-300 rounded-md shadow-lg z-10"
        >
          {options && options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-[0.5px] text-sm border-switchGrayColor text-textColor"
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No options available</div>
          )}

          {/* Custom Input Field */}
          <input
            type="text"
            value={customValue}
            onChange={handleCustomValueChange}
            placeholder="Create your own"
            className="w-full px-4 py-2 font-thin rounded-md focus:outline-none text-sm text-lightBlue italic "
          />
        </div>
      )}
    </div>
  );
};

export default InputDropdown;
