import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { TbPlus } from "react-icons/tb";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineTrademarkCircle,
  AiOutlinePauseCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { LuCircleDot } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CustomDropdown from "./CustomDropdown";
import { FaRegCalendar } from "react-icons/fa6";
import CalendarPopup from "./CalendarPopup";
import TaskInfo from "./popups/TaskInfo";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import NewTask from "./popups/NewTask";
import HoldReason from "./popups/HoldReason";

const Tasks = () => {
  const location = useLocation();
  const { projectid, projectName } = location.state || {};
  const [view, setView] = useState("board");
  const [tasksData, setTasksData] = useState([]);
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    createdAfter: "",
  });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [filteredTasks, setfilteredTasks] = useState([]);
  const [taskid, setTaskid] = useState(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showTaskInfo, setShowTaskInfo] = useState(false);
  const [reasonTaskid, setReasonTaskid] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [newStatus, setNewStatus] = useState("To Do");
  const columns = [
    {
      title: "To Do",
      icon: <AiOutlineClockCircle className="text-blue-500" />,
      bgClass: "bg-blue-500",
    },
    {
      title: "In Progress",
      icon: <LuCircleDot className="text-orange-400" />,
      bgClass: "bg-orange-400",
    },
    {
      title: "Review",
      icon: <AiOutlineTrademarkCircle className="text-[#ce53ff]" />,
      bgClass: "bg-[#ce53ff]",
    },
    {
      title: "Completed",
      icon: <AiOutlineCheckCircle className="text-green-500" />,
      bgClass: "bg-green-500",
    },
    {
      title: "On Hold",
      icon: <AiOutlinePauseCircle className="text-gray-700" />,
      bgClass: "bg-gray-700",
    },
    {
      title: "Overdue",
      icon: <AiOutlineExclamationCircle className="text-red-600" />,
      bgClass: "bg-red-600",
    },
  ];

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

  useEffect(() => {
    fetchTasks(projectid);
  }, [projectid]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...tasksData].sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );

      if (filters.priority) {
        filtered = filtered.filter(
          (task) =>
            task.priority &&
            task.priority.toLowerCase() === filters.priority.toLowerCase()
        );
      }

      if (filters.status) {
        filtered = filtered.filter(
          (task) =>
            task.status &&
            task.status.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.createdAfter) {
        const createdAfterDate = new Date(filters.createdAfter);
        filtered = filtered.filter((task) => {
          const createdDate = new Date(task.created_at);
          return createdDate >= createdAfterDate;
        });
      }

      setfilteredTasks(filtered);
      setCurrentPage(1);
    };

    applyFilters();
  }, [filters, tasksData]);

  const handletasksPerPageChange = (event) => {
    setTasksPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return filteredTasks.slice(startIndex, endIndex);
  };

  const getColumnWidths = () => {
    const width = window.innerWidth;

    if (width <= 768) {
      return {
        tskid: "20%",
        title: "36%",
        startdate: "0%",
        duedate: "15%",
        status: "15%",
        priority: "",
        action: "10%",
      };
    } else if (width <= 1024) {
      return {
        tskid: "15%",
        title: "30%",
        duedate: "16%",
        status: "17%",
        startdate: "0%",
        priority: "12",
        action: "10%",
      };
    } else if (width <= 1440) {
      return {
        tskid: "12%",
        title: "23%",
        duedate: "15%",
        status: "15%",
        startdate: "15%",
        priority: "10",
        action: "10%",
      };
    } else {
      return {
        tskid: "20%",
        title: "20%",
        duedate: "20%",
        status: "15%",
        startdate: "15%",
        priority: "",
        action: "10%",
      };
    }
  };
  const columnWidths = getColumnWidths();

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const startRow = (currentPage - 1) * tasksPerPage + 1;
  const endRow = Math.min(currentPage * tasksPerPage, filteredTasks.length);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible((prev) => !prev);
  };

  const formatDate = (dateString) => {
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

  const handleViewChange = (newView) => setView(newView);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    setTasksData((prevTasks) => {
      const updatedTasks = [...prevTasks];

      let sourceTasks = updatedTasks
        .filter((task) => task.status === source.droppableId)
        .sort((a, b) => parseInt(a.order) - parseInt(b.order));

      const destinationTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : updatedTasks
              .filter((task) => task.status === destination.droppableId)
              .sort((a, b) => parseInt(a.order) - parseInt(b.order));

      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceTasks = null;
      } else {
        movedTask.status = destination.droppableId;
      }

      movedTask.order = destination.index + 1;
      destinationTasks.splice(destination.index, 0, movedTask);

      if (sourceTasks) {
        sourceTasks.forEach((task, index) => {
          task.order = index + 1;
        });
      }

      destinationTasks.forEach((task, index) => {
        task.order = index + 1;
      });

      const mergedTasks = updatedTasks.filter(
        (task) =>
          task.status !== source.droppableId &&
          task.status !== destination.droppableId
      );

      const newTaskList = [
        ...mergedTasks,
        ...(sourceTasks || []),
        ...destinationTasks,
      ];

      if (movedTask.status === "On Hold") {
        setReasonTaskid(movedTask.id);
        setShowReason(true);
      }

      updateTaskStatus(
        movedTask.id,
        movedTask.status,
        movedTask.order,
        projectid
      );

      return newTaskList;
    });
  };

  const updateTaskStatus = async (taskid, status, order_no, projectid) => {
    try {
      const response = await fetch(
        `http://localhost:6262/tasks/updateStatus?taskid=${taskid}&status=${status}&order_no=${order_no}&projectid=${projectid}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        console.error("Failed to update task status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasksData.filter((task) => task.status === status);
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

  const renderTaskItem = (task, index) => (
    <Draggable key={task.tskid} draggableId={task.tskid} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-2 lg:p-3 mb-2 lg:mb-3 rounded-md border"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[9px] lg:text-[11px] xl:text-xs text-gray-800 font-semibold">
              {task.tskid}
            </h3>
            <div
              className={`flex items-center px-1 lg:px-2 lg:py-[1px] xl:py-[2px] rounded lg:rounded-md ${
                task.priority === "Low"
                  ? "bg-blue-200 text-blue-700"
                  : task.priority === "Medium"
                  ? "bg-green-200 text-green-700"
                  : task.priority === "High"
                  ? "bg-yellow-200 text-yellow-700"
                  : "bg-red-200 text-red-700"
              }`}
            >
              <GoDotFill className="text-[8px] lg:text-[10px]" />
              <p className="text-[10px] lg:text-xs">{task.priority}</p>
            </div>
          </div>
          <p
            className={`text-[10px] lg:text-xs xl:text-sm mb-1 lg:mb-2 cursor-pointer hover:text-[#18636f] ${
              task.status === "Completed" ? "line-through text-gray-600" : ""
            }`}
          >
            {task.title}
          </p>
          <p className="text-[8px] lg:text-[10px] xl:text-[13px] text-gray-500 mb-1 lg:mb-2">
            {task.description.length > 100
              ? task.description.substring(0, 100) + "..."
              : task.description}
          </p>

          {task.status !== "Completed" ? (
            <p
              className={`text-[5px] lg:text-[7px] xl:!text-[9px] w-fit py-0.5 lg:py-1 px-3 lg:px-4 rounded-full text-white mb-2
    ${
      getTargetDateMessage(task.dueDate, task.status) === "Overdue"
        ? "bg-red-800"
        : getTargetDateMessage(task.dueDate, task.status) === "Today" ||
          getTargetDateMessage(task.dueDate, task.status) === "Tomorrow"
        ? "bg-red-600"
        : (function () {
            const diffTime = new Date(task.dueDate) - new Date();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 ? "bg-red-400" : "bg-[#63C0F9]";
          })()
    }`}
            >
              {getTargetDateMessage(task.dueDate, task.status)}
            </p>
          ) : (
            ""
          )}
          <div
            className={`flex border-t items-center pt-2 ${
              task.usersAssigned.length > 0 ? "justify-between" : "justify-end"
            }`}
          >
            {task.usersAssigned.length > 0 ? (
              <div className="flex items-center -space-x-2">
                {task.usersAssigned.slice(0, 3).map((user, idx) => (
                  <div key={idx} className="flex-shrink-0">
                    {user.file ? (
                      <img
                        src={`data:image/jpeg;base64,${user.file}`}
                        alt={user.name || "User"}
                        className="w-4 lg:w-6 h-4 lg:h-6 border border-white rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-4 lg:w-6 h-4 lg:h-6 border border-white rounded-full text-gray-400" />
                    )}
                  </div>
                ))}
                {task.usersAssigned.length > 3 && (
                  <div className="flex-shrink-0 w-4 lg:w-6 h-4 lg:h-6 bg-orange-300 text-gray-600 border border-white rounded-full flex items-center justify-center text-[8px] lg:text-[11px] font-medium">
                    +{task.usersAssigned.length - 3}
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            <button
              onClick={() => {
                setTaskid(task.id);
                setShowTaskInfo(true);
              }}
              className="text-[10px] lg:text-xs text-[#18636f] underline ml-2"
            >
              View
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );

  const renderColumn = (status, icon, colorClass) => (
    <div className="w-1/4">
      <div className="flex justify-between items-center text-xs xl:text-sm bg-gray-100 px-1.5 lg:px-2 xl:px-3 py-1 lg:py-1.5 xl:py-2 rounded-md">
        <div className="flex items-center gap-x-1 lg:gap-x-2">
          {icon}
          <div className="font-semibold flex items-center gap-x-1 lg:gap-x-2">
            <p>{status}</p>
            <p
              className={`h-3 xl:h-4 w-3 flex items-center justify-center xl:w-4 rounded lg:rounded-md ${colorClass} text-[10px] lg:text-xs text-white`}
            >
              {getTasksByStatus(status).length}
            </p>
          </div>
        </div>
        <TbPlus
          onClick={() => {
            setNewStatus(status);
            setShowNewTask(true);
          }}
          className="cursor-pointer"
        />
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="h-[400px] my-2 lg:my-3 lg:h-[500px] xl:[600px] overflow-auto no-bar"
          >
            {getTasksByStatus(status).map((task, index) => (
              <React.Fragment key={task.tskid}>
                {renderTaskItem(task, index)}
              </React.Fragment>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  const [visibleRange, setVisibleRange] = useState([0, 4]);

  const handleRightArrowClick = () => {
    if (visibleRange[1] < columns.length) {
      setVisibleRange([visibleRange[0] + 1, visibleRange[1] + 1]);
    }
  };

  const handleLeftArrowClick = () => {
    if (visibleRange[0] > 0) {
      setVisibleRange([visibleRange[0] - 1, visibleRange[1] - 1]);
    }
  };

  const isLeftArrowDisabled = visibleRange[0] === 0;
  const isRightArrowDisabled = visibleRange[1] === columns.length;

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
          { label: "Tasks" },
        ]}
      />
      <div
        className="w-full bg-white rounded-lg pt-3 lg:pt-5"
        style={{
          boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="flex justify-between items-center px-4 lg:px-6">
          <p className="mb-2 xl:mb-4 text-[11px] lg:text-xs xl:text-sm ">
            {projectName}'s Tasks ({tasksData.length} tasks)
          </p>
          {view === "grid" && (
            <p className="text-[10px] lg:!text-xs text-[#cecece]">
              {startRow}-{endRow} of {filteredTasks.length} projects
            </p>
          )}
        </div>
        <div className="flex justify-between items-center px-4 lg:px-6">
          <div className="flex space-x-4 lg:space-x-6 text-[10px] lg:text-xs xl:text-sm">
            <button
              className={`p-0.5 ${
                view === "board"
                  ? "border-b-2 border-b-[#18636f] text-[#18636f]"
                  : ""
              }`}
              onClick={() => handleViewChange("board")}
            >
              Board View
            </button>
            <button
              className={`p-0.5 ${
                view === "grid"
                  ? "border-b-2 border-b-[#18636f] text-[#18636f]"
                  : ""
              }`}
              onClick={() => handleViewChange("grid")}
            >
              Grid View
            </button>
          </div>
          <button
            type="submit"
            onClick={() => setShowNewTask(true)}
            className="bg-[#18636f] text-white text-[10px] lg:text-xs py-1 lg:py-1.5 px-3 lg:px-4 rounded-lg"
          >
            New Task
          </button>
        </div>
        <div className="mt-4 h-[70%]">
          {view === "board" && (
            <div className=" h-[75%]">
              <div className="flex items-center gap-x-2 text-lg justify-end px-4 lg:px-6 mb-2">
                <RxDoubleArrowLeft
                  onClick={handleLeftArrowClick}
                  className={`cursor-pointer ${
                    isLeftArrowDisabled ? "text-gray-200" : ""
                  }`}
                />
                <p className="text-xs lg:text-sm select-none">Status</p>
                <RxDoubleArrowRight
                  onClick={handleRightArrowClick}
                  className={`cursor-pointer ${
                    isRightArrowDisabled ? "text-gray-200" : ""
                  }`}
                />
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="w-full flex justify-between items-start gap-x-4 px-4 lg:px-6 pb-3 lg:pb-3">
                  {columns
                    .slice(visibleRange[0], visibleRange[1])
                    .map((column, index) => (
                      <React.Fragment key={column.title}>
                        {renderColumn(
                          column.title,
                          column.icon,
                          column.bgClass
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </DragDropContext>
            </div>
          )}
          {view === "grid" && (
            <div>
              {view === "grid" && (
                <div>
                  <div className="flex items-center justify-between px-4 lg:px-6 mb-3">
                    <div className="flex items-center justify-start gap-x-3">
                      <CustomDropdown
                        options={["All", "Urgent", "High", "Medium", "Low"]}
                        value={filters.priority}
                        onChange={(value) =>
                          handleFilterChange(
                            "priority",
                            value === "All" ? "" : value
                          )
                        }
                        placeholder="Priority"
                      />
                      <CustomDropdown
                        options={[
                          "All",
                          "Completed",
                          "To Do",
                          "In Progress",
                          "Review",
                          "On Hold",
                          "Overdue",
                        ]}
                        value={filters.status}
                        onChange={(value) =>
                          handleFilterChange(
                            "status",
                            value === "All" ? "" : value
                          )
                        }
                        placeholder="Status"
                      />
                    </div>
                    <div className="flex items-center relative">
                      <label className="text-[10px] lg:!text-xs px-2">
                        Created Date:
                      </label>
                      <input
                        type="text"
                        placeholder="01 Jan 2025"
                        value={filters.createdAfter}
                        onChange={(e) =>
                          handleFilterChange("createdAfter", e.target.value)
                        }
                        className="h-6 lg:!h-7 text-[8px] lg:!text-xs w-28 lg:!w-36 border border-gray-300 rounded-lg px-2 focus:outline-none focus:border-[#18636F]"
                      />
                      <button
                        onClick={toggleCalendarVisibility}
                        className="absolute right-2 lg:!right-3 cursor-pointer"
                      >
                        <FaRegCalendar className="text-[10px] lg:!text-xs text-[#18636F] " />
                      </button>
                      {isCalendarVisible && (
                        <CalendarPopup
                          style={{ top: "105%", right: "-2%" }}
                          selectedDate={filters.createdAfter}
                          onSelectDate={(date) => {
                            handleFilterChange("createdAfter", date);
                            setIsCalendarVisible(false);
                          }}
                          onClose={() => setIsCalendarVisible(false)}
                        />
                      )}
                    </div>
                  </div>
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100 text-xs lg:text-sm xl:text-base text-left border-y">
                        <th
                          className="px-3 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm"
                          style={{ width: columnWidths.tskid }}
                        >
                          Task Id
                        </th>
                        <th
                          className="py-2 lg:py-2.5 text-xs lg:text-sm"
                          style={{ width: columnWidths.title }}
                        >
                          Title
                        </th>

                        <th
                          className="py-2 lg:py-2.5 text-xs lg:text-sm"
                          style={{ width: columnWidths.status }}
                        >
                          Status
                        </th>
                        <th
                          className="py-2 lg:py-2.5 text-xs lg:text-sm hidden xl:table-cell"
                          style={{ width: columnWidths.startdate }}
                        >
                          Start Date
                        </th>
                        <th
                          className="py-2 lg:py-2.5 text-xs lg:text-sm"
                          style={{ width: columnWidths.duedate }}
                        >
                          Due Date
                        </th>
                        <th
                          className="py-2 lg:py-2.5 text-xs lg:text-sm hidden lg:table-cell"
                          style={{ width: columnWidths.priority }}
                        >
                          Priority
                        </th>
                        <th
                          className="py-2 lg:py-2.5 text-xs lg:text-sm"
                          style={{ width: columnWidths.action }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedData().length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-28 lg:!py-40 text-gray-500"
                          >
                            <p className="text-[10px] lg:!text-xs">
                              No tasks available. Please check back later.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        getPaginatedData().map((task, index) => (
                          <tr
                            key={task.tskid}
                            className="border-y text-xs lg:text-sm "
                          >
                            <td
                              className={`px-3 lg:px-5 py-2 lg:py-2.5 ${
                                task.status === "Completed"
                                  ? "text-gray-500"
                                  : ""
                              }`}
                              style={{ width: columnWidths.tskid }}
                            >
                              {task.tskid}
                            </td>
                            <td
                              className={`py-2 lg:py-2.5 ${
                                task.status === "Completed"
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                              style={{ width: columnWidths.title }}
                            >
                              {task.title.length > 38
                                ? `${task.title.slice(0, 35)}...`
                                : task.title}
                            </td>
                            <td
                              className={`py-2 lg:py-2.5 ${
                                task.status === "Completed"
                                  ? "text-gray-500"
                                  : ""
                              }`}
                              style={{ width: columnWidths.status }}
                            >
                              <div className="flex items-center gap-x-2">
                                {task.status === "To Do" ? (
                                  <AiOutlineClockCircle className="text-blue-600" />
                                ) : task.status === "In Progress" ? (
                                  <LuCircleDot className="text-orange-500" />
                                ) : task.status === "Review" ? (
                                  <AiOutlineTrademarkCircle className="text-gray-600" />
                                ) : (
                                  <AiOutlineCheckCircle className="text-green-600" />
                                )}
                                {task.status}
                              </div>
                            </td>
                            <td
                              className={`py-2 lg:py-2.5 hidden xl:table-cell ${
                                task.status === "Completed"
                                  ? "text-gray-500"
                                  : ""
                              }`}
                              style={{ width: columnWidths.startdate }}
                            >
                              {formatDate(task.startDate)}
                            </td>
                            <td
                              className={`py-2 lg:py-2.5 ${
                                task.status === "Completed"
                                  ? "text-gray-500"
                                  : ""
                              }`}
                              style={{ width: columnWidths.duedate }}
                            >
                              {formatDate(task.dueDate)}
                            </td>
                            <td
                              className="py-2 lg:py-2.5  hidden lg:table-cell"
                              style={{ width: columnWidths.priority }}
                            >
                              <div
                                className={`flex items-center justify-center w-fit px-1 lg:px-2 lg:py-[1px] xl:py-[2px] rounded lg:rounded-md ${
                                  task.priority === "Low"
                                    ? "bg-blue-200 text-blue-700"
                                    : task.priority === "Medium"
                                    ? "bg-green-200 text-green-700"
                                    : task.priority === "High"
                                    ? "bg-yellow-200 text-yellow-700"
                                    : "bg-red-200 text-red-700"
                                }`}
                              >
                                <GoDotFill className="text-[8px] lg:text-[10px]" />
                                <p className="text-[10px] lg:text-xs">
                                  {task.priority}
                                </p>
                              </div>
                            </td>
                            <td style={{ width: columnWidths.action }}>
                              <button
                                onClick={() => {
                                  setTaskid(task.id);
                                  setShowTaskInfo(true);
                                }}
                                className="px-1 lg:px-2 py-2 lg:py-2.5 text-[#18636f] underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                      {getPaginatedData().length < 10 &&
                      getPaginatedData().length !== 0
                        ? Array.from({
                            length: 9 - getPaginatedData().length,
                          }).map((_, index) => (
                            <tr
                              key={`empty-row-${index}`}
                              className="h-[25px] lg:!h-[35px] xl:!h-[47px] "
                            >
                              <td
                                colSpan="6"
                                className="text-transparent border-none"
                              ></td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {view === "grid" && (
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-x-2 text-[10px] lg:!text-xs select-none">
            <p>No of tasks per page: </p>
            <select
              value={tasksPerPage}
              onChange={handletasksPerPageChange}
              className="border rounded-md"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="text-[10px] lg:!text-xs select-none">
            <button
              disabled={currentPage === 1}
              className={`pr-1 ${currentPage === 1 ? "text-gray-400" : ""}`}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            {totalPages <= 5 ? (
              Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  disabled={currentPage === idx + 1}
                  className="h-4 w-4 lg:!h-6 lg:!w-6 rounded lg:!rounded-md mx-1"
                  style={{
                    backgroundColor:
                      currentPage === idx + 1 ? "#18636F" : "transparent",
                    border:
                      currentPage !== idx + 1
                        ? "1px solid black"
                        : "1px solid #18636F",
                    color: currentPage === idx + 1 ? "white" : "black",
                  }}
                >
                  {idx + 1}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="h-4 w-4 lg:!h-6 lg:!w-6 rounded lg:!rounded-md mx-1"
                  style={{
                    backgroundColor:
                      currentPage === 1 ? "#18636F" : "transparent",
                    border:
                      currentPage !== 1
                        ? "1px solid black"
                        : "1px solid #18636F",
                    color: currentPage === 1 ? "white" : "black",
                  }}
                >
                  1
                </button>

                {currentPage > 3 && <span>...</span>}

                {Array.from({ length: 3 }).map((_, idx) => {
                  const pageNumber = currentPage - 1 + idx;
                  if (pageNumber >= 2 && pageNumber <= totalPages - 1) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        disabled={currentPage === pageNumber}
                        className="h-4 w-4 lg:!h-6 lg:!w-6 rounded lg:!rounded-md mx-1"
                        style={{
                          backgroundColor:
                            currentPage === pageNumber
                              ? "#18636F"
                              : "transparent",
                          border:
                            currentPage !== pageNumber
                              ? "1px solid black"
                              : "none",
                          color: currentPage === pageNumber ? "white" : "black",
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  return null;
                })}

                {currentPage < totalPages - 2 && <span>...</span>}

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="h-4 w-4 lg:!h-6 lg:!w-6 rounded lg:!rounded-md mx-1"
                  style={{
                    backgroundColor:
                      currentPage === totalPages ? "#18636F" : "transparent",
                    border:
                      currentPage !== totalPages
                        ? "1px solid black"
                        : "1px solid #18636F",
                    color: currentPage === totalPages ? "white" : "black",
                  }}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              disabled={currentPage === totalPages}
              className={`pl-1 ${
                currentPage === totalPages ? "text-gray-400" : ""
              }`}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {showTaskInfo && (
        <TaskInfo
          onClose={() => setShowTaskInfo(false)}
          taskid={taskid}
          projectName={projectName}
          handleTaskChange={() => fetchTasks(projectid)}
        />
      )}
      {showNewTask && (
        <NewTask
          onClose={() => {
            setShowNewTask(false);
            fetchTasks(projectid);
          }}
          projectid={projectid}
          status={newStatus}
        />
      )}
      {showReason && (
        <HoldReason
          onClose={() => setShowReason(false)}
          taskid={reasonTaskid}
        />
      )}
    </div>
  );
};

export default Tasks;
