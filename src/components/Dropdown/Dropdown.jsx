import React, { useState, useRef, useEffect } from "react";
import { Color, Icons } from "../../constants/AppResource";

const Dropdown = ({ options, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
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
    <div className="relative w-full max-w-md ">
      {/* Dropdown Input */}
      <div
        ref={dropdownRef}
        className="flex justify-between border-switchGrayColor outline-none text-sm   items-center px-4 py-2 border rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none"
        onClick={toggleDropdown}
        
      >
        <span className="text-placeholderGray" >
          {selectedOption || placeholder}
        </span>
        <img
          src={Icons.ArrowInputIcon}
          alt="Dollar Icon"
          className="h-[10px] w-[10px]"
        />
      </div>

      {/* Dropdown Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute left-0 mt-2 w-full bg-white  border-[0.5px] border-gray-300 rounded-md shadow-lg z-10"
        >
          {options && options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer  border-[0.5px] text-sm border-switchGrayColor text-textColor "
                onClick={() => handleOptionSelect(option)}
                
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
