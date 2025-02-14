import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa6";
import CalendarPopup from "../CalendarPopup";

const EditPhase = ({ onClose, milestoneId, milestoneLength }) => {
  const [isCalendarVisibleS, setIsCalendarVisibleS] = useState(false);
  const [isCalendarVisibleT, setIsCalendarVisibleT] = useState(false);
  const [reason, setReason] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    startDate: "",
    targetDate: "",
    status: "Upcoming",
    steps: "",
    reason: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStepsDropdownOpen, setIsStepsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const stepsDropdownRef = useRef(null);

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

  useEffect(() => {
    const fetchPhaseData = async () => {
      console.log("fetching!!");
      try {
        const response = await fetch(
          `http://localhost:5858/milestones/getPhase?milestoneId=${milestoneId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch milestone data");
        }
        const data = await response.json();

        setFormValues({
          title: data.name || "",
          description: data.description || "",
          startDate: data.start_date
            ? formatToLocalDateTime(data.start_date)
            : "",
          targetDate: data.target_date
            ? formatToLocalDateTime(data.target_date)
            : "",
          status: data.status || "Upcoming",
          steps: data.step ? data.step.toString() : "",
          reason: data.reason || "",
        });

        if (data.status === "On Hold") {
          setReason(true);
        }
      } catch (error) {
        console.error("Error fetching milestone data:", error);
      }
    };

    if (milestoneId) {
      fetchPhaseData();
    }
  }, [milestoneId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        stepsDropdownRef.current &&
        !stepsDropdownRef.current.contains(event.target)
      ) {
        setIsStepsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      status: value,
    }));
    setIsDropdownOpen(false);
    if (value === "On Hold") {
      setReason(true);
    } else {
      setReason(false);
    }
  };

  const handleStepsChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      steps: value,
    }));
    setIsStepsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString();
    };

    const payload = [
      {
        milestoneid: milestoneId,
        name: formValues.title,
        description: formValues.description,
        start_date: formatDate(formValues.startDate),
        target_date: formatDate(formValues.targetDate),
        status: formValues.status,
        step: formValues.steps,
        reason: formValues.reason,
      },
    ];

    try {
      const response = await fetch(
        "http://localhost:5858/milestones/updateMilestones",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const result = await response.text();
        onClose();
      } else {
        const error = await response.text();
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  return (
    <div
      id="fileParserModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-lg p-4 w-[340px] lg:w-[420px] xl:w-[500px]">
        <div className="flex justify-between mb-2">
          <p className="text-xs lg:text-sm">New Phase of Milestone</p>
          <button
            onClick={onClose}
            className="text-sm lg:text-base xl:text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        <form className="px-1 lg:px-2">
          <div className="w-full mb-1.5 lg:mb-2 xl:mb-3">
            <div className="flex items-center gap-1">
              <label htmlFor="title" className="text-[10px] lg:text-xs">
                Title
              </label>
              <span className="text-red-600 text-xs lg:text-sm">*</span>
            </div>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              maxLength={24}
              placeholder="Enter milestone title"
              className="w-full text-[10px] lg:text-xs py-1.5 lg:py-2 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:border-[#18636f]"
            />
          </div>

          <div className="w-full ">
            <div className="flex items-center gap-1">
              <label htmlFor="description" className="text-[10px] lg:text-xs">
                Description
              </label>
              <span className="text-red-600 text-xs lg:text-sm">*</span>
            </div>

            <textarea
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              maxLength={100}
              placeholder="Enter milestone description"
              className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:border-[#18636f] max-h-28"
              rows="3"
            ></textarea>
          </div>

          <div className="flex flex-wrap gap-4 mb-1.5 lg:mb-2 xl:mb-3">
            <div className="relative w-[calc(50%-0.5rem)]">
              <div className="flex items-center gap-1">
                <label htmlFor="startDate" className="text-[10px] lg:text-xs">
                  Start Date
                </label>
                <span className="text-red-600 text-xs lg:text-sm">*</span>
              </div>

              <div className="flex items-center relative">
                <input
                  type="text"
                  name="startDate"
                  value={formValues.startDate}
                  onChange={handleInputChange}
                  placeholder="01 Jan 2025"
                  className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:border-[#18636f]"
                />
                <button
                  onClick={toggleCalendarVisibilityS}
                  className="absolute right-2 lg:!right-3 cursor-pointer"
                >
                  <FaRegCalendar className="text-[10px] lg:!text-xs text-[#18636F]" />
                </button>
              </div>
              {isCalendarVisibleS && (
                <CalendarPopup
                  style={{ top: "-205%", right: "12%" }}
                  selectedDate={formValues.startDate}
                  onSelectDate={(date) => {
                    handleInputChange({
                      target: { name: "startDate", value: date },
                    });
                    setIsCalendarVisibleS(false);
                  }}
                  onClose={() => setIsCalendarVisibleS(false)}
                />
              )}
            </div>
            <div className="relative w-[calc(50%-0.5rem)]">
              <div className="flex items-center gap-1">
                <label htmlFor="targetDate" className="text-[10px] lg:text-xs">
                  Target Date
                </label>
                <span className="text-red-600 text-xs lg:text-sm">*</span>
              </div>

              <div className="flex items-center relative">
                <input
                  type="text"
                  name="targetDate"
                  value={formValues.targetDate}
                  onChange={handleInputChange}
                  placeholder="01 Apr 2025"
                  className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:border-[#18636f]"
                />
                <button
                  onClick={toggleCalendarVisibilityT}
                  className="absolute right-2 lg:!right-3 cursor-pointer"
                >
                  <FaRegCalendar className="text-[10px] lg:!text-xs text-[#18636F]" />
                </button>
              </div>
              {isCalendarVisibleT && (
                <CalendarPopup
                  style={{ top: "-205%", right: "12%" }}
                  selectedDate={formValues.targetDate}
                  onSelectDate={(date) => {
                    handleInputChange({
                      target: { name: "targetDate", value: date },
                    });
                    setIsCalendarVisibleT(false);
                  }}
                  onClose={() => setIsCalendarVisibleT(false)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-1.5 lg:mb-2 xl:mb-3">
            <div className="w-[calc(50%-0.5rem)]">
              <label htmlFor="status" className="text-[10px] lg:text-xs">
                Status
              </label>
              <div
                className="relative"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ref={dropdownRef}
              >
                <div
                  className={`w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border rounded-md lg:rounded-lg flex justify-between items-center cursor-pointer ${
                    isDropdownOpen ? "border-[#18636f]" : "border-gray-300"
                  }`}
                >
                  <span>{formValues.status}</span>
                  <FaAngleDown
                    className={`text-gray-500 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isDropdownOpen && (
                  <div
                    className="absolute bg-white w-full border text-[10px] lg:text-xs border-gray-300 mt-1 rounded-md lg:rounded-lg shadow-lg"
                    style={{
                      bottom:
                        dropdownRef.current?.getBoundingClientRect().bottom +
                          200 >
                        window.innerHeight
                          ? "100%"
                          : "auto",
                      top:
                        dropdownRef.current?.getBoundingClientRect().bottom +
                          200 >
                        window.innerHeight
                          ? "auto"
                          : "100%",
                    }}
                  >
                    {["Upcoming", "In Progress", "Completed", "On Hold"].map(
                      (statusOption) => (
                        <div
                          key={statusOption}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleStatusChange(statusOption)}
                        >
                          {statusOption}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-[calc(50%-0.5rem)]">
              <div className="flex items-center gap-1">
                <label htmlFor="steps" className="text-[10px] lg:text-xs">
                  Phase
                </label>
                <span className="text-red-600 text-xs lg:text-sm">*</span>
              </div>

              <div
                className="relative"
                onClick={() => setIsStepsDropdownOpen(!isStepsDropdownOpen)}
                ref={stepsDropdownRef}
              >
                <div
                  className={`w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border rounded-md lg:rounded-lg flex justify-between items-center cursor-pointer ${
                    isStepsDropdownOpen ? "border-[#18636f]" : "border-gray-300"
                  }`}
                >
                  <span>{formValues.steps || "Select phase"}</span>
                  <FaAngleDown
                    className={`text-gray-500 transition-transform duration-300 ${
                      isStepsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isStepsDropdownOpen && (
                  <div
                    className="absolute bg-white w-full border text-[10px] lg:text-xs border-gray-300 mt-1 rounded-md lg:rounded-lg shadow-lg h-28 lg:h-36 xl:h-40 overflow-auto"
                    style={{
                      bottom:
                        stepsDropdownRef.current?.getBoundingClientRect()
                          .bottom +
                          200 >
                        window.innerHeight
                          ? "100%"
                          : "auto",
                      top:
                        stepsDropdownRef.current?.getBoundingClientRect()
                          .bottom +
                          200 >
                        window.innerHeight
                          ? "auto"
                          : "100%",
                    }}
                  >
                    {Array.from(
                      { length: milestoneLength },
                      (_, i) => i + 1
                    ).map((step) => (
                      <div
                        key={step}
                        className="px-2 lg:px-4 py-1 lg:py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleStepsChange(step)}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {reason && (
            <div className="w-full mb-1.5 lg:mb-2 xl:mb-3">
              <div className="flex items-center gap-1">
                <label htmlFor="reason" className="text-[10px] lg:text-xs">
                  Reason for Hold
                </label>
                <span className="text-red-600 text-xs lg:text-sm">*</span>
              </div>
              <input
                type="text"
                name="reason"
                value={formValues.reason}
                onChange={handleInputChange}
                maxLength={24}
                placeholder="Enter the reason"
                className="w-full text-[10px] lg:text-xs py-1.5 lg:py-2 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:border-[#18636f]"
                required
              />
            </div>
          )}
          <div className="flex justify-end mt-6 lg:mt-8 xl:mt-10">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-[#18636f] text-white text-[10px] lg:text-xs py-1 px-4 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPhase;
