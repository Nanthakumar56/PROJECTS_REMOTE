import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import AllProjects from "../AllProjects";
import Project from "../ProjectInformation";

const AllRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<AllProjects />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
