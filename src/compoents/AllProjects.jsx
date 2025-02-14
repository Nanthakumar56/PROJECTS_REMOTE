import React, {
  lazy,
  useCallback,
  useEffect,
  projectef,
  useState,
} from "react";
import Breadcrumbs from "./Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaRegCalendar } from "react-icons/fa6";
import CalendarPopup from "./CalendarPopup";
import { LuArrowUpDown } from "react-icons/lu";
import { BiSolidEditAlt } from "react-icons/bi";
import CustomDropdown from "./CustomDropdown";
import { FaRegDotCircle } from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { FaExclamation } from "react-icons/fa";
import NewProject from "./popups/NewProject";
import EditProject from "./popups/EditProject";

const AllProjects = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [ProjectsData, setProjectsData] = useState([]);
  const [showNewproject, setShowNewproject] = useState(false);
  const [projectid, setprojectid] = useState(null);
  const [editProjectid, setEditProjectid] = useState(null);
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    createdAfter: "",
  });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(10);
  const [showEditprojectForm, setShowEditprojectForm] = useState(false);

  const fetchProjectsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5858/projects/allProjects"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const sortedData = data.sort((a, b) =>
        (a.projectname || "").localeCompare(b.projectname || "")
      );

      setProjectsData(sortedData);
      setFilteredProjects(sortedData);
    } catch (error) {
      console.error("Failed to fetch Projects:", error);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...ProjectsData];

      if (searchQuery) {
        filtered = filtered.filter((project) =>
          (project.projectname || "").toLowerCase().includes(searchQuery)
        );
      }

      if (filters.priority) {
        filtered = filtered.filter(
          (project) =>
            project.priority &&
            project.priority.toLowerCase() === filters.priority.toLowerCase()
        );
      }

      if (filters.status) {
        filtered = filtered.filter(
          (project) =>
            project.status &&
            project.status.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.createdAfter) {
        const createdAfterDate = new Date(filters.createdAfter);
        filtered = filtered.filter((project) => {
          const createdDate = new Date(project.created_at);
          return createdDate >= createdAfterDate;
        });
      }

      setFilteredProjects(filtered);
      setCurrentPage(1);
    };

    applyFilters();
  }, [searchQuery, filters, ProjectsData]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
    const filtered = ProjectsData.filter((project) =>
      (project.projectname || "").toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  };

  const handleViewproject = (projectid) => {
    navigate("project/", { state: { projectid } });
  };

  const getStatusBgColor = (status) => {
    switch (status.toLowerCase()) {
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
    switch (priority.toLowerCase()) {
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

  const handleSortChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      const nameA = (a.projectname || "").toLowerCase();
      const nameB = (b.projectname || "").toLowerCase();

      if (newSortOrder === "asc") {
        return nameA > nameB ? 1 : -1;
      } else {
        return nameA < nameB ? 1 : -1;
      }
    });

    setFilteredProjects(sortedProjects);
  };

  const handleprojectsPerPageChange = (event) => {
    setProjectsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const startRow = (currentPage - 1) * projectsPerPage + 1;
  const endRow = Math.min(
    currentPage * projectsPerPage,
    filteredProjects.length
  );

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
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}-${month}-${year} `;
  };

  const getColumnWidths = () => {
    const width = window.innerWidth;

    if (width <= 768) {
      return {
        name: "36%",
        manager: "20%",
        members: "0%",
        date: "15%",
        status: "15%",
        priority: "",
        edit: "10%",
      };
    } else if (width <= 1024) {
      return {
        name: "30%",
        manager: "20%",
        date: "20%",
        status: "15%",
        members: "0%",
        priority: "",
        edit: "10%",
      };
    } else if (width <= 1440) {
      return {
        name: "25%",
        manager: "15%",
        date: "18%",
        status: "10%",
        members: "10%",
        priority: "12",
        edit: "10%",
      };
    } else {
      return {
        name: "20%",
        manager: "20%",
        date: "20%",
        status: "15%",
        members: "15%",
        priority: "",
        edit: "10%",
      };
    }
  };

  const columnWidths = getColumnWidths();

  const handleEditProject = (projectid) => {
    setEditProjectid(projectid);
    setShowEditprojectForm(true);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "All Projects" }]} />
      <div
        className="bg-[#ffffff] rounded-lg select-none "
        style={{
          boxShadow: "0px 2.1px 12px -1.05px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="py-3 lg:!py-4 px-5 lg:!px-6 xl:!px-7">
          <div className="flex justify-between items-center">
            <h2 className="text-xs lg:!text-sm text-[#0D2C31]">
              Project Inventory
            </h2>
            <p className="text-[10px] lg:!text-xs text-[#cecece]">
              {startRow}-{endRow} of {filteredProjects.length} projects
            </p>
          </div>
          <div className="flex items-center justify-between pb-2 lg:!pb-3 pt-4 lg:!pt-5 xl:!pt-6">
            <span className="relative inline-flex items-center">
              <input
                type="text"
                placeholder="Find project..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-36 lg:!w-48 xl:!w-60 h-6 lg:!h-7 xl:!h-8 pl-2 lg:!pl-3 pr-6 lg:!pr-8 xl:!pr-10 text-[10px] lg:!text-xs border border-[#ADADAD] border-opacity-40 rounded-lg bg-mainBg focus:border-1 focus:border-[#18636F] focus:outline-none"
              />
              <FiSearch
                className="absolute right-2 lg:!right-3 text-[#18636F] cursor-pointer text-xs lg text-[8px] md:text-[10px]:lg:!text-xs"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              />
            </span>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => setShowNewproject(true)}
                className="text-[10px] lg:!text-xs text-white py-1 px-2.5 lg:!py-1.5 lg:!px-3.5 bg-[#18636F] rounded-lg"
              >
                New project
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between ">
            <div className="flex items-center justify-start gap-x-3">
              <CustomDropdown
                options={["All", "Urgent", "High", "Medium", "Low"]}
                value={filters.priority}
                onChange={(value) =>
                  handleFilterChange("priority", value === "All" ? "" : value)
                }
                placeholder="Priority"
              />
              <CustomDropdown
                options={[
                  "All",
                  "Completed",
                  "Upcoming",
                  "In Progress",
                  "On Hold",
                ]}
                value={filters.status}
                onChange={(value) =>
                  handleFilterChange("status", value === "All" ? "" : value)
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
        </div>
        <table className="w-full">
          <thead className="bg-[#F8F9FB]">
            <tr className="text-left p-3 text-[10px] lg:!text-xs border-y">
              <th
                className="text-left p-2 lg:!p-3 ml-5 flex items-center"
                style={{ width: columnWidths.name }}
              >
                Name
                <button
                  id="sortOrder"
                  onClick={handleSortChange}
                  className="ml-2 text-xs bg-secondBg font-bold"
                >
                  <LuArrowUpDown className="text-[10px] lg:!text-xs" />
                </button>
              </th>
              <th
                className="text-left p-2 lg:!p-3"
                style={{ width: columnWidths.manager }}
              >
                Project Manager
              </th>

              <th
                className="text-left p-2 lg:!p-3 "
                style={{ width: columnWidths.status }}
              >
                Status
              </th>

              <th
                className="text-left p-2 lg:!p-3 "
                style={{ width: columnWidths.date }}
              >
                Due Date
              </th>
              <th
                className="text-left hidden xl:!table-cell"
                style={{ width: columnWidths.members }}
              >
                Members
              </th>
              <th
                className="text-left hidden xl:!table-cell"
                style={{ width: columnWidths.priority }}
              >
                Priority
              </th>
              <th
                className="text-left p-2 lg:!p-3"
                style={{ width: columnWidths.edit }}
              >
                Edit
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
                    No Projects available. Please check back later.
                  </p>
                </td>
              </tr>
            ) : (
              getPaginatedData().map((project, index) => (
                <tr
                  key={index}
                  className="bg-white border-y h-[25px] lg:!h-[35px] xl:!h-[47px]"
                >
                  <td
                    onClick={() => handleViewproject(project.projectid)}
                    className="cursor-pointer px-7 lg:!px-8 text-[8px] md:text-[10px] lg:!text-xs"
                    style={{ width: columnWidths.name }}
                  >
                    <button>
                      {project.projectname?.length > 31
                        ? `${project.projectname.substring(0, 28)}...`
                        : project.projectname || "Unknown Name"}
                    </button>
                  </td>

                  <td
                    className="p-2 lg:!p-3 text-[8px] md:text-[10px] lg:!text-xs"
                    style={{ width: columnWidths.manager }}
                  >
                    {project.project_manager || "Unknown User"}
                  </td>

                  <td
                    className="p-3 text-[10px] lg:!text-xs rounded-md"
                    style={{ width: columnWidths.status }}
                  >
                    <p
                      className={`px-2 py-1 rounded-lg ${getStatusBgColor(
                        project.status
                      )} inline-block text-center`}
                    >
                      {project.status}
                    </p>
                  </td>

                  <td
                    className="p-2 lg:!p-3 text-[8px] lg:!text-[10px] xl:!text-xs "
                    style={{ width: columnWidths.date }}
                  >
                    {project.created_at
                      ? formatDate(project.created_at)
                      : "Unknown Date"}
                  </td>
                  <td
                    className="text-[8px] md:text-[10px] lg:!text-xs hidden xl:!table-cell"
                    style={{ width: columnWidths.members }}
                  >
                    {`${project.userIds.length} ${
                      project.userIds.length === 1 ? "user" : "users"
                    }`}
                  </td>
                  <td
                    className="text-[10px] lg:!text-xs hidden xl:!table-cell"
                    style={{ width: columnWidths.priority }}
                  >
                    <div className="flex items-center gap-x-2">
                      {project.priority
                        ? getPriorityIcon(project.priority)
                        : null}
                      {project.priority || "Unknown Priority"}{" "}
                    </div>
                  </td>
                  <td
                    className="p-2 lg:!p-3 text-[8px] md:text-[10px] lg:!text-xs"
                    style={{ width: columnWidths.edit }}
                  >
                    <button
                      onClick={() => {
                        handleEditProject(project.projectid);
                      }}
                    >
                      <BiSolidEditAlt className="bg-none border-none cursor-pointer text-[#18636F] text-xs lg:!text-sm xl:!text-lg " />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {getPaginatedData().length < 10 && getPaginatedData().length !== 0
              ? Array.from({ length: 10 - getPaginatedData().length }).map(
                  (_, index) => (
                    <tr
                      key={`empty-row-${index}`}
                      className="h-[25px] lg:!h-[35px] xl:!h-[47px] "
                    >
                      <td
                        colSpan="6"
                        className="text-transparent border-none"
                      ></td>
                    </tr>
                  )
                )
              : ""}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-x-2 text-[10px] lg:!text-xs select-none">
          <p>No of projects per page: </p>
          <select
            value={projectsPerPage}
            onChange={handleprojectsPerPageChange}
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
                    currentPage !== 1 ? "1px solid black" : "1px solid #18636F",
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
      {showNewproject && (
        <NewProject
          onClose={() => {
            fetchProjectsData();
            setShowNewproject(false);
          }}
        />
      )}
      {showEditprojectForm && (
        <EditProject
          onClose={() => {
            fetchProjectsData();
            setShowEditprojectForm(false);
          }}
          projectid={editProjectid}
        />
      )}
    </div>
  );
};

export default AllProjects;
