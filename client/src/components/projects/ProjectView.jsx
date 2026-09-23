import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import useFetch from "../../common/utils/useFetch";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableWrapper from "../../common/components/Table/TableWrapper";
import {
  PROJECT_PART_COLUMNS,
  PROJECT_TASKS_COLUMNS,
  PROJECT_TOOL_COLUMNS,
} from "./projectConstants";
import AccessDenied from "../../common/components/AccessDenied";
import { calculateRemainingCost } from "../../common/utils/calculations";

export default function ProjectView() {
  const { projectId } = useParams();

  const { response: projectResponse, loading } = useFetch(
    `projects/${projectId}`,
  );
  const {
    response: parts,
    loading: partsLoading,
    runFetch: getParts,
  } = useFetch(`projects/${projectId}/parts`);

  const {
    response: tools,
    loading: toolsLoading,
    runFetch: getTools,
  } = useFetch(`projects/${projectId}/tools`);

  const [deleteId, setDeleteId] = useState(null);
  const [project, setProject] = useState(null);
  const [pagination, setPagination] = useState({
    parts: {
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

  const {
    response: deleteTaskResponse,
    loading: deleteTaskLoading,
    runFetch: deleteTask,
    setResponse: setDeleteTaskResponse,
  } = useFetch(`projects/${projectId}/tasks/:taskId`, "DELETE", false);
  // secondary alias for clarity when updating
  const updateTask = deleteTask;

  const {
    response: createTaskResponse,
    loading: createTaskLoading,
    runFetch: createTask,
  } = useFetch(`projects/${projectId}/tasks`, "POST", false);

  const navigate = useNavigate();

  useEffect(() => {
    if (projectResponse) {
      setProject(projectResponse);
    }
  }, [projectResponse]);

  useEffect(() => {
    if (parts) {
      setPagination((prevState) => ({
        ...prevState,
        parts: {
          page: parts.page,
          perPage: parts.per_page,
          total: parts.total,
          totalPages: parts.total_pages,
        },
      }));
    }
  }, [parts]);

  useEffect(() => {
    if (deleteTaskResponse) {
      const newProject = { ...project };
      if (deleteId) {
        newProject.tasks = newProject.tasks.filter(
          (task) => task.id !== deleteId,
        );
        setDeleteId(null);
      } else {
        newProject.tasks = newProject.tasks.map((task) => {
          if (task.id === deleteTaskResponse.id) {
            return deleteTaskResponse;
          }
          return task;
        });
      }
      setProject(newProject);
      setDeleteTaskResponse(null);
    }
  }, [deleteTaskResponse]);

  useEffect(() => {
    if (createTaskResponse) {
      setProject((prevState) => ({
        ...prevState,
        tasks: [...prevState.tasks, createTaskResponse],
      }));
    }
  }, [createTaskResponse]);

  function handleDelete(table, id) {
    if (table === "tasks") {
      setDeleteId(id);
      deleteTask({ urlParams: [{ key: ":taskId", value: id }] });
    }
  }

  function handleSave(row) {
    if (row.id) {
      updateTask({
        ...row,
        urlParams: [{ key: ":taskId", value: row.id }],
        method: "PATCH",
      });
    } else {
      createTask(row);
    }
  }

  if (loading) {
    return <h1>Project Loading</h1>;
  }

  return (
    <>
      {project ? (
        <>
          <Grid
            container
            spacing={2}
            sx={{ alignContent: "center", textAlign: "center" }}
          >
            <Grid size={12}>
              <Typography variant="h3">{project.name}</Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body1">{project.description}</Typography>
            </Grid>
            <Grid container size={12}>
              <Grid size={6}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h4">Parts</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableWrapper
                      cols={PROJECT_PART_COLUMNS}
                      data={parts?.items || []}
                      loading={partsLoading}
                      pagination={pagination.parts}
                      onPage={(pageData) =>
                        getParts({
                          searchParams: [
                            { key: "page", value: pageData.page },
                            { key: "per_page", value: pageData.perPage },
                          ],
                        })
                      }
                      totals={[{header:'Parts Cost',value:`$${calculateRemainingCost(parts?.items||[])}`}]}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid size={6}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h4">Tools</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableWrapper
                      cols={PROJECT_TOOL_COLUMNS}
                      data={tools?.items || []}
                      loading={toolsLoading}
                      pagination={pagination.tools}
                      onPage={(pageData) =>
                        getTools({
                          searchParams: [
                            { key: "page", value: pageData.page },
                            { key: "per_page", value: pageData.perPage },
                          ],
                        })
                      }
                      totals={[{header:'Tools Cost',value:`$${calculateRemainingCost(tools?.items||[])}`}]}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h4">Tasks</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableWrapper
                    cols={PROJECT_TASKS_COLUMNS}
                    data={project.tasks}
                    loading={loading}
                    canAdd
                    canEdit
                    onRowClick={(id) =>
                      navigate(`/projects/${projectId}/tasks/${id}`)
                    }
                    onDelete={(id) => handleDelete("tasks", id)}
                    onSave={handleSave}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Outlet />
        </>
      ) : (
        <>
          <AccessDenied />
        </>
      )}
    </>
  );
}
