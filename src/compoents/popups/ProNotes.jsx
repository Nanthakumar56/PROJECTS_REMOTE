import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";

const ProNotes = ({ onClose, projectid }) => {
  console.log(projectid);

  const [noteTitle, setNoteTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePriorityChange = (value) => {
    setPriority(value);
    setIsDropdownOpen(false);
  };

  return (
    <div
      id="fileParserModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-lg p-4 w-72 lg:w-80 xl:!w-96">
        <div className="flex justify-between mb-2">
          <p className="text-xs lg:text-sm">New Project Note</p>
          <button
            onClick={onClose}
            className="text-sm lg:!text-base xl:!text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        <div className="mb-2">
          <div className="w-full mb-4">
            <label htmlFor="priority" className="text-[10px] lg:text-xs">
              Note
            </label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-full text-[10px] lg:text-xs py-1.5 lg:py-2 px-2 lg:px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#18636f]"
            />
          </div>

          <div className="w-full mb-4">
            <label htmlFor="priority" className="text-[10px] lg:text-xs">
              Priority level
            </label>
            <div
              className="relative"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              ref={dropdownRef}
            >
              <div
                className={`w-full text-[10px] lg:text-xs py-1.5 lg:py-2 px-2 lg:px-3 border rounded-lg flex justify-between items-center cursor-pointer ${
                  isDropdownOpen ? "border-[#18636f]" : "border-gray-300"
                }`}
              >
                <span>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
                <FaAngleDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute bg-white w-full border text-[10px] lg:text-xs border-gray-300 mt-1 rounded-lg shadow-lg">
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-x-2"
                    onClick={() => handlePriorityChange("normal")}
                  >
                    <p
                      className={`text-[6px] lg:!text-[8px] py-1 px-1 rounded-md w-fit text-green-600`}
                    >
                      <FaCircle />
                    </p>
                    Normal
                  </div>
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-x-2"
                    onClick={() => handlePriorityChange("moderate")}
                  >
                    <p
                      className={`text-[6px] lg:!text-[8px] py-1 px-1 rounded-md w-fit text-orange-600`}
                    >
                      <FaCircle />
                    </p>
                    Moderate
                  </div>
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-x-2"
                    onClick={() => handlePriorityChange("important")}
                  >
                    <p
                      className={`text-[6px] lg:!text-[8px] py-1 px-1 rounded-md w-fit text-red-600`}
                    >
                      <FaCircle />
                    </p>
                    Important
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-[#18636f] text-white text-[10px] lg:text-xs py-1.5 px-4 rounded-lg">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProNotes;
