import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { ImInfo } from "react-icons/im";
import { FiSearch } from "react-icons/fi";

const Dependancies = ({ onClose, title, taskId, value, projectId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchTasks = async (searchQuery) => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `http://localhost:6262/tasks/tasksForDependency?projectid=${projectId}&taskid=${taskId}&type=${value}&search=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch task dependencies");
      }

      const data = await response.json();
      setTasks(data);
      setIsDropdownOpen(data.length > 0);
    } catch (error) {
      console.error("Error fetching task dependencies:", error);
    }
  };

  useEffect(() => {
    fetchTasks(search);
  }, [search]);

  const handleSelect = async (task) => {
    const parentTaskId = value === "Predecessor" ? task.id : taskId;
    const childTaskId = value === "Predecessor" ? taskId : task.id;

    await fetch(
      `http://localhost:6262/tasks/createDependancy?parent_task_id=${parentTaskId}&child_task_id=${childTaskId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Dependency created:", data);
      })
      .catch((error) => {
        console.error("Error creating dependency:", error);
      });

    setIsDropdownOpen(false);
    onClose();
  };

  const handleKeyDown = (event) => {
    if (tasks.length === 0) return;

    if (event.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < tasks.length - 1 ? prev + 1 : prev));
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      handleSelect(tasks[selectedIndex]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-72 lg:w-80 xl:w-96">
        <div className="flex justify-between mb-2">
          <p className="text-xs lg:text-sm font-semibold">{title}</p>
          <button
            onClick={onClose}
            className="text-sm lg:text-base xl:text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div className="mb-2">
            <label htmlFor="taskSearch" className="text-[10px] lg:text-xs">
              Search Task ID
            </label>
            <input
              type="text"
              id="taskSearch"
              className="w-full relative text-[10px] lg:text-xs py-1.5 lg:py-2 px-2 lg:px-3 border rounded-lg focus:outline-none focus:border-[#18636f]"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <FiSearch className="absolute top-[55%] right-3 text-sm lg:text-base text-gray-500" />
          </div>

          {isDropdownOpen && tasks.length > 0 && (
            <div className="absolute bg-white w-full border text-[10px] lg:text-xs border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedIndex === index ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleSelect(task)}
                >
                  {task.tskid}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 text-[10px] lg:text-xs text-gray-500 flex items-start gap-x-2">
          <ImInfo className="text-lg lg:text-xl " />
          {value === "Predecessor" ? (
            <p className="pt-[3px]">
              Choose the Appropriate Task ID to Set as the Predecessor Task,
              Ensuring Proper Task Sequence and Workflow Efficiency.
            </p>
          ) : (
            <p className="pt-[3px]">
              Select the Task ID to Define the Subtask, Creating a Clear
              Hierarchy and Streamlined Project Flow.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dependancies;
