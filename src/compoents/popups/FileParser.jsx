import React, { useState, useEffect } from "react";
import { CiImport } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import {
  BsFileEarmarkPdfFill,
  BsFileEarmarkImageFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkXFill,
  BsFileEarmarkFill,
  BsFileEarmarkPptFill,
  BsFileEarmarkTextFill,
} from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";

const FileParser = ({ closeModal }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (filetype) => {
    const filetypeLower = filetype.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "tiff"].includes(filetypeLower)) {
      return <BsFileEarmarkImageFill className="text-yellow-600" />;
    }
    if (["doc", "docx"].includes(filetypeLower)) {
      return <BsFileEarmarkWordFill className="text-blue-600" />;
    }
    if (["xls", "xlsx", "csv"].includes(filetypeLower)) {
      return <BsFileEarmarkXFill className="text-green-600" />;
    }
    if (["pdf"].includes(filetypeLower)) {
      return <BsFileEarmarkPdfFill className="text-red-600" />;
    }
    if (["ppt", "pptx"].includes(filetypeLower)) {
      return <BsFileEarmarkPptFill className="text-orange-600" />;
    }
    if (["txt"].includes(filetypeLower)) {
      return <BsFileEarmarkTextFill className="text-[#b413ffaa]" />;
    }
    return <BsFileEarmarkFill className="text-gray-600" />;
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    const newFiles = files
      .map((file) => ({
        name: file.name,
        type: file.name.split(".").pop().toLowerCase(),
        size: file.size,
      }))
      .filter(
        (newFile) =>
          !selectedFiles.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size
          )
      );

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    event.target.value = null;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    const newFiles = files.map((file) => ({
      name: file.name,
      type: file.name.split(".").pop().toLowerCase(),
      size: file.size,
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "fileParserModal") {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeModal]);

  return (
    <div
      id="fileParserModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-lg p-2 w-72 lg:w-80 xl:!w-96">
        <div className="flex justify-end pb-2">
          <button
            onClick={closeModal}
            className="text-sm lg:!text-base xl:!text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        <div className="mx-4 mb-4">
          <div
            className={`border-2 border-dashed bg-[#FCFCFC] text-[10px] cursor-pointer lg:!text-xs text-center rounded lg:!rounded-lg ${
              isDragOver ? "border-blue-500" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <div className="flex justify-center p-4">
              <CiImport className="text-xl lg:!text-2xl xl:!text-3xl font-thin text-[#4361e9]" />
              <input
                type="file"
                id="fileInput"
                accept=".csv, .xlsx, .xls, .doc, .docx, .pdf, .ppt, .pptx, .jpg, .jpeg, .png, .txt"
                onChange={handleFileChange}
                multiple
                style={{ display: "none" }}
              />
            </div>

            <h2 className="px-3 py-1 lg:!px-4 lg:!py-3 xl:!px-5 text-[10px] lg:!text-xs text-gray-500">
              Select your file(s) here. The accepted formats are text, doc, ppt,
              excel, images, pdf, and csv.
            </h2>
          </div>
          {selectedFiles.length > 0 && (
            <div className="my-4 max-h-52 overflow-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-x-2 mb-2"
                >
                  <div className="flex items-center gap-x-2 mb-2">
                    <div className="h-8 w-8 flex justify-center items-center bg-gray-100 rounded-full">
                      <span className="text-xl">{getFileIcon(file.type)}</span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xs lg:!text-[13px]">
                        {file.name.length > 35
                          ? `${file.name.slice(0, 32)}...`
                          : file.name}
                      </h3>
                      <div className="text-[8px] lg:!text-[10px] text-gray-400 flex items-center gap-x-2">
                        <p>{file.type}</p>
                        <p>{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  </div>
                  <IoIosCloseCircle
                    className="text-lg lg:!text-xl text-red-600 cursor-pointer mr-4"
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              ))}
            </div>
          )}
          <div
            className={`text-xs flex mt-6 ${
              selectedFiles.length > 0 ? "justify-between" : "justify-end"
            }`}
          >
            {selectedFiles.length > 0 && (
              <p className="text-[10px] lg:text-xs text-gray-500">
                Files selected: <span>{selectedFiles.length}</span>
              </p>
            )}
            <button className="py-1 px-3 bg-[#18636f] text-white rounded-md">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileParser;
