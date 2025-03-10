import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlinePersonSearch } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "./ErrorPopup";

const ProjectMembers = ({ onClose, projectId, managerid, supervisorid }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [removedUsers, setRemovedUsers] = useState([]);
  const dropdownRef = useRef(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupTitle, setSuccessPopupTitle] = useState(null);
  const [successPopupMsg, setSuccessPopupMsg] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [ErrorPopupTitle, setErrorPopupTitle] = useState(null);
  const [ErrorPopupMsg, setErrorPopupMsg] = useState(null);
  const [showErrorMemberPopup, setShowErrorMemberPopup] = useState(false);
  const [ErrorMemberPopupTitle, setErrorMemberPopupTitle] = useState(null);
  const [ErrorMemberPopupMsg, setErrorMemberPopupMsg] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setShowDropdown(true);
    setSelectedIndex(-1);
  };

  const fetchProjectUsers = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:5858/projects/users?projectid=${projectId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch project users");
      }
      const data = await response.json();
      setProjectUsers(data);
      fetchUsers(data);
    } catch (error) {
      console.error("Error fetching project users:", error);
    }
  };

  useEffect(() => {
    fetchProjectUsers(projectId);
  }, [projectId]);

  const fetchUsers = async (projectUsers) => {
    setLoading(true);
    setError("");
    setHasFetched(false);

    try {
      if (!projectUsers) {
        console.error("No project users provided.");
        setError("No project users provided.");
        return;
      }

      let userIds = [];

      if (Array.isArray(projectUsers)) {
        userIds = projectUsers;
      } else if (typeof projectUsers === "string") {
        userIds = projectUsers.split(",");
      } else {
        console.error("ProjectUsers is not a string or array.");
        setError("Invalid project users format.");
        return;
      }

      const response = await fetch(
        "http://localhost:5656/users/getProjectUsersFilled",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userIds),
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");

        if (response.status === 204) {
          setUsers([]);
          console.log("No content returned from server.");
          return;
        }

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setSelectedUsers(data);
        } else {
          console.error("Unexpected response type:", contentType);
          setError("Unexpected response type from server.");
        }
      } else {
        setError("Failed to fetch users.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("No users found.");
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setUsers([]);
        setHasFetched(false);
        return;
      }

      setLoading(true);
      setError("");
      setHasFetched(false);
      try {
        const selectedUserIds = selectedUsers.map((user) => user.userid);

        const response = await fetch(
          `http://localhost:5656/users/getProjectUsers?searchTerm=${encodeURIComponent(
            searchTerm
          )}&userIds=${encodeURIComponent(selectedUserIds.join(","))}`
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
  }, [searchTerm, selectedUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (!showDropdown || users.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, users.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      handleUserSelect(users[selectedIndex]);
    }
  };
  const handleUserSelect = (user) => {
    if (!selectedUsers.some((u) => u.userid === user.userid)) {
      setSelectedUsers((prev) => [...prev, user]);
      setCreatedUsers((prev) => [...prev, user.userid]); // Track newly added user
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (userid) => {
    if (userid === managerid || userid === supervisorid) {
      setErrorMemberPopupTitle("Remove Member");
      setErrorMemberPopupMsg("You cannot remove this member for this project!");
      setShowErrorMemberPopup(true);
    } else {
      setSelectedUsers((prev) => {
        const updatedSelected = prev.filter((user) => user.userid !== userid);

        if (!createdUsers.includes(userid)) {
          setRemovedUsers((prevRemoved) => [...prevRemoved, userid]);
        } else {
          setCreatedUsers((prev) => prev.filter((id) => id !== userid));
        }

        return updatedSelected;
      });
    }
  };

  const handleUpdate = async () => {
    const payload = {
      createUser: createdUsers,
      removeUser: removedUsers,
    };

    try {
      const response = await fetch(
        `http://localhost:5858/projects/update-members?projectid=${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        setErrorPopupTitle("Project Members");
        setErrorPopupMsg("OOPS! There was a error updating project members.");
        setShowErrorPopup(true);
      }

      const data = await response.json();
      setSuccessPopupTitle("Project Members");
      setSuccessPopupMsg("The project members have been successfully updated.");
      setShowSuccessPopup(true);
      setCreatedUsers([]);
      setRemovedUsers([]);
    } catch (error) {
      console.error("Error updating project members:", error);
    }
  };

  return (
    <div
      id="fileParserModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg p-2 w-[450px] lg:w-[500px] xl:w-[600px] relative">
        <div className="flex justify-end pb-2">
          <button
            onClick={onClose}
            className="text-sm lg:text-base xl:text-xl text-gray-500 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        <div className="mx-2 lg:!mx-4 mb-2">
          <p className="text-xs lg:text-sm">Add members of the project</p>
          <div className="w-full h-64 lg:!h-80 xl:!h-96 flex justify-between">
            <div className="w-1/2 relative border-r">
              <div className="mt-4 relative mr-4">
                <input
                  type="text"
                  placeholder="Search for users..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 pr-10 border rounded-md text-[10px] lg:text-xs focus:outline-none focus:border-[#18636f]"
                  onFocus={() => setShowDropdown(true)}
                />
                <MdOutlinePersonSearch className="absolute right-3 top-1/2 text-base lg:text-lg transform -translate-y-1/2 text-gray-400" />
              </div>

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute bg-white rounded-md shadow-lg mt-2 max-h-60 overflow-y-auto z-10"
                  style={{ width: "calc(100% - 1rem)", left: "0" }}
                >
                  <ul>
                    {users.map((user, index) => (
                      <li
                        key={user.userid}
                        className={`py-2 px-3 text-[10px] lg:text-xs hover:bg-gray-100 cursor-pointer flex items-center ${
                          selectedIndex === index ? "bg-gray-200" : ""
                        }`}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => handleUserSelect(user)}
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
                    {hasFetched && users.length === 0 && searchTerm && (
                      <p className="text-xs text-gray-400 p-2">
                        No users found.
                      </p>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-1/2 pl-4 mt-4">
              <h3 className="text-xs lg:text-sm mb-2">Selected Members:</h3>
              <ul className="space-y-1 max-h-56 lg:!max-h-72 xl:!max-h-[360px] overflow-y-auto rounded-md">
                {selectedUsers.map((user) => (
                  <li
                    key={user.userid}
                    className="flex items-center justify-between text-xs bg-gray-100 p-2 rounded"
                  >
                    <div className="flex items-center">
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
                        <p className="text-[10px] lg:text-xs">
                          {window.innerWidth <= 768 &&
                          user.first_name.length + user.last_name.length > 15
                            ? `${user.first_name} ${user.last_name}`.slice(
                                0,
                                12
                              ) + "..."
                            : `${user.first_name} ${user.last_name}`}
                        </p>
                        <p className="text-gray-500 text-[9px]">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.userid)}
                      className="text-red-500 text-[9px] lg:!text-[11px] hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 text-xs flex justify-end lg:right-6">
            <button
              className="py-1 px-3 bg-[#18636f] text-white rounded-md"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
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

export default ProjectMembers;
