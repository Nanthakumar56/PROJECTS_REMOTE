import React, { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";
import ErrorPopup from "./ErrorPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import { FaRegCalendar, FaUser, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import SuccessPopup from "./SuccessPopup";
import CalendarPopup from "../CalendarPopup";

const NewTask = ({ onClose, projectid, status }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRefS = useRef(null);
  const [projectData, setProjectData] = useState({});
  const [milestonesData, setMilestonesData] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropdownOpenS, setDropdownOpenS] = useState(false);
  const [highlightIndexS, setHighlightIndexS] = useState(-1);
  const [dropdownOpenM, setDropdownOpenM] = useState(false);
  const [highlightIndexM, setHighlightIndexM] = useState(-1);
  const dropdownRefM = useRef(null);
  const dropdownRefB = useRef(null);
  const [dropdownOpenB, setDropdownOpenB] = useState(false);
  const [highlightIndexB, setHighlightIndexB] = useState(-1);
  const fileInputRef = useRef();
  const [searchResults, setSearchResults] = useState([]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteText, setInviteText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [userIds, setUserIds] = useState(null);
  const [addedUserIds, setAddedUserIds] = useState([]);
  const [formData, setFormData] = useState({
    tskid: "",
    title: "",
    description: "",
    projectid: "",
    approver: "",
    startdate: "",
    duedate: "",
    priority: "Medium",
    status: status,
    reason: "",
    milestone: "",
    blockingtask: "",
    usersAssigned: [],
  });
  const [tasksData, setTasksData] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState(null);
  const [successPopupMsg, setSuccessPopupMsg] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [ErrorPopupTitle, setErrorPopupTitle] = useState(null);
  const [ErrorPopupMsg, setErrorPopupMsg] = useState(null);
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];
  const statusOptions = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
    "On Hold",
    "Overdue",
  ];
  const [isCalendarVisibleS, setIsCalendarVisibleS] = useState(false);
  const [isCalendarVisibleT, setIsCalendarVisibleT] = useState(false);
  const [milestoneOption, setMilestoneOption] = useState([]);

  useEffect(() => {
    const options = milestonesData.map((milestone) => milestone.name);
    setMilestoneOption(options);
  }, [milestonesData]);

  const [taskOption, setTaskOption] = useState([]);

  useEffect(() => {
    const options = tasksData.map((tasks) => tasks.tskid);
    setTaskOption(options);
  }, [tasksData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefS.current &&
        !dropdownRefS.current.contains(event.target)
      ) {
        setDropdownOpenS(false);
        setHighlightIndexS(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefM.current &&
        !dropdownRefM.current.contains(event.target)
      ) {
        setDropdownOpenM(false);
        setHighlightIndexM(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefB.current &&
        !dropdownRefB.current.contains(event.target)
      ) {
        setDropdownOpenB(false);
        setHighlightIndexB(-1);
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

    if (type === "status" && dropdownOpenS) {
      switch (event.key) {
        case "ArrowDown":
          setHighlightIndexS((prev) =>
            Math.min(prev + 1, statusOptions.length - 1)
          );
          break;
        case "ArrowUp":
          setHighlightIndexS((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          if (highlightIndexS >= 0) {
            setFormData((prev) => ({
              ...prev,
              status: statusOptions[highlightIndexS],
            }));
            setDropdownOpenS(false);
            setHighlightIndexS(-1);
            event.preventDefault();
            event.target.blur();
          }
          break;
        case "Escape":
          setDropdownOpenS(false);
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
    if (type === "blockingtask" && dropdownOpenB) {
      switch (event.key) {
        case "ArrowDown":
          setHighlightIndexB((prev) =>
            Math.min(prev + 1, taskOption.length - 1)
          );
          break;
        case "ArrowUp":
          setHighlightIndexB((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          if (highlightIndexB >= 0) {
            setFormData((prev) => ({
              ...prev,
              blockingtask: taskOption[highlightIndexB],
            }));
            setDropdownOpenB(false);
            setHighlightIndexB(-1);
            event.preventDefault();
            event.target.blur();
          }
          break;
        case "Escape":
          setDropdownOpenB(false);
          break;
        default:
          break;
      }
    }
  };

  const fetchProjectData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5858/projects/project?projectId=${projectid}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setProjectData(data);
      setFormData((prevFormData) => ({
        ...prevFormData,
        projectid: data.projectid,
        approver: data.task_approver,
      }));
    } catch (err) {
      console.error("Error fetching Project data:", err.message);
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

  const fetchTasks = async (projectid) => {
    try {
      const response = await fetch(
        `http://localhost:6262/tasks/getTasksByProject?projectId=${projectid}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasksData(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTaskAssignees = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6262/tasks/getTaskAssignees?projectid=${projectid}&userids=${addedUserIds}`
      );
      if (response.data.length > 0) {
        const fetchedUserIds = response.data.join(",");
        setUserIds(fetchedUserIds);
      } else {
        setUserIds("");
      }
    } catch (error) {
      console.error("Error fetching task assignees:", error);
    }
  };

  const handleSearch = async (searchTerm) => {
    setInviteText(searchTerm);

    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5656/users/getTaskUsers?searchTerm=${searchTerm}&userIds=${userIds}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleUserKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(searchResults[selectedIndex]);
    }
  };

  const handleSelect = async (user) => {
    setFormData((prev) => ({
      ...prev,
      usersAssigned: [...(prev.usersAssigned || []), user],
    }));

    setAddedUserIds((prev) => [...prev, user.userid]);

    setInviteText("");
    setSearchResults([]);
  };

  const handleRemove = async (userid) => {
    setFormData((prev) => ({
      ...prev,
      usersAssigned: prev.usersAssigned.filter(
        (user) => user.userid !== userid
      ),
    }));

    setAddedUserIds((prevUserIds) => prevUserIds.filter((id) => id !== userid));
  };

  useEffect(() => {
    fetchProjectData();
    fetchMilestonesData(projectid);
    fetchTasks(projectid);
    fetchTaskAssignees();
  }, [projectid]);

  useEffect(() => {
    fetchTaskAssignees();
  }, [addedUserIds]);

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

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
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

  const handleBack = () => setStep((prev) => prev - 1);
  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
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
      "projectid",
    ];
    let errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = `${field} is required`;
      }
    });

    if (!formData.usersAssigned || formData.usersAssigned.length === 0) {
      errors.usersAssigned = "At least one user must be assigned";
    }

    if (
      formData.status === "On Hold" &&
      (!formData.reason || formData.reason.trim() === "")
    ) {
      errors.reason = "Reason is required when status is On Hold";
    }
    setErrors(errors);
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const submittedData = {
      ...formData,
      usersAssigned: addedUserIds,
      startdate: formatToLocalDateTime(formData.startdate),
      duedate: formatToLocalDateTime(formData.duedate),
    };

    console.log("Formatted Form Data to Submit:", submittedData);

    try {
      const response = await fetch("http://localhost:6262/tasks/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submittedData),
      });

      const responseText = await response.text();
      console.log("API Response:", responseText);

      if (response.ok) {
        setSuccessPopupTitle("New Task");
        setSuccessPopupMsg("Task created succesfully for this project");
        setShowSuccessPopup(true);
      } else {
        setErrorPopupTitle("NEw Task");
        setErrorPopupMsg(responseText);
        setShowErrorPopup(true);
      }
    } catch (error) {
      setErrorPopupTitle("NEw Task");
      setErrorPopupMsg("An error occurred while submitting the form.");
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
          <p className="text-xs lg:text-sm font-semibold">Create New Task</p>
          <button
            onClick={onClose}
            className="text-base lg:!text-lg xl:!text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        {step === 1 && (
          <div className="h-[320px] lg:h-[440px] xl:h-[480px] overflow-auto mb-8 px-2">
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
                  placeholder="Maximun 70 characters"
                  maxLength={70}
                  className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                    errors && errors.title ? "border-red-500" : ""
                  }`}
                  required
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
              <div className="w-1/2">
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

              <div className="w-1/2">
                <div
                  className="w-full relative"
                  ref={dropdownRefS}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, "status")}
                >
                  <label className="block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 rounded-md shadow-sm focus-within:border-[#18636F]">
                    <button
                      type="button"
                      className="w-full h-full px-3 py-1 text-left text-[8px] lg:!text-[10px] xl:!text-xs focus:outline-none flex items-center justify-between"
                      onClick={() => setDropdownOpenS(!dropdownOpenS)}
                    >
                      <p className="w-[95%]">{formData.status || ""}</p>
                      <p>
                        <IoChevronDown
                          className={`transition-transform duration-300 ${
                            dropdownOpenS ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </p>
                    </button>
                    {dropdownOpenS && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md">
                        {statusOptions.map((status, index) => (
                          <li
                            key={status}
                            className={`px-3 py-2 text-[8px] lg:!text-[10px] xl:!text-xs cursor-pointer hover:bg-[#18636F] rounded-md hover:text-white ${
                              highlightIndexS === index
                                ? "bg-[#18636F] text-white"
                                : ""
                            }`}
                            onMouseEnter={() => setHighlightIndexS(index)}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, status }));
                              setDropdownOpenS(false);
                            }}
                          >
                            {status}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {formData.status === "On Hold" && (
              <div className="w-full">
                <div className="flex justify-between items-end">
                  <label
                    className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                  >
                    Holding Reason <span className="text-red-500">*</span>
                  </label>
                  <p
                    className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                      errors && errors.reason ? "" : "hidden"
                    }`}
                  >
                    This field is required
                  </p>
                </div>
                <textarea
                  name="reason"
                  value={formData.reason || ""}
                  onChange={handleChange}
                  className={`mt-1 my-2 block w-full border border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                    errors && errors.reason ? "border-red-500" : ""
                  }`}
                  rows="2"
                  maxLength={100}
                ></textarea>
              </div>
            )}
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
                    value={formData.startdate}
                    onChange={handleInputChange}
                    placeholder="01 Jan 2025"
                    className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border text-gray-500 border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
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
                    selectedDate={formData.startdate}
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
                    value={formData.duedate}
                    onChange={handleInputChange}
                    placeholder="01 Apr 2025"
                    className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border text-gray-500 border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
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
                    selectedDate={formData.duedate}
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
            <div className="flex justify-between items-start py-2 gap-x-4 lg:!gap-x-6">
              <div className="w-1/2">
                <div className="flex justify-between items-end">
                  <label
                    className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                  >
                    Project Id <span className="text-red-500">*</span>
                  </label>
                  <p
                    className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                      errors && errors.projectid ? "" : "hidden"
                    }`}
                  >
                    This field is required
                  </p>
                </div>
                <input
                  type="text"
                  name="pjtmain_id"
                  value={projectData.pjtmain_id || ""}
                  onChange={handleChange}
                  className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border text-gray-500 border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                    errors && errors.projectid ? "border-red-500" : ""
                  }`}
                  required
                  disabled
                />
              </div>
              <div className="w-1/2">
                <div className="flex justify-between items-end">
                  <label
                    className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                  >
                    Task Supervisor
                  </label>
                </div>
                <input
                  type="text"
                  name="approver"
                  value={projectData.approver_name || ""}
                  onChange={handleChange}
                  className="mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border text-gray-500 border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs"
                  required
                  disabled
                />
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="h-[320px] lg:h-[440px] overflow-auto mb-8 px-2 mt-4">
            <div className="flex items-center gap-x-4">
              <div className="w-[60%]">
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
              <div className="w-[40%]">
                <div
                  className="w-full relative"
                  ref={dropdownRefB}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, "blockingtask")}
                >
                  <label className="block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700">
                    Blocking Task
                  </label>
                  <div className="mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 rounded-md shadow-sm focus-within:border-[#18636F]">
                    <button
                      type="button"
                      className="w-full h-full px-3 py-1 text-left text-[8px] lg:!text-[10px] xl:!text-xs focus:outline-none flex items-center justify-between"
                      onClick={() => setDropdownOpenB(!dropdownOpenB)}
                    >
                      <p className="w-[95%]">
                        {formData.blockingtask || "Select task"}
                      </p>
                      <p>
                        <IoChevronDown
                          className={`transition-transform duration-300 ${
                            dropdownOpenB ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </p>
                    </button>
                    {dropdownOpenB && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md">
                        {tasksData.map((blockingtask, index) => (
                          <li
                            key={index}
                            className={`px-3 py-2 text-[8px] lg:!text-[10px] xl:!text-xs cursor-pointer hover:bg-[#18636F] rounded-md hover:text-white ${
                              highlightIndexB === index
                                ? "bg-[#18636F] text-white"
                                : ""
                            }`}
                            onMouseEnter={() => setHighlightIndexB(index)}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                blockingtask: blockingtask.tskid,
                              }));
                              setDropdownOpenB(false);
                            }}
                          >
                            {blockingtask.tskid}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-4">
              <div className="flex items-center gap-x-6">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Task Assignees <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.usersAssigned ? "" : "hidden"
                  }`}
                >
                  At least one user should be assigned
                </p>
              </div>
              <div>
                <div className="flex flex-wrap items-start gap-2">
                  {(formData?.usersAssigned || []).map((user) => (
                    <div
                      key={user.userid}
                      className="flex items-center space-x-1 py-0.5 lg:py-1 px-1.5 lg:px-2 rounded-md bg-gray-200 mt-2"
                    >
                      {user.file ? (
                        <img
                          src={`data:image/jpeg;base64,${user.file}`}
                          alt={user.name || "User"}
                          className="w-3 lg:w-4 h-3 lg:h-4 border border-white rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-3 lg:w-4 h-3 lg:h-4 border border-white rounded-full text-gray-400" />
                      )}
                      <p className="text-[10px] lg:text-xs font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(user.userid);
                        }}
                      >
                        <IoClose className="text-md font-medium cursor-pointer" />
                      </button>
                    </div>
                  ))}
                </div>

                {isInviting ? (
                  <div
                    className="relative flex items-center mt-2 transition-all duration-300"
                    ref={dropdownRef}
                  >
                    <input
                      type="text"
                      value={inviteText}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={handleUserKeyDown}
                      placeholder="Search user..."
                      className="h-7 w-48 lg:w-52 xl:w-60 py-[1px] lg:py-1 px-2 lg:px-3 rounded-l-md border border-gray-400 text-[10px] lg:text-xs focus:outline-[#18636f]"
                    />
                    <button
                      onClick={() => setIsInviting(false)}
                      className="h-7 w-7 flex justify-center items-center hover:text-yellow-100 bg-[#18636f] text-white rounded-r-md"
                    >
                      <IoClose className="text-md cursor-pointer" />
                    </button>

                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 w-48 lg:w-52 xl:w-60 bg-white border border-gray-300 rounded-md mt-1 shadow-md z-10">
                        {searchResults.map((user, index) => (
                          <div
                            key={user.userid}
                            onClick={() => handleSelect(user)}
                            className={`flex items-center gap-2 p-2 cursor-pointer ${
                              index === selectedIndex
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {user.file ? (
                              <img
                                src={`data:image/jpeg;base64,${user.file}`}
                                alt={user.first_name || "User"}
                                className="w-3 lg:w-4 h-3 lg:h-4 border border-white rounded-full object-cover"
                              />
                            ) : (
                              <FaUserCircle className="w-3 lg:w-4 h-3 lg:h-4 border border-white rounded-full text-gray-400" />
                            )}
                            <p className="text-xs font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsInviting(true)}
                    className="py-[1px] lg:py-[3px] px-2 mt-2 lg:px-3 rounded-md border border-[#18636f] text-[10px] lg:text-xs text-[#18636f] transition-all duration-300 hover:bg-[#18636f] hover:text-white"
                  >
                    + Invite
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 lg:!bottom-5 w-full right-0 px-5 lg:!px-6 xl:!px-8">
          <div
            className={`flex ${step === 1 ? "justify-end" : "justify-between"}`}
          >
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-200 text-gray-700 py-1 px-4 lg:!py-1.5 lg:!px-5 text-[8px] lg:!text-[10px] xl:!text-xs rounded-md shadow-sm "
              >
                Back
              </button>
            )}
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#18636F] text-white py-1 px-4 lg:!py-1.5 lg:!px-5 text-[8px] lg:!text-[10px] xl:!text-xs rounded-md shadow-sm "
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#18636F] text-white py-1 px-4 lg:!py-1.5 lg:!px-5 text-[8px] lg:!text-[10px] xl:!text-xs rounded-md shadow-sm "
              >
                Submit
              </button>
            )}
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

export default NewTask;
