import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";

const ProjectMembersData = ({ onClose, projectId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5858/projects/users?projectid=${projectId}`
        );
        if (!response.ok) throw new Error("Failed to fetch users");

        const userIds = await response.json();
        if (!userIds.length) return;

        const userResponse = await fetch(
          "http://localhost:5656/users/getProjectUsersFilled",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userIds),
          }
        );

        if (userResponse.ok) {
          const data = await userResponse.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [projectId]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-[450px] lg:w-[500px] xl:w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          <IoClose />
        </button>

        <p className="text-sm mb-4">Members of the project</p>
        <ul className="h-64 lg:h-80 xl:h-96 overflow-y-auto grid grid-cols-2 auto-rows-max gap-2 items-start">
          {users.map((user) => (
            <li
              key={user.userid}
              className="flex items-center bg-gray-100 p-2 rounded h-fit"
            >
              {user.file ? (
                <img
                  src={`data:image/jpeg;base64,${user.file}`}
                  alt={user.first_name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <FaCircleUser className="w-8 h-8 text-gray-400 mr-2" />
              )}
              <div>
                <p className="text-sm">{`${user.first_name} ${user.last_name}`}</p>
                <p className="text-gray-500 text-xs">{user.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectMembersData;
