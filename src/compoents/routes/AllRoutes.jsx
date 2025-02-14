import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import AllProjects from "../AllProjects";
import Project from "../ProjectInformation";
import Tasks from "../Tasks";
import TaskInformation from "../TaskInformation";

const AllRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<AllProjects />} />
        <Route path="/project" element={<Project />} />
        <Route path="/project/allTasks" element={<Tasks />} />
        <Route path="/project/allTasks/task" element={<TaskInformation />} />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
