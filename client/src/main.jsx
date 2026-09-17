import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import ProjectList from "./components/projects/ProjectList.jsx";
import Project from "./components/projects/Project.jsx";
import ProjectLayout from "./components/projects/ProjectLayout.jsx";
import Task from "./components/Task.jsx";
import Part from "./components/Part.jsx";
import Tool from "./components/Tool.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="projects" element={<ProjectLayout/>}>
            <Route index element={<ProjectList/>}/>
            <Route path=":projectId" element={<Project/>}>
              <Route path="tasks/:taskId" element={<Task/>}>
              </Route>
            </Route>
          </Route>
          <Route path="parts/:partId" element={<Part/>}/>
          <Route path="tools/:toolId" element={<Tool/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
