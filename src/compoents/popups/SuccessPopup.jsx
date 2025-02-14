import React, { useState, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";

const SuccessPopup = ({ title, message, onclose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id === "overlay") {
        onclose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      id="overlay"
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => onclick()}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg md:w-72 lg:w-80 xl:w-96 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AiFillCheckCircle className="text-4xl lg:text-5xl xl:text-6xl mx-auto text-green-600 mb-1.5 lg:mb-2 xl:my-4" />
        <h2 className="text-xs lg:text-sm font-semibold">{title}</h2>
        <p className="text-[10px] lg:text-xs mt-2 text-gray-600">{message}</p>
        <button
          onClick={() => onclose()}
          className="mt-4 text-[10px] lg:text-xs px-3 lg:px-4 py-1 lg:py-1.5 bg-[#18636F] text-white rounded-lg focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
