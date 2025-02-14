import React, { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";
import ErrorPopup from "./ErrorPopup";
import { FaRegCalendar, FaUser, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import SuccessPopup from "./SuccessPopup";
import CalendarPopup from "../CalendarPopup";
import { MdOutlinePersonSearch } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import NewMilestoneProject from "./NewMilestoneProject";

const EditProject = ({ onClose, projectid }) => {
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRefS = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropdownOpenS, setDropdownOpenS] = useState(false);
  const [highlightIndexS, setHighlightIndexS] = useState(-1);
  const [formData, setFormData] = useState({
    pjtmain_id: "",
    title: "",
    description: "",
    project_manager: "",
    task_supervisor: "",
    startdate: "",
    duedate: "",
    priority: "",
    status: "",
    reason: "",
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState(null);
  const [successPopupMsg, setSuccessPopupMsg] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [ErrorPopupTitle, setErrorPopupTitle] = useState(null);
  const [ErrorPopupMsg, setErrorPopupMsg] = useState(null);
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];
  const statusOptions = [
    "Upcoming",
    "In Progress",
    "Completed",
    "On Hold",
    "Overdue",
  ];
  const [isCalendarVisibleS, setIsCalendarVisibleS] = useState(false);
  const [isCalendarVisibleT, setIsCalendarVisibleT] = useState(false);
  const [searchTermManager, setSearchTermManager] = useState("");
  const [searchTermSup, setSearchTermSup] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedManager, setSelectedManager] = useState();
  const [selectedSup, setSelectedSup] = useState();
  const dropdownRefManager = useRef(null);
  const [showDropdownManager, setShowDropdownManager] = useState(false);
  const [selectedManagerIndex, setSelectedManagerIndex] = useState(-1);
  const dropdownRefSup = useRef(null);
  const [showDropdownSup, setShowDropdownSup] = useState(false);
  const [selectedSupIndex, setSelectedSupIndex] = useState(-1);
  const inputRefManager = useRef(null);
  const inputRefSup = useRef(null);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5858/projects/project?projectId=${projectid}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      setFormData({
        pjtmain_id: data.pjtmain_id || "",
        title: data.projectname || "",
        description: data.projectdescription || "",
        startdate: data.start_date ? data.start_date.split("T")[0] : "",
        duedate: data.end_date ? data.end_date.split("T")[0] : "",
        priority: data.priority || "Medium",
        status: data.status || "Upcoming",
        reason: data.reason || "",
      });

      const splitName = (fullName) => {
        if (!fullName) return { first_name: "", last_name: "" };
        const parts = fullName.trim().split(" ");
        return {
          first_name: parts[0] || "",
          last_name: parts.slice(1).join(" ") || "",
        };
      };

      const managerName = splitName(data.project_manager);
      const approverName = splitName(data.approver_name);

      setSelectedManager({
        userid: data.project_manager_id || "",
        first_name: managerName.first_name,
        last_name: managerName.last_name,
      });

      setSelectedSup({
        userid: data.task_approver || "",
        first_name: approverName.first_name,
        last_name: approverName.last_name,
      });
    } catch (err) {
      console.error("Error fetching Project data:", err.message);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectid]);

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
    const fetchUsers = async () => {
      if (searchTermManager.trim() === "") {
        setUsers([]);
        setHasFetched(false);
        return;
      }

      setLoading(true);
      setError("");
      setHasFetched(false);
      try {
        const response = await fetch(
          `http://localhost:5656/users/getProjectUsers?searchTerm=${encodeURIComponent(
            searchTermManager
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else if (response.status === 204) {
          setUsers([]);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (err) {
        setError("No users found.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    const debounceFetch = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceFetch);
  }, [searchTermManager]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTermSup.trim() === "") {
        setUsers([]);
        setHasFetched(false);
        return;
      }

      setLoading(true);
      setError("");
      setHasFetched(false);
      try {
        const response = await fetch(
          `http://localhost:5656/users/getProjectUsers?searchTerm=${encodeURIComponent(
            searchTermSup
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else if (response.status === 204) {
          setUsers([]);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (err) {
        setError("No users found.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    const debounceFetch = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceFetch);
  }, [searchTermSup]);

  const handleSearchManager = (event) => {
    setSearchTermManager(event.target.value);
    setShowDropdownManager(true);
    setSelectedManagerIndex(-1);
    setErrors((prev) => {
      const { project_manager, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefManager.current &&
        !dropdownRefManager.current.contains(event.target) &&
        !inputRefManager.current.contains(event.target)
      ) {
        setShowDropdownManager(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDownManager = (event) => {
    if (!showDropdownManager || users.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedManagerIndex((prev) => Math.min(prev + 1, users.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedManagerIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter" && selectedManagerIndex >= 0) {
      event.preventDefault();
      handleUserSelectManager(users[selectedManagerIndex]);
    }
  };

  const handleUserSelectManager = (user) => {
    setSelectedManager(user);
    setSearchTermManager("");
    setShowDropdownManager(false);
  };

  const handleSearchSup = (event) => {
    setSearchTermManager(event.target.value);
    setShowDropdownSup(true);
    setSelectedSupIndex(-1);
    setErrors((prev) => {
      const { task_supervisor, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefSup.current &&
        !dropdownRefSup.current.contains(event.target)
      ) {
        setShowDropdownSup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDownSup = (event) => {
    if (!showDropdownSup || users.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedSupIndex((prev) => Math.min(prev + 1, users.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedSupIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter" && selectedSupIndex >= 0) {
      event.preventDefault();
      handleUserSelectSup(users[selectedSupIndex]);
    }
  };
  const handleUserSelectSup = (user) => {
    setSelectedSup(user);
    setSearchTermManager("");
    setShowDropdownSup(false);
  };

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
  };

  const toggleCalendarVisibilityS = (e) => {
    e.preventDefault();
    setIsCalendarVisibleS((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      }
      return prevErrors;
    });
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

  const validateForm = (formData) => {
    const requiredFields = [
      "pjtmain_id",
      "title",
      "description",
      "startdate",
      "duedate",
      "project_manager",
      "task_supervisor",
    ];

    let errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = `${field} is required`;
      }
    });

    if (
      formData.status === "On Hold" &&
      (!formData.reason || formData.reason.trim() === "")
    ) {
      errors.reason = "Reason is required when status is On Hold";
    }
    setErrors(errors);
    return errors;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capitalizeWords = (str) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const submittedData = {
      ...formData,
      projectid: projectid,
      title: capitalizeWords(formData.title),
      project_manager: selectedManager?.userid || "",
      task_supervisor: selectedSup?.userid || "",
      startdate: formatToLocalDateTime(formData.startdate),
      duedate: formatToLocalDateTime(formData.duedate),
    };

    console.log(formData);
    console.log(submittedData);

    const errors = validateForm(submittedData);
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5858/projects/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submittedData),
      });

      const responseText = await response.text();

      if (response.ok) {
        setSuccessPopupTitle("Edit Project");
        setSuccessPopupMsg("Project details updated successfully.");
        setShowSuccessPopup(true);
      } else {
        setErrorPopupTitle("Edit Project");
        setErrorPopupMsg(responseText);
        setShowErrorPopup(true);
      }
    } catch (error) {
      setErrorPopupTitle("Edit Project");
      setErrorPopupMsg("An error occurred while updating project information.");
      setShowErrorPopup(true);
    }
  };

  return (
    <div
      id="userFormModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 select-none"
    >
      <form className="bg-white rounded-lg px-3 lg:!px-4 xl:!px-6 py-3 lg:!py-4 xl:!py-5 w-[60vw] relative">
        <div className="flex justify-between">
          <p className="text-xs lg:text-sm font-semibold">Edit Project</p>
          <button
            onClick={onClose}
            className="text-base lg:!text-lg xl:!text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        <div className="h-[320px] lg:h-[440px] xl:h-[480px] overflow-auto mb-8 px-2">
          <div className="flex justify-between items-start py-2 gap-x-4 lg:!gap-x-6">
            <div className="w-[40%]">
              <div className="flex justify-between items-end">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Project Id <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.pjtmain_id ? "" : "hidden"
                  }`}
                >
                  This field is required
                </p>
              </div>
              <input
                type="text"
                name="pjtmain_id"
                value={formData.pjtmain_id || ""}
                onChange={handleChange}
                className={`mt-1 my-2 h-[18px] lg:!h-[26px] xl:!h-[30px] block w-full border border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                  errors && errors.pjtmain_id ? "border-red-500" : ""
                }`}
                required
                disabled
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
              placeholder="Max 500 characters"
              className={`mt-1 my-2 block w-full border border-gray-200 focus:outline-none px-3 py-1 rounded-md shadow-sm focus:border-[#18636F] text-[8px] lg:!text-[10px] xl:!text-xs ${
                errors && errors.description ? "border-red-500" : ""
              }`}
              rows="4"
              maxLength={500}
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
          <div className="flex justify-between items-start py-2 gap-x-4 lg:!gap-x-6">
            <div className="w-1/2">
              <div className="flex justify-between items-end">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Project Manager <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.project_manager ? "" : "hidden"
                  }`}
                >
                  This field is required
                </p>
              </div>
              <div className="w-full">
                <div className="relative w-full">
                  <input
                    ref={inputRefManager}
                    type="text"
                    onKeyDown={handleKeyDownManager}
                    placeholder="Search users..."
                    value={
                      selectedManager
                        ? `${selectedManager.first_name} ${selectedManager.last_name}`
                        : searchTermManager
                    }
                    onChange={handleSearchManager}
                    className={`w-full px-3 h-[18px] lg:!h-[26px] xl:!h-[30px] mt-1 pr-10 border rounded-md text-[10px] lg:text-xs focus:outline-none focus:border-[#18636f] ${
                      errors?.project_manager ? "border-red-500" : ""
                    }`}
                    onFocus={() => setShowDropdownManager(true)}
                  />
                  {selectedManager ? (
                    <IoClose
                      onClick={() => setSelectedManager(null)}
                      className="absolute right-3 top-[55%] cursor-pointer text-xs lg:text-lg transform -translate-y-1/2 text-gray-400"
                    />
                  ) : (
                    <MdOutlinePersonSearch className="absolute right-3 top-[55%] lg:top-1/2 text-xs lg:text-lg transform -translate-y-1/2 text-gray-400" />
                  )}
                </div>

                {showDropdownManager && (
                  <div
                    ref={dropdownRefManager}
                    className="absolute bg-white rounded-md shadow-lg w-[45%] mt-2 max-h-32 overflow-y-auto z-10"
                  >
                    <ul>
                      {users.map((user, index) => (
                        <li
                          key={user.userid}
                          className={`py-2 px-3 text-[10px] lg:text-xs hover:bg-gray-100 cursor-pointer flex items-center ${
                            selectedManagerIndex === index ? "bg-gray-200" : ""
                          }`}
                          onMouseEnter={() => handleKeyDownManager(index)}
                          onClick={() => handleUserSelectManager(user)}
                        >
                          {user.file ? (
                            <img
                              src={`data:image/jpeg;base64,${user.file}`}
                              alt={user.first_name}
                              className="w-6 lg:!w-8 h-6 lg:!h-8 rounded-full mr-2"
                            />
                          ) : (
                            <FaCircleUser className="w-6 lg:!w-8 h-6 lg:!h-8 text-gray-400 mr-2" />
                          )}
                          <div>
                            <p>
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-gray-500 text-[9px]">
                              {user.role}
                            </p>
                          </div>
                        </li>
                      ))}
                      {hasFetched &&
                        users.length === 0 &&
                        searchTermManager && (
                          <p className="text-xs text-gray-400 p-2">
                            No users found.
                          </p>
                        )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex justify-between items-end">
                <label
                  className={`block text-[8px] lg:!text-[10px] xl:!text-xs font-medium text-gray-700`}
                >
                  Task Supervisor <span className="text-red-500">*</span>
                </label>
                <p
                  className={`text-[8px] lg:!text-[10px] mb-0 text-red-600 ${
                    errors && errors.task_supervisor ? "" : "hidden"
                  }`}
                >
                  This field is required
                </p>
              </div>
              <div className="w-full">
                <div className="relative w-full">
                  <input
                    ref={inputRefSup}
                    type="text"
                    onKeyDown={handleKeyDownSup}
                    placeholder="Search users..."
                    value={
                      selectedSup
                        ? `${selectedSup.first_name} ${selectedSup.last_name}`
                        : searchTermSup
                    }
                    onChange={handleSearchSup}
                    className={`w-full px-3 h-[18px] lg:!h-[26px] xl:!h-[30px] mt-1 pr-10 border rounded-md text-[10px] lg:text-xs focus:outline-none focus:border-[#18636f] ${
                      errors && errors.task_supervisor ? "border-red-500" : ""
                    }`}
                    onFocus={() => setShowDropdownSup(true)}
                  />
                  {selectedSup ? (
                    <IoClose
                      onClick={() => setSelectedSup(null)}
                      className="absolute right-3 top-[55%] cursor-pointer text-xs lg:text-lg transform -translate-y-1/2 text-gray-400"
                    />
                  ) : (
                    <MdOutlinePersonSearch className="absolute right-3 top-[55%] lg:top-1/2 text-xs lg:text-lg transform -translate-y-1/2 text-gray-400" />
                  )}
                </div>

                {showDropdownSup && (
                  <div
                    ref={dropdownRefSup}
                    className="absolute bg-white rounded-md shadow-lg w-[45%] mt-2 max-h-32 overflow-y-auto z-10"
                  >
                    <ul>
                      {users.map((user, index) => (
                        <li
                          key={user.userid}
                          className={`py-2 px-3 text-[10px] lg:text-xs hover:bg-gray-100 cursor-pointer flex items-center ${
                            selectedSupIndex === index ? "bg-gray-200" : ""
                          }`}
                          onMouseEnter={() => handleKeyDownSup(index)}
                          onClick={() => handleUserSelectSup(user)}
                        >
                          {user.file ? (
                            <img
                              src={`data:image/jpeg;base64,${user.file}`}
                              alt={user.first_name}
                              className="w-6 lg:!w-8 h-6 lg:!h-8 rounded-full mr-2"
                            />
                          ) : (
                            <FaCircleUser className="w-6 lg:!w-8 h-6 lg:!h-8 text-gray-400 mr-2" />
                          )}
                          <div>
                            <p>
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-gray-500 text-[9px]">
                              {user.role}
                            </p>
                          </div>
                        </li>
                      ))}
                      {hasFetched && users.length === 0 && searchTermSup && (
                        <p className="text-xs text-gray-400 p-2">
                          No users found.
                        </p>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-1.5 lg:mb-2 xl:mb-3 mt-2">
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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

export default EditProject;
