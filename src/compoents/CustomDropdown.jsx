import React, { useEffect, useRef, useState } from "react";

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex < options.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : options.length - 1
        );
        break;
      case "Enter":
        event.preventDefault();
        if (focusedIndex !== -1) {
          handleOptionSelect(options[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, focusedIndex]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="px-3 py-1 text-left border border-gray-300 rounded-md bg-white text-[8px] lg:!text-[10px] xl:!text-xs"
      >
        {`${placeholder}: ${value || "All"}`}
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg w-28 lg:!w-36 xl:!w-40">
          {options.map((option, index) => (
            <div
              key={option}
              className={`px-4 py-2 cursor-pointer text-[8px] lg:!text-[10px] xl:!text-xs ${
                focusedIndex === index ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
