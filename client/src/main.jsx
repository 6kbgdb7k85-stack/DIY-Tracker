import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
// import "./index.css";
import App from "./App.jsx";
import ProjectList from "./components/projects/ProjectList.jsx";
import ProjectLayout from "./components/projects/ProjectLayout.jsx";
import Part from "./components/Part.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import ProtectedRoute from "./common/components/ProtectedRoute.jsx";
import Home from "./components/Home.jsx";
import ToolView from "./components/tools/ToolView.jsx";
import ProjectView from "./components/projects/ProjectView.jsx";
import TaskView from "./components/tasks/TaskView.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home/>}/>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="projects" element={<ProjectLayout />}>
              <Route index element={<ProjectList />} />
              <Route path=":projectId" element={<ProjectView />}/>
              <Route path=":projectId/tasks/:taskId" element={<TaskView />}/>
              <Route path=":projectId/tasks/new" element={<TaskView/>}/>
            </Route>
            <Route path="parts/:partId" element={<Part />} />
            <Route path="tools/:toolId" element={<ToolView />}/>
            <Route path="tools/new" element={<ToolView/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
