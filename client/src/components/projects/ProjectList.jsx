import React, { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import {
  PROJECT_TABLE_COLUMNS,
  PROJECT_TASKS_COLUMNS,
  PROJECT_TASKS_SUBTABLE,
} from "./projectConstants";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import TableHead from "@mui/material/TableHead";
import TableWrapper from "../../common/components/Table/TableWrapper";
import { useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { TOOL_TABLE_COLS } from "../tools/toolsContants";

function ProjectList() {
  const [pagination, setPagination] = useState({
    projects: {
      page: 1,
      perPage: 5,
      total: 0,
      totalPages: 0,
    },
    tools: {
      page: 1,
      perPage: 5,
      total: 0,
      totalPages: 0,
    },
  });
  const [projects, setProjects] = useState([]);
  const [tools, setTools] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const {
    response: projectsResponse,
    loading: projectsLoading,
    runFetch: getProjects,
  } = useFetch("projects");

  const {
    response: createProjectResponse,
    loading: createProjectLoading,
    runFetch: createProject,
  } = useFetch("projects", "POST", false);

  const {
    response: updateProjectResponse,
    loading: updateProjectLoading,
    runFetch: updateProject,
  } = useFetch("projects/:projectId", "PATCH", false);

  const {
    response: toolsResponse,
    loading: toolsLoading,
    runFetch: getTools,
  } = useFetch("/tools");
  const {
    response: deleteToolResponse,
    loading: deleteToolLoading,
    runFetch: deleteTool,
  } = useFetch("/tools/:toolId", "DELETE", false);

  const navigate = useNavigate();

  useEffect(() => {
    if (projectsResponse) {
      setProjects(projectsResponse.items);
      setPagination((prevState) => ({
        ...prevState,
        projects: {
          page: projectsResponse.page,
          perPage: projectsResponse.per_page,
          total: projectsResponse.total,
          totalPages: projectsResponse.total_pages,
        },
      }));
    }
  }, [projectsResponse]);

  useEffect(() => {
    if (updateProjectResponse) {
      setProjects((prevState) =>
        prevState.map((project) => {
          if (project.id == updateProjectResponse.id) {
            return updateProjectResponse;
          } else {
            return project;
          }
        }),
      );
    }
  }, [updateProjectResponse]);

  useEffect(() => {
    if (createProjectResponse) {
      setProjects((prevState) => [...prevState, createProjectResponse]);
    }
  }, [createProjectResponse]);

  useEffect(() => {
    if (deleteToolResponse) {
      setTools((prevState) =>
        prevState.filter((tool) => tool.id !== deleteId.tools),
      );
      setPagination((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          total: prevState.tools.total - 1,
        },
      }));
      setDeleteId(null);
    }
  }, [deleteToolResponse]);

  useEffect(() => {
    if (deleteId?.tools) {
      deleteTool({ urlParams: [{ key: ":toolId", value: deleteId.tools }] });
    }
  }, [deleteId]);

  useEffect(() => {
    if (toolsResponse) {
      setTools(toolsResponse.items);
      setPagination((prevState) => ({
        ...prevState,
        tools: {
          page: toolsResponse.page,
          perPage: toolsResponse.per_page,
          total: toolsResponse.total,
          totalPages: toolsResponse.total_pages,
        },
      }));
    }
  }, [toolsResponse]);

  function handleChange({ rowId: projectId, id, value }) {
    updateProject({
      urlParams: [{ key: ":projectId", value: projectId }],
      [id]: value,
    });
  }

  function handleRowClick(table, id) {
    navigate(`/${table}/${id}`);
  }

  function handleDelete(table, id) {
    setDeleteId({ [table]: id });
  }

  function handleSave(row, table) {
    if (table === "projects") {
      if (row.id) {
        updateProject({
          ...row,
          urlParams: [{ key: ":projectId", value: row.id }],
        });
      } else {
        createProject(row);
      }
    }
  }

  return (
    <section>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="h3">Projects</Typography>
          <TableWrapper
            cols={PROJECT_TABLE_COLUMNS}
            data={projects}
            loading={projectsLoading}
            pagination={pagination.projects}
            expandedTable={{
              title: "Tasks",
              cols: PROJECT_TASKS_SUBTABLE,
              dataCol: "tasks",
            }}
            onPage={(pageData) =>
              getProjects({
                searchParams: [
                  { key: "page", value: pageData.page },
                  { key: "per_page", value: pageData.perPage },
                ],
              })
            }
            canEdit
            canAdd
            onRowClick={(id) => handleRowClick("projects", id)}
            onChange={handleChange}
            onSave={(row) => handleSave(row, "projects")}
          />
        </Grid>
        <Grid size={6}>
          <Typography variant="h3">Tools</Typography>
          <TableWrapper
            cols={TOOL_TABLE_COLS}
            data={tools}
            loading={toolsLoading}
            onRowClick={(id) => handleRowClick("tools", id)}
            onDelete={(id) => handleDelete("tools", id)}
            pagination={pagination.tools}
            onPage={(pageData) =>
              getTools({
                searchParams: [
                  { key: "page", value: pageData.page },
                  { key: "per_page", value: pageData.perPage },
                ],
              })
            }
          />
        </Grid>
      </Grid>
    </section>
  );
}

export default ProjectList;
