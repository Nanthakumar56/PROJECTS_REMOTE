import React, { lazy, useEffect, useRef, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BiDotsHorizontal,
  BiDotsVertical,
  BiSolidEditAlt,
} from "react-icons/bi";
import { FaRegDotCircle, FaUserCircle } from "react-icons/fa";
import { FaArrowUp, FaArrowDown, FaCircleExclamation } from "react-icons/fa6";
import { FaExclamation } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import dayjs from "dayjs";
import { CgGoogleTasks } from "react-icons/cg";
import { GoTasklist } from "react-icons/go";
import { MdOutlinePendingActions } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import Notes from "../assets/images/3123473.jpg";
import AttachImg from "../assets/images/2924732.jpg";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { LuChevronsRight } from "react-icons/lu";
import Attachment from "../assets/images/fluent-color_document-32.png";
import { FaFlag } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import {
  BsFileEarmarkPdfFill,
  BsFileEarmarkImageFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkXFill,
  BsFileEarmarkFill,
  BsFileEarmarkPptFill,
  BsFileEarmarkTextFill,
} from "react-icons/bs";
import FileParser from "./popups/FileParser";
import ProjectMembers from "./popups/ProjectMembers";
import ProNotes from "./popups/ProNotes";
import MileStones from "./popups/MileStones";
import EditNotes from "./popups/EditNotes";
import ConfirmationPopup from "./popups/ConfirmationPopup";
import EditProject from "./popups/EditProject";
import ProjectMembersData from "./popups/ProjectMembersData";

const ProjectInformation = () => {
  const location = useLocation();
  const [timeStatus, setTimeStatus] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);
  const { projectid } = location.state || {};
  const [projectData, setProjectData] = useState({});
  const [milestonesData, setMilestonesData] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [approverImageSrc, setApproverImageSrc] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);
  const menuRefAtc = useRef(null);
  const [openMenuIndexAtc, setOpenMenuIndexAtc] = useState(null);
  const [showFileImport, setShowFileImport] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showNewNotes, setShowNewNotes] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showEditNotes, setShowEditNotes] = useState(false);
  const [projectNotes, setProjectNotes] = useState([]);
  const [notesid, setnotesid] = useState("");
  const [atcid, setatcid] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState("");
  const [confirmDeleteMsg, setConfirmDeleteMsg] = useState("");
  const [showConfirmDeleteation, setShowConfirmDeleteation] = useState(false);
  const completedMilestones = milestonesData.filter(
    (milestone) => milestone.status === "Completed"
  ).length;

  const totalMilestones = milestonesData.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;
  const [showEditprojectForm, setShowEditprojectForm] = useState(false);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenuIndex(null);
    }
  };
  const handleClickOutsideAtc = (event) => {
    if (menuRefAtc.current && !menuRefAtc.current.contains(event.target)) {
      setOpenMenuIndexAtc(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideAtc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAtc);
    };
  }, []);

  const fetchProjectNotes = async (projectid) => {
    try {
      const response = await fetch(
        `http://localhost:5858/projectNotes/getNotes?projectid=${projectid}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const projectNotes = await response.json();

      setProjectNotes(projectNotes);
    } catch (err) {
      console.error("Error fetching project notes:", err.message);
    }
  };

  const fetchProjectAttachments = async (projectid) => {
    try {
      const response = await fetch(
        `http://localhost:5858/documents/project?projectid=${projectid}`
      );

      if (response.status === 404) {
        setAttachments([]);
        return;
      }

      const projectattachments = await response.json();
      setAttachments(projectattachments);
    } catch (err) {
      setAttachments([]);
      console.error("Error fetching project notes:", err.message);
    }
  };

  const description = projectData.projectdescription || "";

  const truncatedDescription =
    description.length > 250 ? description.slice(0, 250) + "..." : description;

  const fullDescription = description || "No description available.";

  const handleToggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleMenuToggle = (index) => {
    setOpenMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const handleMenuToggleAtc = (index) => {
    setOpenMenuIndexAtc((prevIndex) => (prevIndex === index ? null : index));
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

      setUserId(data.project_manager_id);

      if (data.managerFile) {
        if (typeof data.managerFile === "string") {
          setImageSrc(`data:image/jpeg;base64,${data.managerFile}`);
        } else {
          const byteArrayToBase64 = (byteArray) => {
            const binary = Array.from(byteArray)
              .map((b) => String.fromCharCode(b))
              .join("");
            return `data:image/jpeg;base64,${btoa(binary)}`;
          };

          const base64Image = byteArrayToBase64(data.managerFile);
          setImageSrc(base64Image);
        }
      }
      if (data.approverFile) {
        if (typeof data.approverFile === "string") {
          setApproverImageSrc(`data:image/jpeg;base64,${data.approverFile}`);
        } else {
          const byteArrayToBase64 = (byteArray) => {
            const binary = Array.from(byteArray)
              .map((b) => String.fromCharCode(b))
              .join("");
            return `data:image/jpeg;base64,${btoa(binary)}`;
          };

          const base64Image = byteArrayToBase64(data.approverFile);
          setApproverImageSrc(base64Image);
        }
      }
    } catch (err) {
      console.error("Error fetching Project data:", err.message);
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes >= 1048576) {
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
  };

  const getFileIcon = (filetype) => {
    const filetypeLower = filetype.toLowerCase();

    // Check for image MIME types
    if (filetypeLower.startsWith("image/")) {
      return <BsFileEarmarkImageFill className="text-yellow-600" />;
    }

    // Check for document MIME types
    if (
      filetypeLower === "application/msword" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <BsFileEarmarkWordFill className="text-blue-600" />;
    }

    // Check for spreadsheet MIME types
    if (
      filetypeLower === "application/vnd.ms-excel" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      filetypeLower === "text/csv"
    ) {
      return <BsFileEarmarkXFill className="text-green-600" />;
    }

    // Check for PDF MIME type
    if (filetypeLower === "application/pdf") {
      return <BsFileEarmarkPdfFill className="text-red-600" />;
    }

    // Check for presentation MIME types
    if (
      filetypeLower === "application/vnd.ms-powerpoint" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return <BsFileEarmarkPptFill className="text-orange-600" />;
    }

    if (filetypeLower === "text/plain") {
      return <BsFileEarmarkTextFill className="text-[#b413ffaa]" />;
    }

    return <BsFileEarmarkFill className="text-gray-600" />;
  };

  const getReadableFileType = (filetype) => {
    const filetypeLower = filetype.toLowerCase();
    if (filetypeLower.startsWith("image/")) {
      return "Image";
    }
    if (
      filetypeLower === "application/msword" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "DOC";
    }

    if (
      filetypeLower === "application/vnd.ms-excel" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      filetypeLower === "text/csv"
    ) {
      return "EXCEL";
    }

    if (filetypeLower === "application/pdf") {
      return "PDF";
    }

    if (
      filetypeLower === "application/vnd.ms-powerpoint" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return "PPT";
    }

    if (filetypeLower === "text/plain") {
      return "TEXT";
    }

    return "Unknown File Type";
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

  const fetchDocument = async (id, filename) => {
    try {
      const response = await fetch(
        `http://localhost:5858/documents/${id}?download=true`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      const fileType = response.headers.get("Content-Type");

      const fileNameToUse =
        filename ||
        (contentDisposition
          ? contentDisposition.split('name="')[1].split('"')[0]
          : "managerFile");

      const fileData = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(fileData);
      link.download = fileNameToUse;
      link.click();
    } catch (err) {
      console.error("Error fetching document:", err.message);
    }
  };

  useEffect(() => {
    if (projectid) {
      fetchProjectData();
      fetchProjectAttachments(projectid);
      fetchMilestonesData(projectid);
      fetchProjectNotes(projectid);
    }
  }, [projectid]);

  useEffect(() => {
    const currentDate = dayjs();
    const endDate = dayjs(projectData.end_date);

    const difference = endDate
      .startOf("day")
      .diff(currentDate.startOf("day"), "day");

    setDaysRemaining(difference);

    if (projectData.progress === 100) {
      setTimeStatus("completed");
    } else {
      if (difference > 1 && difference < 7) {
        setTimeStatus("few-days");
      } else if (difference === 0) {
        setTimeStatus("today");
      } else if (difference === 1) {
        setTimeStatus("tomorrow");
      } else if (difference < 0) {
        setTimeStatus("overdue");
      } else {
        setTimeStatus("normal");
      }
    }
  }, [projectData.end_date]);

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-yellow-200 text-yellow-800";
      case "upcoming":
        return "bg-blue-200 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "on hold":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-red-200 text-red-800";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return <FaArrowDown className="text-blue-500" />;
      case "medium":
        return <FaRegDotCircle className="text-green-500" />;
      case "high":
        return <FaArrowUp className="text-yellow-500" />;
      case "urgent":
        return <FaExclamation className="text-red-500" />;
      default:
        return null;
    }
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

    return `${day}-${month}-${year}`;
  };

  const getTargetDateMessage = (targetDate, status) => {
    const target = new Date(targetDate);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (status === "Completed") {
      return formatDate(target);
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

    if (diffDays <= 7) {
      return `${diffDays} days remaining`;
    }

    return formatDate(target);
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

  const handleRemoveNote = async (notesid) => {
    try {
      const response = await fetch(
        `http://localhost:5858/projectNotes/delete?noteId=${notesid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("Note deleted successfully:", data);

      fetchProjectNotes(projectid);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleRemoveDoc = (id) => {
    setatcid(id);
    setConfirmTitle("Remove Attachment");
    setConfirmMsg(
      "Are you sure do you want to remove attachment of the project?"
    );
    setShowConfirmation(true);
  };

  const hanldeConfirmation = (confirmed) => {
    if (confirmed) {
      fetch(`http://localhost:5858/documents/delete?id=${atcid}`, {
        method: "DELETE",
      })
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

          fetchProjectAttachments(projectid);
          setShowConfirmation(false);
        })
        .catch((error) => {
          console.error("Error deleting milestone:", error);
        });
    } else {
      setShowConfirmation(false);
    }
  };

  const handleDeleteProject = () => {
    setConfirmDeleteTitle("Delete Project");
    setConfirmDeleteMsg("Are you sure do you want to delete tis project?");
    setShowConfirmDeleteation(true);
  };

  const handleDeleteConfirmation = async (confirmed) => {
    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:5858/projects/delete?projectId=${projectid}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          console.log("Project deleted successfully");
          setShowConfirmDeleteation(false);
          navigate("/projects");
        } else {
          console.error("Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    } else {
      setShowConfirmDeleteation(false);
    }
  };

  return (
    <div>
      {" "}
      <Breadcrumbs
        items={[
          { label: "All Projects", path: "/projects" },
          { label: projectData?.projectname },
        ]}
      />
      <div className="flex justify-between flex-wrap">
        <div className="w-full xl:!w-[69%] flex flex-wrap gap-4">
          <div
            className="w-full bg-white rounded-lg px-6 py-5"
            style={{
              boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm lg:!text-base font-semibold">
                {projectData.projectname || "Unnamed Project"}
              </p>
              <button
                onClick={() => setShowEditprojectForm(true)}
                className="flex items-center group gap-x-1"
              >
                <BiSolidEditAlt className="cursor-pointer text-xs lg:!text-sm group-hover:text-[#18636F]" />
                <p className="mb-0 cursor-pointer text-xs lg:!text-sm group-hover:text-[#18636F]">
                  Edit Information
                </p>
              </button>
            </div>
            <div className="flex items-start gap-x-20">
              <div className="py-1 lg:!pt-4 text-[10px] lg:!text-xs font-medium text-gray-500 flex justify-between items-center">
                <button className="flex group items-center gap-x-3 cursor-pointer text-left">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      className="h-10 w-10 rounded-full border-2 border-[#18636f]"
                    />
                  ) : (
                    <FaUserCircle className="h-10 w-10 rounded-full border-2 border-[#18636f] text-gray-400" />
                  )}
                  <div>
                    <p>Project Manager</p>
                    <p className="text-black pt-0.5 text-xs lg:text-sm group-hover:text-[#18636f]">
                      {projectData.project_manager}
                    </p>
                  </div>
                </button>
              </div>
              <div className="py-1 lg:!pt-4 text-[10px] lg:!text-xs font-medium text-gray-500 flex justify-between items-center">
                <button className="flex group items-center gap-x-3 cursor-pointer text-left">
                  {approverImageSrc ? (
                    <img
                      src={approverImageSrc}
                      className="h-10 w-10 rounded-full border-2 border-[#18636f]"
                    />
                  ) : (
                    <FaUserCircle className="h-10 w-10 rounded-full border-2 border-[#18636f] text-gray-400" />
                  )}

                  <div>
                    <p>Task Supervisor</p>
                    <p className="text-black pt-0.5 text-xs lg:text-sm group-hover:text-[#18636f]">
                      {projectData.approver_name}
                    </p>
                  </div>
                </button>
              </div>
            </div>
            <div className="py-4 text-xs lg:!text-sm text-gray-500 text-justify">
              {isExpanded ? (
                <p>
                  {fullDescription}{" "}
                  {description.length > 250 && (
                    <button
                      className="text-[#18636f] font-medium pl-5"
                      onClick={handleToggleDescription}
                    >
                      Show less
                    </button>
                  )}
                </p>
              ) : (
                <p>
                  {truncatedDescription}{" "}
                  {description.length > 250 && (
                    <button
                      className="text-[#18636f] font-medium"
                      onClick={handleToggleDescription}
                    >
                      Show more
                    </button>
                  )}
                </p>
              )}
            </div>

            {projectData.status === "On Hold" && (
              <div className="py-[2px] my-1 px-2 rounded-md bg-red-200 text-red-500 w-fit text-[9px] lg:text-[11px] flex gap-x-1 items-start">
                <span className="pt-[3px]">
                  <FaCircleExclamation />
                </span>
                <p>{projectData.reason}</p>
              </div>
            )}
            <div>
              <div className="flex md:flex-wrap xl:flex-nowrap gap-x-3 lg:!gap-x-5">
                <div className="w-full xl:!w-[75%]">
                  <p className="text-xs lg:!text-sm pb-2">Basic Information</p>
                  <div className="flex items-start">
                    <div className="w-1/2">
                      <table className="border-collapse text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                              Priority
                            </td>
                            <td className="px-3">:</td>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs">
                              <div className="flex items-center gap-x-2">
                                {projectData.priority
                                  ? getPriorityIcon(projectData.priority)
                                  : null}
                                {projectData.priority || "Unknown Priority"}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                              Start Date
                            </td>
                            <td className="px-3">:</td>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs">
                              {formatDate(projectData.start_date)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                              Members
                            </td>
                            <td className="px-3">:</td>
                            <td>
                              {" "}
                              <p
                                onClick={() => setShowMembers(true)}
                                className="py-1 lg:!py-2 text-[10px] lg:!text-xs text-[#18636f] underline cursor-pointer"
                              >
                                {projectData.userIds && (
                                  <span>
                                    {projectData.userIds.length}{" "}
                                    {projectData.userIds.length === 1
                                      ? "member"
                                      : "members"}
                                  </span>
                                )}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="w-1/2">
                      <table className="border-collapse text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                              Status
                            </td>
                            <td className="px-3">:</td>
                            <td className=" text-[10px] lg:!text-xs">
                              <p
                                className={`px-2 py-1 rounded-lg ${getStatusBgColor(
                                  projectData.status
                                )} inline-block text-center`}
                              >
                                {projectData.status || "Unknown"}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                              Due Date
                            </td>
                            <td className="px-3">:</td>
                            <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs">
                              {formatDate(projectData.end_date)}
                            </td>
                          </tr>
                          {projectData.status !== "Completed" &&
                          projectData.status !== "Upcoming" ? (
                            <tr>
                              <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                                Started On
                              </td>
                              <td className="px-3">:</td>
                              <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs">
                                {formatDate(projectData.started_on)}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                          {projectData.status === "Completed" ? (
                            <tr>
                              <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                                Completed On
                              </td>
                              <td className="px-3">:</td>
                              <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs">
                                {formatDate(projectData.completed_at)}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="w-[20%] lg:!w-[20%] xl:!w-[25%] py-3 xl:!py-0 xl:border-l xl:!pl-5 h-fit">
                  <p className="py-1 lg:!py-2 text-xs lg:!text-sm font-medium">
                    Actions
                  </p>
                  <button
                    onClick={() => setShowManageMembers(true)}
                    className="py-1 lg:!py-2 text-[10px] lg:!text-xs underline text-[#18636F] cursor-pointer"
                  >
                    Manage members
                  </button>
                  <button
                    onClick={() => handleDeleteProject()}
                    className="py-1 lg:!py-2 text-[10px] lg:!text-xs underline text-[#18636F] cursor-pointer"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
            <div className="flex text-[10px] cursor-pointer lg:!text-xs text-[#18636f] underline justify-end">
              <button
                onClick={() =>
                  navigate("allTasks", {
                    state: { projectid, projectName: projectData.projectname },
                  })
                }
                className="flex items-center"
              >
                <p>View Tasks</p>
                <LuChevronsRight />
              </button>
            </div>
          </div>
          <div className="w-full flex justify-between items-start">
            <div
              className="w-[49%] bg-white rounded-lg  px-4 lg:px-6 py-5"
              style={{
                boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="flex items-center justify-between pb-4 ">
                <div className="flex items-center gap-x-2">
                  <CgNotes className="text-xs lg:!text-sm text-green-400" />
                  <p className="text-xs lg:!text-sm font-semibold">
                    Project Notes
                  </p>
                </div>
                <button
                  onClick={() => setShowNewNotes(true)}
                  className="text-xs lg:!text-sm text-[#18636f] underline"
                >
                  + Add
                </button>
              </div>

              <div className="h-[244px] overflow-auto ">
                {projectNotes.length > 0 ? (
                  projectNotes
                    .slice()
                    .sort((a, b) => {
                      const tagPriority = {
                        important: 1,
                        moderate: 2,
                        normal: 3,
                      };
                      return tagPriority[a.tag] - tagPriority[b.tag];
                    })
                    .map((note, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between items-start">
                          <div className="text-gray-500 w-[93%] flex items-start gap-x-2">
                            <p
                              className={`text-[6px] lg:!text-[8px] py-1 px-1 rounded-md w-fit ${
                                note.tag === "important"
                                  ? " text-red-600"
                                  : note.tag === "moderate"
                                  ? " text-yellow-500"
                                  : " text-green-600"
                              }`}
                            >
                              <FaCircle />
                            </p>
                            <h3 className="text-[10px] lg:!text-xs">
                              {note.keypoints}
                            </h3>
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
                                className="absolute right-4 top-0 border mt-2 rounded-md shadow-lg z-10 bg-white"
                              >
                                <button
                                  onClick={() => {
                                    setnotesid(note.notesid);
                                    setShowEditNotes(true);
                                  }}
                                  className="w-full block px-6 py-2 text-[10px] lg:!text-xs rounded hover:bg-gray-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleRemoveNote(note.notesid)}
                                  className="w-full block px-6 py-2 text-[10px] lg:!text-xs text-red-600 rounded hover:bg-gray-200"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <img
                        src={Notes}
                        className="h-44 w-44 lg:!h-52 lg:!w-52"
                      />
                      <p className="text-[10px] lg:!text-xs text-gray-500">
                        No notes defined. Please add a note above.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="w-[49%] bg-white rounded-lg px-4 lg:px-6 py-5"
              style={{
                boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-x-2 ">
                  <img src={Attachment} className="h-4 w-4" />
                  <p className="text-xs lg:!text-sm font-semibold">
                    Attachments
                  </p>
                </div>
                <button
                  onClick={() => setShowFileImport(true)}
                  className="text-xs lg:!text-sm text-[#18636f] underline"
                >
                  Upload
                </button>
              </div>
              <div className="h-[250px] overflow-auto">
                {attachments.length > 0 ? (
                  <div>
                    {attachments.map((attachment, index) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-x-2 w-full py-3"
                      >
                        <div className="h-8 w-8 flex justify-center items-center bg-gray-100 rounded-full">
                          <span className="text-xl">
                            {getFileIcon(attachment.type)}
                          </span>
                        </div>

                        <div className="flex flex-1 items-center justify-between">
                          <div className="w-[93%]">
                            <h3 className="text-xs lg:!text-[13px]">
                              {attachment.name.length > 18
                                ? `${attachment.name.slice(0, 15)}...`
                                : attachment.name}
                            </h3>
                            <div className="flex items-center justify-start gap-x-2 text-[8px] lg:!text-[10px] text-gray-400">
                              <p className="text-[10px] lg:text-xs">
                                {getReadableFileType(attachment.type)}
                              </p>
                              <p>{formatFileSize(attachment.size)}</p>
                            </div>
                          </div>

                          <div
                            onClick={() =>
                              openMenuIndexAtc === index
                                ? handleMenuToggleAtc(null)
                                : handleMenuToggleAtc(index)
                            }
                            className="relative w-[7%]"
                          >
                            {openMenuIndexAtc === index ? (
                              <button>
                                <IoCloseOutline className="md:text-sm lg:!text-lg text-mainColor" />
                              </button>
                            ) : (
                              <button>
                                <CiMenuKebab className="md:text-xs lg:!text-sm text-mainColor" />
                              </button>
                            )}
                            {openMenuIndexAtc === index && (
                              <div
                                ref={menuRefAtc}
                                className="absolute right-4 top-0 border mt-2 rounded-md shadow-lg z-10 bg-white"
                              >
                                <button
                                  onClick={() => {
                                    fetchDocument(
                                      attachment.id,
                                      attachment.name
                                    );
                                  }}
                                  className="w-full block px-6 py-2 text-[10px] lg:!text-xs rounded hover:bg-gray-200"
                                >
                                  Download
                                </button>
                                <button
                                  onClick={() => handleRemoveDoc(attachment.id)}
                                  className="w-full block px-6 py-2 text-[10px] lg:!text-xs text-red-600 rounded hover:bg-gray-200"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <img
                        src={AttachImg}
                        className="h-44 w-44 lg:!h-52 lg:!w-52 mx-auto"
                      />
                      <p className="text-[10px] lg:!text-xs text-gray-500">
                        No attachments found. Please upload attachments above.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full xl:!w-[30%] flex items-start gap-x-4 xl:!block mt-2 lg:!mt-3 xl:!mt-0">
          <div className="w-[50%] xl:!w-full">
            <div
              className="bg-white h-fit rounded-lg p-5 mb-4"
              style={{
                boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
              }}
            >
              <p className="text-xs lg:!text-sm font-semibold pb-4">
                Overall Progress
              </p>
              <div className="relative mb-3">
                <div className="bg-slate-200 h-2 rounded-full">
                  <div
                    className="bg-[#1d555e] h-full rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="absolute top-[-18px] right-0 text-xs text-mainColor">
                  {Math.round(progressPercentage)}%
                </div>
              </div>
            </div>
            <div className="w-[100%] flex flex-wrap justify-between gap-y-3 lg:!gap-y-4">
              <div
                className="w-[48%] bg-white rounded-md px-3 xl:!px-4 py-3"
                style={{
                  boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[10px] xl:!text-xs text-gray-600">
                      Time Remaining
                    </h2>
                    <p
                      className={`text-xs  xl:!text-sm font-semibold mb-0 ${
                        timeStatus === "few-days" ? "text-red-500" : ""
                      } ${
                        timeStatus === "overdue" ? "text-red-600 text-sm" : ""
                      }
                         ${
                           timeStatus === "today" ? "text-red-600 text-sm" : ""
                         }  ${
                        timeStatus === "tomorrow" ? "text-red-600 text-sm" : ""
                      }`}
                    >
                      {timeStatus === "overdue"
                        ? "Overdue"
                        : timeStatus === "today"
                        ? "Today"
                        : timeStatus === "tomorrow"
                        ? "Tomorrow"
                        : timeStatus === "completed"
                        ? "---"
                        : `${daysRemaining}d`}
                    </p>
                  </div>
                  <span className="h-7 w-7 bg-[#18636f] rounded-full flex justify-center items-center">
                    <BsClockHistory className="text-[18px] text-white" />
                  </span>
                </div>
              </div>
              <div
                className="w-[48%] bg-white rounded-md px-3 py-2 xl:!px-4 xl:!py-3"
                style={{
                  boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[10px] xl:!text-xs text-gray-600">
                      Total Tasks
                    </h2>
                    <p className={`text-xs  xl:!text-sm font-semibold mb-0 `}>
                      {projectData.totaltasks}
                    </p>
                  </div>
                  <span className="h-7 w-7 bg-[#18636f] rounded-full flex justify-center items-center">
                    <GoTasklist className="text-[18px] text-white" />
                  </span>
                </div>
              </div>
              <div
                className="w-[48%] bg-white rounded-md px-3 py-2 xl:!px-4 xl:!py-3"
                style={{
                  boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[10px] xl:!text-xs text-gray-600">
                      Closed Tasks
                    </h2>
                    <p className={`text-xs  xl:!text-sm font-semibold mb-0 `}>
                      {projectData.closedtasks}
                    </p>
                  </div>
                  <span className="h-7 w-7 bg-[#18636f] rounded-full flex justify-center items-center">
                    <CgGoogleTasks className="text-[18px] text-white" />
                  </span>
                </div>
              </div>
              <div
                className="w-[48%] bg-white rounded-md px-3 py-2 xl:!px-4 xl:!py-3"
                style={{
                  boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[10px] xl:!text-xs text-gray-600">
                      Pending Tasks
                    </h2>
                    <p className={`text-xs  xl:!text-sm font-semibold mb-0 `}>
                      {projectData.pendingtasks}
                    </p>
                  </div>
                  <span className="h-7 w-7 bg-[#18636f] rounded-full flex justify-center items-center">
                    <MdOutlinePendingActions className="text-[18px] text-white" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[50%] xl:!w-full xl:mt-5">
            <div
              className="bg-white h-fit rounded-lg p-5 mb-4"
              style={{
                boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <FaFlag className="text-xs lg:!text-sm text-orange-400 mb-1" />
                  <p className="text-xs lg:!text-sm font-semibold mb-2">
                    Key Milestones
                  </p>
                </div>
                <button
                  onClick={() => setShowMilestone(true)}
                  className="text-[10px] lg:!text-xs text-[#18636f] underline cursor-pointer"
                >
                  View
                </button>
              </div>
              <p className="text-[10px] lg:!text-xs text-gray-500 pb-4">
                These milestones represent the major checkpoints for your
                project.
              </p>
              <div className="h-[250px] lg:!h-[324px] overflow-auto">
                {milestonesData.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-x-4 mb-2 lg:!mb-4"
                  >
                    <div className="relative flex items-center">
                      {step.status === "Completed" ? (
                        <FaCircleCheck className="text-xs lg:!text-sm text-green-600" />
                      ) : step.status === "In Progress" ? (
                        <FaCircleChevronRight className="text-xs lg:!text-sm text-orange-500" />
                      ) : step.status === "On Hold" ? (
                        <FaCirclePause className="text-xs lg:!text-sm text-gray-700" />
                      ) : (
                        <FaCircle className="text-xs lg:!text-sm text-gray-400" />
                      )}

                      {index < milestonesData.length - 1 && (
                        <div
                          className={`absolute left-1/2 top-[15px] lg:!top-[18px] transform -translate-x-1/2 h-[18px] lg:!h-[27px] border-l lg:!border-l-2 ${
                            step.status === "Completed"
                              ? "border-green-600"
                              : "border-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>

                    <div className="w-full">
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
                        className={`text-[8px] lg:!text-[10px] ${getTargetDateClass(
                          step.target_date,
                          step.status
                        )}`}
                      >
                        Target Date:{" "}
                        {getTargetDateMessage(
                          formatDate(step.target_date),
                          step.status
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showFileImport && (
        <FileParser
          closeModal={() => {
            setShowFileImport(false);
            fetchProjectAttachments(projectid);
          }}
          projectid={projectid}
        />
      )}
      {showManageMembers && (
        <ProjectMembers
          onClose={() => {
            setShowManageMembers(false);
            fetchProjectData();
          }}
          projectId={projectid}
          managerid={projectData.project_manager_id}
          supervisorid={projectData.task_approver}
        />
      )}
      {showMembers && (
        <ProjectMembersData
          onClose={() => {
            setShowMembers(false);
            fetchProjectData();
          }}
          projectId={projectid}
        />
      )}
      {showNewNotes && (
        <ProNotes
          onClose={() => {
            setShowNewNotes(false);
            fetchProjectNotes(projectid);
          }}
          projectid={projectid}
        />
      )}
      {showMilestone && (
        <MileStones
          onClose={() => {
            setShowMilestone(false);
            fetchMilestonesData(projectid);
          }}
          projectid={projectid}
        />
      )}
      {showEditNotes && (
        <EditNotes
          onClose={() => {
            setShowEditNotes(false);
            fetchProjectNotes(projectid);
          }}
          notesid={notesid}
        />
      )}
      {showConfirmation && (
        <ConfirmationPopup
          title={confirmTitle}
          message={confirmMsg}
          onclose={hanldeConfirmation}
        />
      )}
      {showEditprojectForm && (
        <EditProject
          onClose={() => {
            fetchProjectData();
            setShowEditprojectForm(false);
          }}
          projectid={projectid}
        />
      )}
      {showConfirmDeleteation && (
        <ConfirmationPopup
          title={confirmDeleteTitle}
          message={confirmDeleteMsg}
          onclose={handleDeleteConfirmation}
        />
      )}
    </div>
  );
};

export default ProjectInformation;
