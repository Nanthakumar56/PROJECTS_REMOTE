import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegCircle, FaUserCircle } from "react-icons/fa";
import { FaRegCalendar } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { TiDocumentText } from "react-icons/ti";
import { GoDotFill } from "react-icons/go";
import { RxLinkBreak1 } from "react-icons/rx";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineTrademarkCircle,
  AiOutlinePauseCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { FaCircleExclamation } from "react-icons/fa6";
import { LuCircleDot } from "react-icons/lu";
import { TiDeleteOutline } from "react-icons/ti";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import ConfirmationPopup from "../compoents/popups/ConfirmationPopup";
import Breadcrumbs from "./Breadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHourglassStart } from "react-icons/fa6";
import { MdStart } from "react-icons/md";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import Attachment from "../assets/images/fluent-color_document-32.png";
import AttachImg from "../assets/images/2924732.jpg";
import {
  BsFileEarmarkPdfFill,
  BsFileEarmarkImageFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkXFill,
  BsFileEarmarkFill,
  BsFileEarmarkPptFill,
  BsFileEarmarkTextFill,
} from "react-icons/bs";
import FileParserTask from "./popups/FileParserTask";
import { CiMenuKebab } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import {
  FcUp,
  FcDown,
  FcBusinessman,
  FcTodoList,
  FcAbout,
  FcSurvey,
  FcApproval,
  FcCancel,
} from "react-icons/fc";
import Dependancies from "./popups/Dependancies";
import { MdOutlineEmojiFlags } from "react-icons/md";
import HoldReason from "./popups/HoldReason";
import EditTask from "./popups/EditTask";
import ErrorPopup from "./popups/ErrorPopup";

const TaskInformation = () => {
  const location = useLocation();
  const { taskid, projectid, projectName } = location.state || {};
  const [attachments, setAttachments] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [taskData, setTaskData] = useState({ checklist: [] });
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [commentid, setCommentid] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmTitleAtc, setConfirmTitleAtc] = useState("");
  const [confirmMsgAtc, setConfirmMsgAtc] = useState("");
  const [dependancyTitle, setDependancyTitle] = useState("");
  const [dependancyValue, setDependancyValue] = useState("");
  const [showDependancy, setShowDependancy] = useState(false);
  const [showConfirmationAtc, setShowConfirmationAtc] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteText, setInviteText] = useState("");
  const [showFileImport, setShowFileImport] = useState(false);
  const menuRefAtc = useRef(null);
  const [openMenuIndexAtc, setOpenMenuIndexAtc] = useState(null);
  const [atcid, setatcid] = useState("");
  const [userIds, setUserIds] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const [showReason, setShowReason] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [confirmDTitle, setConfirmDTitle] = useState("");
  const [confirmDMsg, setConfirmDMsg] = useState("");
  const [showDConfirmation, setShowDConfirmation] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [ErrorPopupTitle, setErrorPopupTitle] = useState(null);
  const [ErrorPopupMsg, setErrorPopupMsg] = useState(null);
  const navigate = useNavigate();
  const [showErrorMemberPopup, setShowErrorMemberPopup] = useState(false);
  const [ErrorMemberPopupTitle, setErrorMemberPopupTitle] = useState(null);
  const [ErrorMemberPopupMsg, setErrorMemberPopupMsg] = useState(null);

  const fetchTaskInformation = async (taskid) => {
    try {
      const response = await fetch(
        `http://localhost:6262/tasks/task?taskId=${taskid}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const tasks = await response.json();
      setTaskData(tasks);
    } catch (err) {
      console.error("Error fetching task information:", err.message);
    }
  };

  const fetchTaskAttachments = async (taskid) => {
    try {
      const response = await fetch(
        `http://localhost:6262/documents/task?taskid=${taskid}`
      );

      if (response.status === 404) {
        setAttachments([]);
        return;
      }
      const projectattachments = await response.json();
      setAttachments(projectattachments);
    } catch (err) {
      setAttachments([]);
      console.error("Error fetching task attachments:", err.message);
    }
  };

  useEffect(() => {
    fetchTaskInformation(taskid);
    fetchTaskAttachments(taskid);
  }, [taskid]);

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

  const formatDateTime = (dateString) => {
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
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const handleChangeTitle = (id, newTitle) => {
    setTaskData((prevData) => {
      const updatedChecklist = prevData.checklist.map((item) =>
        item.checklistid === id ? { ...item, title: newTitle } : item
      );
      fetch(`http://localhost:6262/tasks/updateChecklist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      return {
        ...prevData,
        checklist: updatedChecklist,
      };
    });
  };

  const DataChecklist = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:6262/tasks/deleteChecklist?id=${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error deleting checklist:", errorMessage);
        return;
      }

      setTaskData((prevData) => ({
        ...prevData,
        checklist: prevData.checklist.filter((item) => item.checklistid !== id),
      }));
      fetchTaskInformation(taskid);
      console.log("Checklist item deleted successfully.");
    } catch (error) {
      console.error("Error deleting checklist:", error);
    }
  };

  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    setTaskData((prevData) => {
      const updatedChecklist = prevData.checklist.map((item) =>
        item.checklistid === id ? { ...item, status: newStatus } : item
      );
      return { ...prevData, checklist: updatedChecklist };
    });

    fetch(`http://localhost:6262/tasks/updateChecklist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(() => {
      setTimeout(() => {
        fetchTaskInformation(taskid);
      }, 500);
    });
  };

  const handleAddItem = async () => {
    if (newItem.trim()) {
      const newChecklistItem = {
        title: newItem,
        task_id: taskid,
        status: "Pending",
      };

      try {
        const response = await fetch(
          "http://localhost:6262/tasks/createChecklist",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newChecklistItem),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add checklist item");
        }

        const createdItem = await response.json();

        setTaskData((prevData) => ({
          ...prevData,
          checklist: [...prevData.checklist, createdItem],
        }));
        fetchTaskInformation(taskid);

        setNewItem("");
      } catch (error) {
        console.error("Error adding checklist item:", error);
        alert("Failed to add checklist item. Please try again.");
      }
    }
  };

  const handleNewItemKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const handleTitleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      handleChangeTitle(id, e.target.value);
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes >= 1048576) {
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
  };

  const handleMenuToggleAtc = (index) => {
    setOpenMenuIndexAtc((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideAtc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAtc);
    };
  }, []);

  const handleClickOutsideAtc = (event) => {
    if (menuRefAtc.current && !menuRefAtc.current.contains(event.target)) {
      setOpenMenuIndexAtc(null);
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

    // Check for image MIME types
    if (filetypeLower.startsWith("image/")) {
      return "Image";
    }

    // Check for Word document MIME types
    if (
      filetypeLower === "application/msword" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "DOC";
    }

    // Check for spreadsheet MIME types
    if (
      filetypeLower === "application/vnd.ms-excel" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      filetypeLower === "text/csv"
    ) {
      return "EXCEL";
    }

    // Check for PDF MIME type
    if (filetypeLower === "application/pdf") {
      return "PDF";
    }

    // Check for PowerPoint MIME types
    if (
      filetypeLower === "application/vnd.ms-powerpoint" ||
      filetypeLower ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return "PPT";
    }

    // Check for text file MIME type
    if (filetypeLower === "text/plain") {
      return "TEXT";
    }

    // Default return value
    return "Unknown File Type";
  };

  const fetchDocument = async (id, filename) => {
    try {
      const response = await fetch(
        `http://localhost:6262/documents/${id}?download=true`
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
          : "file");

      const fileData = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(fileData);
      link.download = fileNameToUse;
      link.click();
    } catch (err) {
      console.error("Error fetching document:", err.message);
    }
  };

  const hanldeConfirmationAtc = (confirmed) => {
    if (confirmed) {
      fetch(`http://localhost:6262/documents/delete?id=${atcid}`, {
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
            console.log("Task attachment successfully:", data);
          }

          fetchTaskAttachments(taskData.id);
          setShowConfirmationAtc(false);
        })
        .catch((error) => {
          console.error("Error deleting milestone:", error);
        });
    } else {
      setShowConfirmationAtc(false);
    }
  };

  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      fetch(`http://localhost:6262/tasks/deleteTaskData?taskid=${taskid}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            setShowErrorPopup(true);
            setErrorPopupTitle("Delete Task");
            setErrorPopupMsg(
              "Task could not be deleted! Please try again later"
            );
          }
          return response.text();
        })
        .then((data) => {
          navigate("/projects/project/allTasks", {
            state: { projectid, projectName },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setShowDConfirmation(false);
    }
  };

  const handleRemoveDoc = (id) => {
    setatcid(id);
    setConfirmTitleAtc("Remove Attachment");
    setConfirmMsgAtc(
      "Are you sure do you want to remove attachment of the project?"
    );
    setShowConfirmationAtc(true);
  };
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!newComment.trim()) return;

      const payload = {
        taskid: taskData?.id,
        comment: newComment,
        created_at: new Date().toISOString(),
        userid: localStorage.getItem("userId"),
      };

      try {
        const response = await fetch(
          "http://localhost:6262/tasks/createComment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          setNewComment("");
          fetchTaskInformation(taskData?.id);
        } else {
          console.error("Failed to post comment");
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  const handleEditKeyDown = async (e, commentId) => {
    if (e.key === "Enter" && editedText.trim()) {
      try {
        await fetch(
          `http://localhost:6262/tasks/updateComment?commentid=${commentId}&comment=${encodeURIComponent(
            editedText
          )}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setEditComment(null);
        fetchTaskInformation(taskData?.id);
      } catch (error) {
        console.error("Failed to update comment", error);
      }
    }
  };

  const DataComment = () => {
    setConfirmTitle("Delete Comment");
    setConfirmMsg("Are you sure do you want to delete this comment?");
    setShowConfirmation(true);
  };

  const hanldeConfirmation = (confirmed) => {
    if (confirmed) {
      fetch(
        `http://localhost:6262/tasks/deleteComment?commentid=${commentid}`,
        {
          method: "DELETE",
        }
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

          fetchTaskInformation(taskData?.id);
          setShowConfirmation(false);
        })
        .catch((error) => {
          console.error("Error deleting milestone:", error);
        });
    } else {
      setShowConfirmation(false);
    }
  };

  useEffect(() => {
    if (isInviting) {
      fetchTaskAssignees();
    }
  }, [isInviting]);

  const fetchTaskAssignees = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6262/tasks/getTaskAssignees?projectid=${taskData.projectId}&taskid=${taskid}`
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
      console.log("userIds:" + userIds);
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
      handleSelect(searchResults[selectedIndex]);
    }
  };

  const handleSelect = async (user) => {
    setInviteText("");
    setSearchResults([]);

    try {
      await axios.post(
        `http://localhost:6262/tasks/createMember?taskid=${taskData.id}&userid=${user.userid}&status=${taskData.status}`
      );
      fetchTaskInformation(taskid);
      setIsInviting(false);
    } catch (error) {
      console.error("Error adding task member:", error);
    }
  };

  const Data = async (userid) => {
    if (taskData.usersAssigned > 1) {
      try {
        const response = await fetch(
          `http://localhost:6262/tasks/deleteMember?taskid=${taskid}&userid=${userid}&status=${taskData.status}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          console.log("Task member deleted successfully.");
          if (response.ok) {
            fetchTaskInformation(taskid);
          }
        } else {
          console.error("Failed to delete task member.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setErrorMemberPopupTitle("Remove Assignee");
      setErrorMemberPopupMsg(
        "You cannot remove this member. A task must have at least one assigned user!"
      );
      setShowErrorMemberPopup(true);
    }
  };

  const handleDependancy = async (value) => {
    setDependancyValue(value);
    if (value === "Predecessor") {
      setDependancyTitle("Set Blocking Task");
    } else {
      setDependancyTitle("Set Subtask");
    }
    setShowDependancy(true);
  };

  const handleRemoveDependancy = async (taskid, value) => {
    let parentid = "";
    let childid = "";

    if (value === "Predecessor") {
      parentid = taskid;
      childid = taskData.id;
    } else {
      parentid = taskData.id;
      childid = taskid;
    }

    await fetch(
      `http://localhost:6262/tasks/delete-by-task?parent_task_id=${parentid}&child_task_id=${childid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetchTaskInformation(taskData.id)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dependency removed:", data);
      })
      .catch((error) => {
        console.error("Error removing dependency:", error);
      });
  };

  const handleApproval = async (value) => {
    var status = "";
    if (value === "Approved") {
      status = "Completed";
    } else {
      status = "In Progress";
    }
    try {
      const response = await fetch(
        `http://localhost:6262/tasks/updateStatus?taskid=${taskData.id}&status=${status}&order_no=1&projectid=${taskData.projectId}`,
        {
          method: "PUT",
        }
      );
      fetchTaskInformation(taskData.id);
      if (!response.ok) {
        console.error("Failed to update task status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (newStatus === "On Hold") {
      setShowReason(true); // Ensure popup opens immediately
    }

    try {
      const response = await fetch(
        `http://localhost:6262/tasks/updateStatus?taskid=${taskData.id}&status=${newStatus}&order_no=1&projectid=${taskData.projectId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        console.error("Failed to update task status:", response.statusText);
      }

      fetchTaskInformation(taskData.id);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTaskData = async () => {
    setConfirmDTitle("Delete Task");
    setConfirmDMsg("Are you sure do you want to delete this task?");
    setShowDConfirmation(true);
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "All Projects", path: "/projects" },
          {
            label: projectName,
            path: "/projects/project",
            state: { projectid },
          },
          {
            label: "Tasks",
            path: "/projects/project/allTasks",
            state: { projectid, projectName },
          },
          { label: taskData?.tskid },
        ]}
      />
      <div className="w-full xl:flex xl:justify-between block gap-4">
        <div
          className="w-[100%] xl:w-[68%] bg-white rounded-lg px-6 py-5"
          style={{
            boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="text-xs lg:text-sm mb-1 flex justify-between items-start">
            <p>{taskData.tskid}</p>
            <div className="flex items-center gap-x-2">
              {" "}
              <RiEdit2Fill
                onClick={() => setShowEditTask(true)}
                className="text-sm lg:text-base text-[#18636f] cursor-pointer"
              />
              <MdDelete
                onClick={() => handleDeleteTaskData()}
                className="text-sm lg:text-base text-red-600 cursor-pointer"
              />
            </div>
          </div>
          <p className="text-sm lg:text-base font-semibold">{taskData.title}</p>
          {taskData.status === "Review" &&
          taskData.approver === localStorage.getItem("userId") ? (
            <div className="flex items-center gap-x-2">
              <button
                className="flex items-center py-1 px-3 text-[10px] text-xs rounded-md text-white bg-green-500"
                onClick={() => handleApproval("Approved")}
              >
                Approve
              </button>
              <button
                className="flex items-center py-1 px-3 text-[10px] text-xs rounded-md text-white bg-red-500"
                onClick={() => handleApproval("Rejected")}
              >
                Reject
              </button>
            </div>
          ) : (
            ""
          )}
          {taskData.milestone && (
            <div className="flex items-center gap-x-2 border w-fit px-3 rounded-md mt-4 border-gray-800">
              <div className="py-1.5 lg:!py-3 text-[10px] lg:!text-xs font-medium text-gray-500">
                <div className="flex items-center gap-x-2">
                  <MdOutlineEmojiFlags className="text-xs lg:text-sm xl:text-base" />

                  <p>Milestone - </p>
                </div>{" "}
              </div>
              <div>
                <p className="text-[10px] lg:text-xs">{taskData.milestone}</p>
              </div>
            </div>
          )}
          <div className="my-2">
            <div className="flex items-center gap-x-2 py-1.5 lg:!py-3 text-[10px] lg:!text-xs font-medium text-gray-500">
              <TiDocumentText className="text-xs lg:text-sm xl:text-base" />
              <p>Description</p>
            </div>
            <textarea
              name="description"
              value={taskData.description}
              className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-200 rounded-md lg:rounded-lg bg-white"
              rows="5"
              disabled
            ></textarea>
          </div>
          <div>
            {" "}
            {taskData.status === "On Hold" && taskData.reason ? (
              <div className="py-[2px] my-1 px-2 rounded-md bg-red-200 text-red-500 w-fit text-[9px] lg:text-[11px] flex gap-x-1 items-start">
                <span className="pt-[3px]">
                  <FaCircleExclamation />
                </span>
                <p>{taskData.reason}</p>
              </div>
            ) : (
              ""
            )}
            {taskData.status === "Completed" && (
              <div>
                {(() => {
                  const dueDate = new Date(taskData.dueDate);
                  const completedOn = new Date(taskData.completdOn);

                  dueDate.setHours(23, 59, 59, 999);

                  const diffInHours =
                    (dueDate - completedOn) / (1000 * 60 * 60);

                  return diffInHours > 0 ? (
                    <p className="text-white bg-green-500 rounded-full py-1 px-3 w-fit text-[10px] lg:text-xs my-2">
                      {diffInHours.toFixed(2)} hrs saved
                    </p>
                  ) : (
                    <p className="text-white bg-red-500 rounded-full py-1 px-3 w-fit text-[10px] lg:text-xs my-2">
                      {Math.abs(diffInHours).toFixed(2)} hrs delayed
                    </p>
                  );
                })()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-2 mt-4 mb-2">
            <FcBusinessman className="h-4 w-4" />
            <p className="text-xs lg:!text-sm font-semibold">Task Assignees</p>
          </div>
          <div>
            <div className="flex flex-wrap items-start gap-2">
              {(taskData?.usersAssigned || []).map((user) => (
                <div
                  key={user.userid}
                  className="flex items-center space-x-1 py-0.5 lg:py-1 px-1.5 lg:px-2 rounded-md bg-gray-200"
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
                  <button onClick={() => Data(user.userid)}>
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
        <div
          className="w-[100%] xl:w-[32%] bg-white rounded-lg px-6 py-5 mt-4 xl:mt-0"
          style={{
            boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div>
            <div className="flex items-center gap-x-2 mb-2">
              <FcSurvey className="h-4 w-4" />
              <p className="text-xs lg:!text-sm font-semibold my-2">
                Task Information
              </p>
            </div>
            <div className="grid xl:grid-cols-1 gap-4 grid-cols-2 mb-2 lg:mb-4">
              {[
                {
                  icon: <FaRegCircle className="text-[10px] lg:text-xs" />,
                  label: "Status",
                  value: (
                    <div className="flex items-center gap-x-1">
                      {taskData.status === "To Do" ? (
                        <AiOutlineClockCircle className="text-blue-500 text-[10px] lg:text-xs" />
                      ) : taskData.status === "In Progress" ? (
                        <LuCircleDot className="text-orange-400 text-[10px] lg:text-xs" />
                      ) : taskData.status === "Review" ? (
                        <AiOutlineTrademarkCircle className="text-[#ce53ff] text-[10px] lg:text-xs" />
                      ) : taskData.status === "Completed" ? (
                        <AiOutlineCheckCircle className="text-green-500 text-[10px] lg:text-xs" />
                      ) : taskData.status === "On Hold" ? (
                        <AiOutlinePauseCircle className="text-gray-700 text-[10px] lg:text-xs" />
                      ) : (
                        <AiOutlineExclamationCircle className="text-red-600 text-[10px] lg:text-xs" />
                      )}
                      <select
                        value={taskData.status}
                        onChange={(e) => handleStatusChange(e)}
                        className="bg-transparent border-none text-gray-700 text-[10px] lg:text-xs"
                      >
                        {[
                          "To Do",
                          "In Progress",
                          "Review",
                          "Completed",
                          "On Hold",
                          "Overdue",
                        ].map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="text-[10px] lg:text-xs"
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  ),
                },
                {
                  icon: <FaRegCalendar className="text-[10px] lg:text-xs" />,
                  label: "Start Date",
                  value: formatDate(taskData.startDate),
                },
                {
                  icon: <MdDateRange className="text-[10px] lg:text-xs" />,
                  label: "Due Date",
                  value: formatDate(taskData.dueDate),
                },
                {
                  icon: <FiAlertTriangle className="text-[10px] lg:text-xs" />,
                  label: "Priority",
                  value: (
                    <div
                      className={`flex items-center gap-x-1 w-fit px-2 py-[1px] rounded-md text-[10px] lg:text-xs ${
                        taskData.priority === "Low"
                          ? "bg-blue-200 text-blue-700"
                          : taskData.priority === "Medium"
                          ? "bg-green-200 text-green-700"
                          : taskData.priority === "High"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      <GoDotFill className="text-[8px] lg:text-[10px]" />
                      <p className="text-[10px] lg:text-xs">
                        {taskData.priority}
                      </p>
                    </div>
                  ),
                },
                {
                  icon: <MdStart className="text-[10px] lg:text-xs" />,
                  label: "Started At",
                  value: taskData.startedOn
                    ? formatDateTime(taskData.startedOn)
                    : "---",
                },
                {
                  icon: (
                    <MdOutlineFileDownloadDone className="text-[10px] lg:text-xs" />
                  ),
                  label: "Completed At",
                  value: taskData.completdOn
                    ? formatDateTime(taskData.completdOn)
                    : "---",
                },
                {
                  icon: <FaHourglassStart className="text-[10px] lg:text-xs" />,
                  label: "Hours Worked",
                  value: taskData.startedOn
                    ? `${(
                        (new Date() - new Date(taskData?.startedOn)) /
                        (1000 * 60 * 60)
                      ).toFixed(2)} hrs`
                    : "---",
                },
                {
                  icon: <FaRegClock className="text-[10px] lg:text-xs" />,
                  label: "Hours Left",
                  value: (() => {
                    if (taskData.status === "Completed") return "---";

                    const now = new Date();
                    const dueDate = new Date(taskData.dueDate);

                    dueDate.setHours(23, 59, 59, 999);

                    const today = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate()
                    );
                    const targetDate = new Date(
                      dueDate.getFullYear(),
                      dueDate.getMonth(),
                      dueDate.getDate()
                    );

                    if (targetDate < today) {
                      return "Overdue";
                    }

                    const hoursLeft = (dueDate - now) / (1000 * 60 * 60);
                    return `${hoursLeft.toFixed(2)} hrs remaining`;
                  })(),
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center my-1">
                  <div className="flex items-center gap-x-2 w-1/3">
                    {item.icon}
                    <p className="text-[10px] lg:text-xs text-gray-500">
                      {item.label}
                    </p>
                  </div>
                  <div className="px-3 text-[10px] lg:text-xs">:</div>
                  <div className="text-[10px] lg:text-xs">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between gap-4 mt-4">
        <div
          className="w-[50%] bg-white rounded-lg p-4 "
          style={{
            boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex items-center gap-x-2 mb-3 lg:mb-4">
            <FcTodoList className="h-4 w-4" />
            <p className="text-xs lg:!text-sm font-semibold">Checklists</p>
          </div>{" "}
          <div className="h-56 lg:h-64 overflow-auto px-2">
            {[...(taskData?.checklist || [])]
              .sort((a, b) => {
                if (a.status === "Completed" && b.status !== "Completed")
                  return 1;
                if (a.status !== "Completed" && b.status === "Completed")
                  return -1;
                return b.checklistid - a.checklistid;
              })
              .map((list, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between mb-2 rounded lg:rounded-md bg-gray-100 py-1 lg:py-1.5 px-1.5 lg:px-2"
                >
                  <div
                    className={`flex items-center text-[10px] lg:text-xs gap-x-2 ${
                      list.status === "Completed"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() =>
                        handleStatusToggle(list.checklistid, list.status)
                      }
                    >
                      {list.status === "Completed" ? (
                        <FiCheckCircle className="text-green-600 cursor-pointer" />
                      ) : (
                        <FiCircle className="cursor-pointer" />
                      )}
                    </button>
                    <input
                      type="text"
                      maxLength={30}
                      value={list.title}
                      onChange={(e) =>
                        handleChangeTitle(list.checklistid, e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleTitleKeyPress(e, list.checklistid)
                      }
                      className="bg-transparent border-none outline-none w-32 lg:w-56 xl:w-64"
                    />
                  </div>
                  <button>
                    <TiDeleteOutline
                      className="text-red-500 text-sm lg:text-base"
                      onClick={() => DataChecklist(list.checklistid)}
                    />
                  </button>
                </div>
              ))}

            <div className="flex items-center text-[10px] lg:text-xs my-2 gap-x-2 py-1 lg:py-2 px-1 lg:px-2.5">
              <button onClick={() => handleAddItem()}>
                <FiCircle className="cursor-pointer" />
              </button>

              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={handleNewItemKeyPress}
                className="bg-transparent border-none outline-none"
                placeholder="Add Item (max 30 char)"
              />
            </div>
          </div>
        </div>
        <div
          className="w-[50%] bg-white rounded-lg p-4 "
          style={{
            boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex items-center gap-x-2 mb-2">
            <FcAbout className="h-4 w-4" />
            <p className="text-xs lg:!text-sm font-semibold">Comments</p>
          </div>{" "}
          <div className="h-56 lg:h-64 overflow-auto px-2">
            {" "}
            {!editComment && (
              <>
                <div className="flex w-full items-center gap-x-2 py-1.5 lg:!py-3 text-[10px] lg:!text-xs font-medium text-gray-500">
                  <p>Add New Comment</p>
                </div>
                <textarea
                  name="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg bg-white"
                  rows="3"
                  maxLength={70}
                ></textarea>
              </>
            )}
            {(taskData?.comments || [])
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((list, index) => (
                <div key={index} className="mb-2 py-1 lg:py-2 border-b">
                  <div className="flex items-start gap-x-1">
                    {list.user.file ? (
                      <img
                        src={`data:image/jpeg;base64,${list.user.file}`}
                        alt={list.user.first_name || "User"}
                        className="w-4 lg:w-6 h-4 lg:h-6 border border-white rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-4 lg:w-6 h-4 lg:h-6 border border-white rounded-full text-gray-400" />
                    )}
                    <div className="w-full">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] lg:text-xs font-medium">
                          {list.user.first_name} {list.user.last_name}
                        </p>
                        <p className="text-[8px] lg:text-[10px] text-gray-500">
                          {new Date(list.created_at).toLocaleString()}
                        </p>
                      </div>

                      {editComment === list.commentid ? (
                        <textarea
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          onKeyDown={(e) =>
                            handleEditKeyDown(e, list.commentid)
                          }
                          className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg bg-white"
                          rows="2"
                          maxLength={70}
                          autoFocus
                        />
                      ) : (
                        <p className="text-[11px] lg:text-sm text-gray-600">
                          {list.comment}
                        </p>
                      )}
                    </div>
                  </div>

                  {!editComment &&
                    localStorage.getItem("userId") === list.user.userid && (
                      <div className="flex items-center gap-x-2 justify-end">
                        <MdOutlineModeEdit
                          className="text-sm lg:text-base text-[#18636f] cursor-pointer"
                          onClick={() => {
                            setEditComment(list.commentid);
                            setEditedText(list.comment);
                          }}
                        />
                        <MdDeleteOutline
                          onClick={() => {
                            setCommentid(list.commentid);
                            DataComment();
                          }}
                          className="text-sm lg:text-base text-red-600 cursor-pointer"
                        />
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="w-full xl:flex xl:justify-between block gap-4 mt-4">
        <div className="flex justify-between gap-4">
          <div
            className="w-[50%] bg-white rounded-lg p-3 lg:p-4"
            style={{
              boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="h-56 lg:h-64 overflow-auto px-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-x-2 mb-2">
                  <FcUp className="h-4 w-4" />
                  <p className="text-xs lg:!text-sm font-semibold">
                    Predecessor
                  </p>
                </div>
                <button
                  onClick={() => handleDependancy("Predecessor")}
                  className="text-[10px] lg:text-xs text-[#18636f] underline"
                >
                  + New
                </button>
              </div>
              <p className="text-[10px] lg:text-xs text-gray-500">
                The tasks that must be completed before this current task can
                proceed.{" "}
              </p>
              {taskData?.dependancy?.length > 0 ? (
                (taskData?.dependancy || []).map((list, index) => (
                  <div key={index} className="mb-2 py-1 lg:py-2 border-b">
                    <div className="flex items-start justify-between my-2 gap-x-2">
                      <p
                        className={`text-xs lg:text-sm ${
                          list.status === "Completed"
                            ? "line-through text-gray-500"
                            : ""
                        }`}
                      >
                        {list.title}
                      </p>
                      <button
                        onClick={() =>
                          handleRemoveDependancy(list.taskid, "Predecessor")
                        }
                        className="text-red-500 underline"
                      >
                        <RxLinkBreak1 className="text-base lg:text-lg" />
                      </button>
                    </div>
                    {list.status === "On Hold" && (
                      <div className="py-[2px] my-1 px-2 rounded-md bg-red-200 text-red-500 w-fit text-[9px] lg:text-[11px] flex gap-x-1 items-start">
                        <span className="pt-[3px]">
                          <FaCircleExclamation />
                        </span>
                        <p>{list.reason}</p>
                      </div>
                    )}

                    <div
                      className={`w-fit py-0.5 lg:py-1 px-3 lg:px-4 text-[8px] lg:text-[10px] rounded lg:rounded-md
                        ${
                          list.status === "To Do"
                            ? "bg-blue-200 text-blue-500"
                            : list.status === "In Progress"
                            ? "bg-orange-200 text-orange-400"
                            : list.status === "Review"
                            ? "bg-[#e7a9ff] text-[#9a2cc5]"
                            : list.status === "Completed"
                            ? "bg-green-200 text-green-500"
                            : list.status === "On Hold"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-red-300 text-red-600"
                        }`}
                    >
                      {list.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] lg:text-xs text-gray-500 text-center my-10">
                  No blocking tasks for this task
                </p>
              )}
            </div>
          </div>
          <div
            className="w-[50%] bg-white rounded-lg p-3 lg:p-4"
            style={{
              boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="h-56 lg:h-64 overflow-auto px-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-x-2 mb-2">
                  <FcDown className="h-4 w-4" />
                  <p className="text-xs lg:!text-sm font-semibold">Subtasks</p>
                </div>
                <button
                  onClick={() => handleDependancy("Subtasks")}
                  className="text-[10px] lg:text-xs text-[#18636f] underline"
                >
                  + New
                </button>
              </div>
              <p className="text-[10px] lg:text-xs text-gray-500">
                Tasks that cannot proceed until this task is completed.
              </p>
              {(taskData?.subtasks || []).length > 0 ? (
                (taskData?.subtasks || []).map((list, index) => (
                  <div key={index} className="mb-2 py-1 lg:py-2 border-b">
                    <div className="flex items-start justify-between my-2 gap-x-2">
                      <p
                        className={`text-xs lg:text-sm ${
                          list.status === "Completed"
                            ? "line-through text-gray-500"
                            : ""
                        }`}
                      >
                        {list.title}
                      </p>
                      <button
                        onClick={() =>
                          handleRemoveDependancy(list.taskid, "Subtasks")
                        }
                        className="text-red-500 underline"
                      >
                        <RxLinkBreak1 className="text-base lg:text-lg" />
                      </button>
                    </div>
                    {list.status === "On Hold" && (
                      <div className="py-[2px] my-1 px-2 rounded-md bg-red-200 text-red-500 w-fit text-[9px] lg:text-[11px] flex gap-x-1 items-start">
                        <span className="pt-[3px]">
                          <FaCircleExclamation />
                        </span>
                        <p>{list.reason}</p>
                      </div>
                    )}

                    <div
                      className={`w-fit py-0.5 lg:py-1 px-3 lg:px-4 text-[10px] lg:text-xs rounded lg:rounded-md
                          ${
                            list.status === "To Do"
                              ? "bg-blue-200 text-blue-500"
                              : list.status === "In Progress"
                              ? "bg-orange-200 text-orange-400"
                              : list.status === "Review"
                              ? "bg-[#e7a9ff] text-[#9a2cc5]"
                              : list.status === "Completed"
                              ? "bg-green-200 text-green-500"
                              : list.status === "On Hold"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-red-300 text-red-600"
                          }`}
                    >
                      {list.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] lg:text-xs text-gray-500 text-center my-10">
                  No subtasks available for this task
                </p>
              )}
            </div>
          </div>
        </div>
        <div
          className="w-[50%] xl:w-[33%] bg-white rounded-lg p-4 mt-4 xl:mt-0"
          style={{
            boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-x-2 ">
              <img src={Attachment} className="h-4 w-4" />
              <p className="text-xs lg:!text-sm font-semibold">Attachments</p>
            </div>
            <button
              onClick={() => setShowFileImport(true)}
              className="text-xs lg:!text-sm text-[#18636f] underline"
            >
              Upload
            </button>
          </div>{" "}
          <div className="h-56 lg:h-64 overflow-auto px-2">
            <div className="h-full overflow-auto">
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
                                  fetchDocument(attachment.id, attachment.name);
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
                      className="h-28 w-28 lg:!h-36 lg:!w-36 mx-auto"
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
      {showConfirmation && (
        <ConfirmationPopup
          title={confirmTitle}
          message={confirmMsg}
          onclose={hanldeConfirmation}
        />
      )}
      {showConfirmationAtc && (
        <ConfirmationPopup
          title={confirmTitleAtc}
          message={confirmMsgAtc}
          onclose={hanldeConfirmationAtc}
        />
      )}
      {showFileImport && (
        <FileParserTask
          closeModal={() => {
            fetchTaskAttachments(taskid);
            setTimeout(() => setShowFileImport(false), 100);
          }}
          taskid={taskData.id}
        />
      )}
      {showDependancy && (
        <Dependancies
          onClose={async () => {
            await fetchTaskInformation(taskData.id);
            setShowDependancy(false);
          }}
          title={dependancyTitle}
          taskId={taskData.id}
          value={dependancyValue}
          projectId={taskData.projectId}
        />
      )}

      {showReason && (
        <HoldReason
          onClose={() => {
            setShowReason(false);
            fetchTaskInformation(taskData.id);
          }}
          taskid={taskData.id}
        />
      )}
      {showEditTask && (
        <EditTask
          onClose={() => {
            setShowEditTask(false);
            fetchTaskInformation(taskData.id);
          }}
          taskid={taskData.id}
        />
      )}
      {showDConfirmation && (
        <ConfirmationPopup
          title={confirmDTitle}
          message={confirmDMsg}
          onclose={handleDeleteConfirmation}
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
      {showErrorMemberPopup && (
        <ErrorPopup
          title={ErrorMemberPopupTitle}
          message={ErrorMemberPopupMsg}
          onclose={() => {
            setShowErrorMemberPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskInformation;
