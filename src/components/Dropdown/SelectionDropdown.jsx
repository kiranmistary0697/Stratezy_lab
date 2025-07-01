import React, { useState, useRef, useEffect } from "react";
import { Color, Icons } from "../../constants/AppResource";

const SelectionDropdown = ({
  options,
  placeholder = "Select options",
  defaultSelected = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(defaultSelected);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option) // Deselect option if already selected
        : [...prev, option] // Add option if not selected
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md ">
      {/* Dropdown Input */}
      <div
        ref={dropdownRef}
        className="flex justify-between items-center px-4 py-2 border border-switchGrayColor outline-none rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none"
        onClick={toggleDropdown}
        
      >
        <span className="text-placeholderGray border-switchGrayColor text-sm"     >
          {selectedOptions.length > 0
            ? selectedOptions.join(", ")
            : placeholder}
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
          className="absolute left-0 mt-2 w-full bg-white border border-gray-300 overflow-hidden rounded-md shadow-lg z-10"
        >
          {/* Search Input */}
          <div className="px-4 py-2 flex items-center bg-fadeGray ">
            <img
                src={Icons.SearchIcon}
                className="h-[15px] w-[15px]"

            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 rounded-md focus:outline-none bg-fadeGray text-textColor border-switchBlueColor text-sm"
            />
          </div>

          {/* Options List */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 border border-switchGrayColor cursor-pointer"
                onClick={() => handleOptionSelect(option)}

              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionSelect(option)}
                  className="mr-3"
                  
                />
                <span  className="text-textColor border-switchGrayColor text-sm"    >{option}</span>
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

export default SelectionDropdown;
