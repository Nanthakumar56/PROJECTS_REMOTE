import React, { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";
import ErrorPopup from "./ErrorPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import { FaRegCalendar, FaUser, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import SuccessPopup from "./SuccessPopup";
import CalendarPopup from "../CalendarPopup";

const EditTask = ({ onClose, taskid }) => {
  const [errors, setErrors] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [milestonesData, setMilestonesData] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRefM = useRef(null);
  const [dropdownOpenM, setDropdownOpenM] = useState(false);
  const [highlightIndexM, setHighlightIndexM] = useState(-1);
  const [formData, setFormData] = useState({
    tskid: "",
    title: "",
    description: "",
    startdate: "",
    duedate: "",
    priority: "",
    milestone: "",
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState(null);
  const [successPopupMsg, setSuccessPopupMsg] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [ErrorPopupTitle, setErrorPopupTitle] = useState(null);
  const [ErrorPopupMsg, setErrorPopupMsg] = useState(null);
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];
  const [isCalendarVisibleS, setIsCalendarVisibleS] = useState(false);
  const [isCalendarVisibleT, setIsCalendarVisibleT] = useState(false);
  const [milestoneOption, setMilestoneOption] = useState([]);
  useEffect(() => {
    const options = milestonesData.map((milestone) => milestone.name);
    setMilestoneOption(options);
  }, [milestonesData]);

  const fetchTaskInformation = async (taskid) => {
    try {
      const response = await fetch(
        `http://localhost:6262/tasks/task?taskId=${taskid}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const tasks = await response.json();
      fetchMilestonesData(tasks.projectId);
      setFormData({
        tskid: tasks.tskid || "",
        title: tasks.title || "",
        description: tasks.description || "",
        startdate: tasks.startDate || "",
        duedate: tasks.dueDate || "",
        priority: tasks.priority || "",
        milestone: tasks.milestone || "",
      });
    } catch (err) {
      console.error("Error fetching task information:", err.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownRefM.current &&
        !dropdownRefM.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setHighlightIndex(-1);
        setDropdownOpenM(false);
        setHighlightIndexM(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event, type) => {
    if (type === "priority" && dropdownOpen) {
      switch (event.key) {
        case "ArrowDown":
          setHighlightIndex((prev) =>
            Math.min(prev + 1, priorityOptions.length - 1)
          );
          break;
        case "ArrowUp":
          setHighlightIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          if (highlightIndex >= 0) {
            setFormData((prev) => ({
              ...prev,
              priority: priorityOptions[highlightIndex],
            }));
            setDropdownOpen(false);
            setHighlightIndex(-1);
            event.preventDefault();
            event.target.blur();
          }
          break;
        case "Escape":
          setDropdownOpen(false);
          break;
        default:
          break;
      }
    }

    if (type === "milestone" && dropdownOpenM) {
      switch (event.key) {
        case "ArrowDown":
          setHighlightIndexM((prev) =>
            Math.min(prev + 1, milestoneOption.length - 1)
          );
          break;
        case "ArrowUp":
          setHighlightIndexM((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          if (highlightIndexM >= 0) {
            setFormData((prev) => ({
              ...prev,
              milestone: milestoneOption[highlightIndexM],
            }));
            setDropdownOpenM(false);
            setHighlightIndexM(-1);
            event.preventDefault();
            event.target.blur();
          }
          break;
        case "Escape":
          setDropdownOpenM(false);
          break;
        default:
          break;
      }
    }
  };

  const fetchMilestonesData = async (projectid) => {
    try {
      const response = await fetch(
        `http://localhost:5858/milestones/getMilestones?projectid=${projectid}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const milestones = await response.json();

      setMilestonesData(milestones);
    } catch (err) {
      console.error("Error fetching Milestone data:", err.message);
    }
  };

  useEffect(() => {
    fetchTaskInformation(taskid);
  }, [taskid]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const toggleCalendarVisibilityS = (e) => {
    e.preventDefault();
    setIsCalendarVisibleS((prev) => !prev);
  };

  const toggleCalendarVisibilityT = (e) => {
    e.preventDefault();
    setIsCalendarVisibleT((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatToLocalDateTime = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateString);
      return null;
    }

    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().split(".")[0];
  };

  const validateForm = (formData) => {
    const requiredFields = [
      "tskid",
      "title",
      "description",
      "startdate",
      "duedate",
    ];
    let errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = `${field} is required`;
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked!");

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      setErrors(errors);
      return;
    }

    const updatedData = {
      ...formData,
      startdate: formatToLocalDateTime(formData.startdate),
      duedate: formatToLocalDateTime(formData.duedate),
    };

    try {
      console.log("Sending API request:", updatedData);

      const response = await fetch(
        `http://localhost:6262/tasks/updateTaskInfo?taskid=${taskid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const responseText = await response.text();
      console.log("API Response:", responseText);

      if (response.ok) {
        setSuccessPopupTitle("Update Task");
        setSuccessPopupMsg("The task has been successfully updated!");
        setShowSuccessPopup(true);
      } else {
        setErrorPopupTitle("Update Task");
        setErrorPopupMsg(responseText);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorPopupTitle("Update Task");
      setErrorPopupMsg("An error occurred while updating the task.");
      setShowErrorPopup(true);
    }
  };

  return (
    <div
      id="userFormModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 select-none"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg px-3 lg:!px-4 xl:!px-6 py-3 lg:!py-4 xl:!py-5 w-[60vw] relative"
      >
        <div className="flex justify-between">
          <p className="text-xs lg:text-sm font-semibold">Update Task</p>
          <button
            onClick={onClose}
            className="text-base lg:!text-lg xl:!text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        <div className="h-[360px] lg:h-[400px] xl:h-[440px] overflow-auto mb-8 px-2">
          <div className="flex justify-between items-start py-2 gap-x-4 lg:!gap-x-6">
            <div className="w-[40%]">
              <div className="flex justify-between items-end">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Task Id <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.tskid ? "" : "hidden"
                  }`}
                >
                  This field is required
                </p>
              </div>
              <input
                type="text"
                name="tskid"
                value={formData.tskid || ""}
                onChange={handleChange}
                className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                  errors && errors.tskid ? "border-red-500" : ""
                }`}
                required
              />
            </div>
            <div className="w-[60%]">
              <div className="flex justify-between items-end">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.title ? "" : "hidden"
                  }`}
                >
                  This field is required
                </p>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                placeholder="Maximum 70 characters"
                className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                  errors && errors.title ? "border-red-500" : ""
                }`}
                required
                maxLength={70}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-end">
              <label
                className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
              >
                Description <span className="text-red-500">*</span>
              </label>
              <p
                className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                  errors && errors.description ? "" : "hidden"
                }`}
              >
                This field is required
              </p>
            </div>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Max 150 characters"
              className={`mt-1 my-2 block w-full border border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                errors && errors.description ? "border-red-500" : ""
              }`}
              rows="4"
              maxLength={150}
            ></textarea>
          </div>
          <div className="flex justify-between items-start py-2 gap-x-4 lg:!gap-x-6">
            <div className="w-1/3">
              <div
                className="w-full relative"
                ref={dropdownRef}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "priority")}
              >
                <label className="block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 rounded-md shadow-sm focus-within:border-[#18636F]">
                  <button
                    type="button"
                    className="w-full h-full px-3 py-1 text-left text-[8px] lg:!text-[10px] xl:!text-xs focus:outline-none flex items-center justify-between"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <p className="w-[95%]"> {formData.priority || ""}</p>
                    <p>
                      <IoChevronDown
                        className={`transition-transform duration-300 ${
                          dropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </p>
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md">
                      {priorityOptions.map((priority, index) => (
                        <li
                          key={priority}
                          className={`px-3 py-2 text-[8px] lg:!text-[10px] xl:!text-xs cursor-pointer hover:bg-[#18636F] rounded-md hover:text-white ${
                            highlightIndex === index
                              ? "bg-[#18636F] text-white"
                              : ""
                          }`}
                          onMouseEnter={() => setHighlightIndex(index)}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, priority }));
                            setDropdownOpen(false);
                          }}
                        >
                          {priority}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="w-2/3">
              <div
                className="w-full relative"
                ref={dropdownRefM}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, "milestone")}
              >
                <label className="block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700">
                  Milestone
                </label>
                <div className="mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 rounded-md shadow-sm focus-within:border-[#18636F]">
                  <button
                    type="button"
                    className="w-full h-full px-3 py-1 text-left text-[8px] lg:!text-[10px] xl:!text-xs focus:outline-none flex items-center justify-between"
                    onClick={() => setDropdownOpenM(!dropdownOpenM)}
                  >
                    <p className="w-[95%]">
                      {formData.milestone || "Select Milestone"}
                    </p>
                    <p>
                      <IoChevronDown
                        className={`transition-transform duration-300 ${
                          dropdownOpenM ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </p>
                  </button>
                  {dropdownOpenM && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md">
                      {milestoneOption.map((milestone, index) => (
                        <li
                          key={milestone}
                          className={`px-3 py-2 text-[8px] lg:!text-[10px] xl:!text-xs cursor-pointer hover:bg-[#18636F] rounded-md hover:text-white ${
                            highlightIndexM === index
                              ? "bg-[#18636F] text-white"
                              : ""
                          }`}
                          onMouseEnter={() => setHighlightIndexM(index)}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, milestone }));
                            setDropdownOpenM(false);
                          }}
                        >
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-1.5 lg:mb-2 xl:mb-3">
            <div className="relative w-[calc(50%-0.5rem)]">
              <div className="flex justify-between items-end">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.startdate ? "" : "hidden"
                  }`}
                >
                  This field is required
                </p>
              </div>

              <div className="flex items-center relative">
                <input
                  type="text"
                  name="startdate"
                  value={formatDate(formData.startdate)}
                  onChange={handleInputChange}
                  placeholder="01 Jan 2025"
                  className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border  border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                    errors && errors.startdate ? "border-red-500" : ""
                  }`}
                />
                <button
                  onClick={toggleCalendarVisibilityS}
                  className="absolute top-[27%] lg:top-[29%] right-2 lg:!right-3 cursor-pointer"
                >
                  <FaRegCalendar className="text-[8px] lg:!text-xs text-[#18636F]" />
                </button>
              </div>
              {isCalendarVisibleS && (
                <CalendarPopup
                  style={{ top: "-405%", left: "12%" }}
                  selectedDate={formatDate(formData.startdate)}
                  onSelectDate={(date) => {
                    handleInputChange({
                      target: { name: "startdate", value: date },
                    });
                    setIsCalendarVisibleS(false);
                  }}
                  onClose={() => setIsCalendarVisibleS(false)}
                />
              )}
            </div>
            <div className="relative w-[calc(50%-0.5rem)]">
              <div className="flex justify-between items-end">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Due Date <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.duedate ? "" : "hidden"
                  }`}
                >
                  This field is required
                </p>
              </div>

              <div className="flex items-center relative">
                <input
                  type="text"
                  name="duedate"
                  value={formatDate(formData.duedate)}
                  onChange={handleInputChange}
                  placeholder="01 Apr 2025"
                  className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border  border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                    errors && errors.duedate ? "border-red-500" : ""
                  }`}
                />
                <button
                  onClick={toggleCalendarVisibilityT}
                  className="absolute top-[27%] lg:top-[29%] right-2 lg:!right-3 cursor-pointer"
                >
                  <FaRegCalendar className="text-[8px] lg:!text-xs text-[#18636F]" />
                </button>
              </div>
              {isCalendarVisibleT && (
                <CalendarPopup
                  style={{ top: "-405%", right: "0%" }}
                  selectedDate={formatDate(formData.duedate)}
                  onSelectDate={(date) => {
                    handleInputChange({
                      target: { name: "duedate", value: date },
                    });
                    setIsCalendarVisibleT(false);
                  }}
                  onClose={() => setIsCalendarVisibleT(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 lg:!bottom-5 w-full right-0 px-5 lg:!px-6 xl:!px-8">
          <div className={`flex justify-end`}>
            <button
              onClick={(e) => handleSubmit(e)}
              className="bg-[#18636F] text-white py-1 px-4 lg:!py-1.5 lg:!px-5 text-[8px] lg:!text-[10px] xl:!text-xs rounded-md shadow-sm "
            >
              Update
            </button>
          </div>
        </div>
      </form>
      {showSuccessPopup && (
        <SuccessPopup
          title={successPopupTitle}
          message={successPopupMsg}
          onclose={() => {
            setShowSuccessPopup(false);
            onClose();
          }}
        />
      )}
      {showErrorPopup && (
        <ErrorPopup
          title={ErrorPopupTitle}
          message={ErrorPopupMsg}
          onclose={() => {
            setShowErrorPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default EditTask;
