import { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import {
  PROJECT_TABLE_COLUMNS, PROJECT_TASKS_SUBTABLE
} from "./projectConstants";
import TableWrapper from "../../common/components/Table/TableWrapper";
import { useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { TOOL_TABLE_COLS } from "../tools/toolsConstants";
import { handleAddPagination, handleDeletePagination } from "../../common/utils/handlePagination";

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
    setResponse: setUpdateProjectResponse,
  } = useFetch("projects/:projectId", "PATCH", false);
  // secondary alias for deleting projects
  const deleteProject = updateProject;

  const {
    response: toolsResponse,
    loading: toolsLoading,
    runFetch: getTools,
  } = useFetch("/tools");
  // secondary alias for clarity when creating tool
  const createTool = getTools;

  const {
    response: deleteToolResponse,
    loading: deleteToolLoading,
    runFetch: deleteTool,
    setResponse: setDeleteToolResponse,
  } = useFetch("/tools/:toolId", "DELETE", false);
  // secondary alias for clarity when updating
  const updateTool = deleteTool;

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
      if (deleteId) {
        handleDeletePagination(pagination.projects, getProjects);
      } else {
        getProjects({
          searchParams: [
            { key: "page", value: pagination.projects.page },
            { key: "per_page", value: pagination.projects.perPage },
          ],
        });
      }
      setDeleteId(null);
      setUpdateProjectResponse(null);
    }
  }, [updateProjectResponse]);

  useEffect(() => {
    if (createProjectResponse) {
      getProjects({
        searchParams: [
          { key: "page", value: pagination.projects.page },
          { key: "per_page", value: pagination.projects.perPage },
        ],
      });
      setProjects((prevState) => [...prevState, createProjectResponse]);
    }
  }, [createProjectResponse]);

  useEffect(() => {
    if (deleteToolResponse) {
      if (deleteId) {
        handleDeletePagination(pagination.tools, getTools);
        setDeleteId(null);
      } else {
        getTools({
          searchParams: [
            { key: "page", value: pagination.tools.page },
            { key: "per_page", value: pagination.tools.perPage },
          ],
        });
      }
      setDeleteToolResponse(null);
    }
  }, [deleteToolResponse]);

  useEffect(() => {
    if (deleteId?.tools) {
      deleteTool({ urlParams: [{ key: ":toolId", value: deleteId.tools }] });
    } else if (deleteId?.projects) {
      deleteProject({
        urlParams: [{ key: ":projectId", value: deleteId.projects }],
        method: "DELETE",
      });
    }
  }, [deleteId]);

  useEffect(() => {
    if (toolsResponse) {
      if (toolsResponse.items) {
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
      } else {
        handleAddPagination(pagination.tools,getTools)
      }
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
    } else if (table === "tools") {
      if (row.id) {
        updateTool({
          ...row,
          urlParams: [{ key: ":toolId", value: row.id }],
          method: "PATCH",
        });
      } else {
        createTool({
          ...row,
          method: "POST",
        });
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
            onDelete={(id) => handleDelete("projects", id)}
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
            canAdd
            canEdit
            onSave={(row) => handleSave(row, "tools")}
          />
        </Grid>
      </Grid>
    </section>
  );
}

export default ProjectList;
