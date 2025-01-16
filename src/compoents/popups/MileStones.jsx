import React from "react";
import { IoClose } from "react-icons/io5";

const MileStones = ({ onClose, projectid }) => {
  return (
    <div>
      <div
        id="fileParserModal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="bg-white rounded-lg p-4 w-72 lg:w-80 xl:!w-96">
          <div className="flex justify-between mb-4">
            <p className="text-xs lg:text-sm">Project Milestones</p>
            <button
              onClick={onClose}
              className="text-sm lg:!text-base xl:!text-xl text-gray-500 hover:text-gray-800"
            >
              <IoClose />
            </button>
          </div>

          <div className="mb-2">YO</div>
        </div>
      </div>
    </div>
  );
};

export default MileStones;
