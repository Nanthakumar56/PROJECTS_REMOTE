import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegCircle, FaUserCircle } from "react-icons/fa";
import { FaRegCalendar } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { TiDocumentText } from "react-icons/ti";
import { GoDotFill } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
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
import ConfirmationPopup from "./ConfirmationPopup";
import { RiExpandDiagonal2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FcApproval, FcCancel } from "react-icons/fc";
import HoldReason from "./HoldReason";
import EditTask from "./EditTask";
import ErrorPopup from "./ErrorPopup";

const TaskInfo = ({ onClose, taskid, projectName, handleTaskChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("checklist");
  const [newItem, setNewItem] = useState("");
  const [taskData, setTaskData] = useState(
    { checklist: [] },
    { usersAssigned: [] }
  );
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [commentid, setCommentid] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteText, setInviteText] = useState("");
  const [userIds, setUserIds] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showReason, setShowReason] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const dropdownRef = useRef(null);
  const [confirmDTitle, setConfirmDTitle] = useState("");
  const [confirmDMsg, setConfirmDMsg] = useState("");
  const [showDConfirmation, setShowDConfirmation] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [ErrorPopupTitle, setErrorPopupTitle] = useState(null);
  const [ErrorPopupMsg, setErrorPopupMsg] = useState(null);
  const [showErrorMemberPopup, setShowErrorMemberPopup] = useState(false);
  const [ErrorMemberPopupTitle, setErrorMemberPopupTitle] = useState(null);
  const [ErrorMemberPopupMsg, setErrorMemberPopupMsg] = useState(null);

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsInviting(false);
      }
    };

    if (isInviting) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInviting]);

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
      handleTaskChange();
      setIsInviting(false);
    } catch (error) {
      console.error("Error adding task member:", error);
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    fetchTaskInformation(taskid);
  }, [taskid]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
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

  const handleDeleteChecklist = async (id) => {
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
        console.log(newChecklistItem);
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

  const handleDeleteComment = () => {
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

  const handleDelete = async (userid) => {
    if (taskData.usersAssigned.length > 1) {
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

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (newStatus === "On Hold") {
      setShowReason(true);
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

      handleTaskChange();
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
          onClose();
          handleTaskChange();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setShowDConfirmation(false);
    }
  };

  return (
    <div
      id="fileParserModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end items-center z-50"
    >
      <div
        className={`bg-white overflow-auto p-3 lg:p-4 w-[250px] lg:w-[350px] xl:!w-[450px] h-full transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: "0px 2.1px 10px -1.05px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="flex justify-between pb-3 border-b">
          <div className="flex items-center gap-x-2">
            <RiExpandDiagonal2Line
              onClick={() =>
                navigate("task", {
                  state: {
                    taskid,
                    projectid: taskData.projectId,
                    projectName: projectName,
                  },
                })
              }
              className="text-sm lg:text-base text-[#18636f] cursor-pointer"
            />
            <p className="text-[10px] lg:text-xs">Task Information</p>
          </div>
          <button
            onClick={handleClose}
            className="text-sm lg:!text-base xl:!text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>
        <div className="px-2">
          <div className="text-xs lg:text-sm mt-2 lg:mt-4 mb-1 flex justify-between items-start">
            <p>{taskData.title}</p>
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
          <table className="border-collapse text-sm">
            <tbody>
              <tr>
                <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-x-2">
                    <FaRegCircle className="text-xs lg:text-sm xl:text-base" />
                    <p>Status</p>
                  </div>
                </td>
                <td className="px-3">:</td>
                <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs">
                  <div className="flex items-center gap-x-1">
                    {taskData.status === "To Do" ? (
                      <AiOutlineClockCircle className="text-blue-500" />
                    ) : taskData.status === "In Progress" ? (
                      <LuCircleDot className="text-orange-400" />
                    ) : taskData.status === "Review" ? (
                      <AiOutlineTrademarkCircle className="text-[#ce53ff]" />
                    ) : taskData.status === "Completed" ? (
                      <AiOutlineCheckCircle className="text-green-500" />
                    ) : taskData.status === "On Hold" ? (
                      <AiOutlinePauseCircle className="text-gray-700" />
                    ) : (
                      <AiOutlineExclamationCircle className="text-red-600" />
                    )}
                    <select
                      value={taskData.status}
                      onChange={(e) => handleStatusChange(e)}
                      className="bg-transparent border-none text-xs text-gray-700"
                    >
                      <option
                        value="To Do"
                        className=" flex items-center gap-x-1"
                      >
                        To Do
                      </option>
                      <option
                        value="In Progress"
                        className=" flex items-center gap-x-1"
                      >
                        In Progress
                      </option>
                      <option
                        value="Review"
                        className=" flex items-center gap-x-1"
                      >
                        Review
                      </option>
                      <option
                        value="Completed"
                        className=" flex items-center gap-x-1"
                      >
                        Completed
                      </option>
                      <option
                        value="On Hold"
                        className=" flex items-center gap-x-1"
                      >
                        On Hold
                      </option>
                      <option
                        value="Overdue"
                        className=" flex items-center gap-x-1"
                      >
                        Overdue
                      </option>
                    </select>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-x-2">
                    <FaRegCalendar className="text-xs lg:text-sm xl:text-base" />
                    <p>Due Date</p>
                  </div>{" "}
                </td>
                <td className="px-3">:</td>
                <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs">
                  {formatDate(taskData.dueDate)}
                </td>
              </tr>
              <tr>
                <td className="py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-x-2">
                    <FiAlertTriangle className="text-xs lg:text-sm xl:text-base" />
                    <p>Priority</p>
                  </div>{" "}
                </td>
                <td className="px-3">:</td>
                <td>
                  <div
                    className={`flex items-center gap-x-1 w-fit px-1 lg:px-2 lg:py-[1px] xl:py-[2px] rounded lg:rounded-md ${
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
                </td>
              </tr>
            </tbody>
          </table>

          <div className="my-2">
            <div className="flex items-center gap-x-2 py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
              <TiDocumentText className="text-xs lg:text-sm xl:text-base" />
              <p>Description</p>
            </div>
            <textarea
              name="description"
              value={taskData.description}
              className="w-full text-[10px] lg:text-xs py-1 lg:py-1.5 px-2 lg:px-3 border border-gray-300 rounded-md lg:rounded-lg bg-white"
              rows="3"
              disabled
            ></textarea>
          </div>
          <div className="my-2">
            <div className="flex items-center gap-x-2 text-gray-500 mb-2">
              <FiUsers className="text-xs lg:text-sm xl:text-base" />
              <p className="text-[10px] lg:text-xs ">Task Assignees</p>
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
                      {user.first_name}
                    </p>
                    <button onClick={() => handleDelete(user.userid)}>
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
          <div className="mt-4 lg:mt-6">
            <div className="flex justify-between items-center cursor-pointer text-[10px] lg:text-xs border-b">
              <button
                className={`py-1 ${
                  activeTab === "checklist"
                    ? "border-b-2 border-[#18636f] text-[#18636f]"
                    : ""
                }`}
                onClick={() => showTab("checklist")}
              >
                Checklists
              </button>
              <button
                className={`py-1  ${
                  activeTab === "blocking"
                    ? "border-b-2 border-[#18636f] text-[#18636f]"
                    : ""
                }`}
                onClick={() => showTab("blocking")}
              >
                Predecessor
              </button>
              <button
                className={`py-1  ${
                  activeTab === "dependent"
                    ? "border-b-2 border-[#18636f] text-[#18636f]"
                    : ""
                }`}
                onClick={() => showTab("dependent")}
              >
                Subtask
              </button>
              <button
                className={`py-1  ${
                  activeTab === "comments"
                    ? "border-b-2 border-[#18636f] text-[#18636f]"
                    : ""
                }`}
                onClick={() => showTab("comments")}
              >
                Comments
              </button>
            </div>
            <div className="tab-content mt-4">
              {activeTab === "checklist" && (
                <div className="">
                  {(taskData?.checklist || []).map((list, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between mb-2 rounded lg:rounded-md bg-gray-100 py-1 lg:py-2 px-2.5 lg:px-4"
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
                          onClick={() =>
                            handleDeleteChecklist(list.checklistid)
                          }
                        />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center text-[10px] lg:text-xs my-2 gap-x-2  py-1 lg:py-2 px-2.5 lg:px-4">
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
              )}
              {activeTab === "blocking" && (
                <div>
                  {taskData?.dependancy?.length > 0 ? (
                    (taskData?.dependancy || []).map((list, index) => (
                      <div
                        key={index}
                        className="mb-2 py-1 lg:py-2 px-2.5 lg:px-4 border-b"
                      >
                        <p
                          className={`text-xs lg:text-sm ${
                            list.status === "Completed"
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {list.title}
                        </p>
                        {list.status === "On Hold" && (
                          <div className="py-[2px] my-1 px-2 rounded-md bg-red-200 text-red-500 w-fit text-[9px] lg:text-[11px] flex gap-x-1 items-start">
                            <span className="pt-[3px]">
                              <FaCircleExclamation />
                            </span>
                            <p>{list.reason}</p>
                          </div>
                        )}
                        <p className="text-[10px] lg:text-xs text-gray-500 mb-2">
                          {list.description}
                        </p>
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
                      No blocking tasks for this task
                    </p>
                  )}
                </div>
              )}
              {activeTab === "dependent" && (
                <div>
                  {(taskData?.subtasks || []).length > 0 ? (
                    (taskData?.subtasks || []).map((list, index) => (
                      <div
                        key={index}
                        className="mb-2 py-1 lg:py-2 px-2.5 lg:px-4 border-b"
                      >
                        <p
                          className={`text-xs lg:text-sm ${
                            list.status === "Completed"
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {list.title}
                        </p>

                        {list.status === "On Hold" && (
                          <div className="py-[2px] my-1 px-2 rounded-md bg-red-200 text-red-500 w-fit text-[9px] lg:text-[11px] flex gap-x-1 items-start">
                            <span className="pt-[3px]">
                              <FaCircleExclamation />
                            </span>
                            <p>{list.reason}</p>
                          </div>
                        )}

                        <p className="text-[10px] lg:text-xs text-gray-500 mb-2">
                          {list.description}
                        </p>

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
              )}
              {activeTab === "comments" && (
                <div>
                  {!editComment && (
                    <>
                      <div className="flex w-full items-center gap-x-2 py-1 lg:!py-2 text-[10px] lg:!text-xs font-medium text-gray-500">
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
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    .map((list, index) => (
                      <div key={index} className="mb-2 py-1 lg:py-2 border-b">
                        <div className="flex items-start gap-x-1">
                          {list.user.file ? (
                            <img
                              src={`data:image/jpeg;base64,${list.user.file}`}
                              alt={list.user.first_name || "User"}
                              className="w-3 lg:w-4 h-3 lg:h-4 border border-white rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="w-3 lg:w-4 h-3 lg:h-4 border border-white rounded-full text-gray-400" />
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
                          localStorage.getItem("userId") ===
                            list.user.userid && (
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
                                  handleDeleteComment();
                                }}
                                className="text-sm lg:text-base text-red-600 cursor-pointer"
                              />
                            </div>
                          )}
                      </div>
                    ))}
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
      {showReason && (
        <HoldReason onClose={() => setShowReason(false)} taskid={taskData.id} />
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

export default TaskInfo;
