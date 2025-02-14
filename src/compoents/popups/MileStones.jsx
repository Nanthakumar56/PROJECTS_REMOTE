import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { PiClockCountdown } from "react-icons/pi";
import { HiOutlineCalendar } from "react-icons/hi2";
import { CiMenuKebab } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import NewMilestone from "./NewMilestone";
import { FaCircleExclamation } from "react-icons/fa6";
import EditPhase from "./EditPhase";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";

const MileStones = ({ onClose, projectid }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [milestonesData, setMilestonesData] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);
  const [showNewMilestone, setShowNewMilestone] = useState(false);
  const [showEditPhase, setShowEditPhase] = useState(false);
  const [milestoneid, setMilestoneid] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorTitle, seterrorTitle] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [showerror, setShowerror] = useState(false);
  const [phaseId, setPhaseId] = useState("");
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMenuToggle = (index) => {
    setOpenMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenuIndex(null);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
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
    if (projectid) {
      fetchMilestonesData(projectid);
    }
  }, [projectid]);

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

    return `${day}-${month}-${year}`;
  };

  const getTargetDateMessage = (targetDate, status) => {
    const target = new Date(targetDate);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (status === "Completed") {
      return "Completed";
    }

    if (target.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (target.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Overdue";
    }

    return `${diffDays} days away`;
  };

  const getTargetDateClass = (targetDate, status) => {
    const target = new Date(targetDate);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (status === "Completed") {
      return "text-gray-500";
    }

    if (
      target.toDateString() === today.toDateString() ||
      target.toDateString() === tomorrow.toDateString()
    ) {
      return "text-gray-500";
    }

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "text-red-600";
    }

    if (diffDays <= 7) {
      return "text-red-600";
    }

    return "text-gray-500";
  };

  const getDropdownPosition = (index) => {
    const element = document.getElementById(`milestone-item-${index}`);
    const rect = element?.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    return spaceBelow > spaceAbove ? "bottom" : "top";
  };

  const handleRemovePhase = (phaseId) => {
    setPhaseId(phaseId);
    if (milestonesData.length > 3) {
      setConfirmTitle("Remove Phase");
      setConfirmMsg(
        "Are you sure do you want to remove this phase of a milestone?"
      );
      setShowConfirmation(true);
    } else {
      seterrorTitle("Remove Phase");
      seterrorMsg("The milestons should have atleast three phases!");
      setShowerror(true);
    }
  };

  const hanldeConfirmation = (confirmed) => {
    if (confirmed) {
      fetch(
        `http://localhost:5858/milestones/deleteMilestone?mileId=${phaseId}`,
        { method: "DELETE" }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then((data) => {
          if (typeof data === "string") {
            console.log("Response message:", data);
          } else {
            console.log("Milestone deleted successfully:", data);
          }

          fetchMilestonesData(projectid);
          setShowConfirmation(false);
        })
        .catch((error) => {
          console.error("Error deleting milestone:", error);
        });
    } else {
      setShowConfirmation(false);
    }
  };

  return (
    <div
      id="fileParserModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end items-center z-50"
    >
      <div
        className={`bg-white p-3 lg:p-4 w-[300px] lg:w-[360px] xl:!w-[400px] h-full transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="flex justify-between mb-4">
          <p className="text-xs lg:text-sm font-semibold">Project Milestones</p>
          <div className="flex justify-end gap-x-2">
            <button
              onClick={() => setShowNewMilestone(true)}
              className="bg-[#18636f] text-white text-[10px] lg:text-xs py-0.5 lg:py-1 px-3 lg:px-4 rounded-lg"
            >
              + Add
            </button>{" "}
            <button
              onClick={handleClose}
              className="text-sm lg:!text-base xl:!text-xl text-gray-500 hover:text-gray-800"
            >
              <IoClose />
            </button>
          </div>
        </div>

        <div className="overflow-auto h-[90%]">
          {milestonesData.map((step, index) => (
            <div
              key={index}
              id={`milestone-item-${index}`}
              className={`flex items-start gap-x-1 lg:gap-x-2 py-3 ${
                index !== milestonesData.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex items-center">
                {step.status === "Completed" ? (
                  <div>
                    <div className="h-[10px] lg:h-[12px] xl:h-[14px] w-[38px] lg:w-[42px] xl:w-12 bg-[#59C894] rounded-t lg:rounded-t-md flex items-center justify-center text-white text-[8px] lg:text-[10px]">
                      {formatDate(step.target_date).split("-")[1]}
                    </div>
                    <div className="h-[24px] lg:h-[26px] xl:h-[28px] w-[38px] lg:w-[42px] xl:w-12 bg-[#EEF1F6] rounded-b lg:rounded-b-md flex items-center justify-center text-xs lg:text-sm">
                      {formatDate(step.target_date).split("-")[0]}
                    </div>
                  </div>
                ) : step.status === "In Progress" ? (
                  <div>
                    <div className="h-[10px] lg:h-[12px] xl:h-[14px] w-10 lg:w-[44px] xl:w-12 bg-[#FF9C73] rounded-t lg:rounded-t-md flex items-center justify-center text-white text-[8px] lg:text-[10px]">
                      {formatDate(step.target_date).split("-")[1]}
                    </div>
                    <div className="h-[24px] lg:h-[26px] xl:h-[28px] w-10 lg:w-[44px] xl:w-12 bg-[#EEF1F6] rounded-b lg:rounded-b-md flex items-center justify-center text-xs lg:text-sm">
                      {formatDate(step.target_date).split("-")[0]}
                    </div>
                  </div>
                ) : step.status === "On Hold" ? (
                  <div>
                    <div className="h-[10px] lg:h-[12px] xl:h-[14px] w-10 lg:w-[44px] xl:w-12 bg-[#4b4b4b] rounded-t lg:rounded-t-md flex items-center justify-center text-white text-[8px] lg:text-[10px]">
                      {formatDate(step.target_date).split("-")[1]}
                    </div>
                    <div className="h-[24px] lg:h-[26px] xl:h-[28px] w-10 lg:w-[44px] xl:w-12 bg-[#EEF1F6] rounded-b lg:rounded-b-md flex items-center justify-center text-xs lg:text-sm">
                      {formatDate(step.target_date).split("-")[0]}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="h-[10px] lg:h-[12px] xl:h-[14px] w-10 lg:w-[44px] xl:w-12 bg-[#63C0F9] rounded-t lg:rounded-t-md flex items-center justify-center text-white text-[8px] lg:text-[10px]">
                      {formatDate(step.target_date).split("-")[1]}
                    </div>
                    <div className="h-[24px] lg:h-[26px] xl:h-[28px] w-10 lg:w-[44px] xl:w-12 bg-[#EEF1F6] rounded-b lg:rounded-b-md flex items-center justify-center text-xs lg:text-sm">
                      {formatDate(step.target_date).split("-")[0]}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {step.status === "Completed" ? (
                  <PiCheckCircle className="text-base lg:text-lg text-gray-400" />
                ) : step.status === "In Progress" ? (
                  <PiClockCountdown className="text-base lg:text-lg text-gray-400" />
                ) : (
                  <HiOutlineCalendar className="text-base lg:text-lg text-gray-400" />
                )}
              </div>

              <div className="w-full">
                <div className="w-full flex justify-between items-start">
                  <p
                    className={`text-[10px] lg:!text-xs ${
                      step.status === "Completed"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {step.name}
                  </p>

                  <p
                    className={`text-[7px] lg:!text-[9px] w-fit py-0.5 lg:py-1 px-3 lg:px-4 rounded-full text-white
    ${
      step.status === "Completed"
        ? "bg-[#59C894]"
        : step.status === "In Progress"
        ? getTargetDateMessage(step.target_date, step.status) === "Overdue"
          ? "bg-[#da1010]"
          : getTargetDateMessage(step.target_date, step.status) === "Today"
          ? "bg-[#da1010]"
          : getTargetDateMessage(step.target_date, step.status) === "Tomorrow"
          ? "bg-[#da1010]"
          : "bg-[#FF9C73]"
        : step.status === "On Hold"
        ? "bg-[#4b4b4b]"
        : "bg-[#63C0F9]"
    } ${getTargetDateClass(step.target_date, step.status)}`}
                  >
                    {getTargetDateMessage(step.target_date, step.status)}
                  </p>
                </div>
                <p
                  className={`text-[9px] lg:!text-[11px] ${
                    step.status === "Completed"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
                {step.reason !== null && step.reason !== "" && (
                  <div className="py-[2px] px-2 rounded-md bg-red-200 text-red-500 w-fit text-[9px] lg:text-[11px] flex gap-x-1 items-start">
                    <span className="pt-[3px]">
                      <FaCircleExclamation />
                    </span>
                    <p>{step.reason}</p>
                  </div>
                )}
              </div>
              <div
                onClick={() =>
                  openMenuIndex === index
                    ? handleMenuToggle(null)
                    : handleMenuToggle(index)
                }
                className="relative w-[7%]"
              >
                {openMenuIndex === index ? (
                  <button>
                    <IoCloseOutline className="md:text-sm lg:!text-lg text-mainColor" />
                  </button>
                ) : (
                  <button>
                    <CiMenuKebab className="md:text-xs lg:!text-sm text-mainColor" />
                  </button>
                )}
                {openMenuIndex === index && (
                  <div
                    ref={menuRef}
                    className={`absolute right-4 ${
                      getDropdownPosition(index) === "bottom"
                        ? "top-0 mt-2"
                        : "bottom-0 mb-2"
                    } border mt-2 rounded-md shadow-lg z-10 bg-white`}
                  >
                    <button
                      onClick={() => {
                        setMilestoneid(step.milestoneid);
                        setShowEditPhase(true);
                      }}
                      className="w-full block px-6 py-2 text-[10px] lg:!text-xs rounded hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemovePhase(step.milestoneid)}
                      className="w-full block px-6 py-2 text-[10px] lg:!text-xs text-red-600 rounded hover:bg-gray-200"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showNewMilestone && (
        <NewMilestone
          projectid={projectid}
          onClose={() => {
            setShowNewMilestone(false);
            fetchMilestonesData(projectid);
          }}
          milestoneLength={milestonesData.length}
        />
      )}
      {showEditPhase && (
        <EditPhase
          onClose={() => {
            setShowEditPhase(false);
            fetchMilestonesData(projectid);
          }}
          milestoneId={milestoneid}
          milestoneLength={milestonesData.length}
        />
      )}
      {showConfirmation && (
        <ConfirmationPopup
          title={confirmTitle}
          message={confirmMsg}
          onclose={hanldeConfirmation}
        />
      )}
      {showerror && (
        <ErrorPopup
          title={errorTitle}
          message={errorMsg}
          onclose={() => setShowerror(false)}
        />
      )}
    </div>
  );
};

export default MileStones;
