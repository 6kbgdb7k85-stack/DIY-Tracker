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
  } = useFetch(`projects/${projectId}/tasks/:taskId`, "DELETE", false);

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
      newProject.tasks = newProject.tasks.filter(
        (task) => task.id !== deleteId,
      );
      setProject(newProject);
      setDeleteId(null);
    }
  }, [deleteTaskResponse]);

  function handleDelete(table, id) {
    if (table === "tasks") {
      setDeleteId(id);
      deleteTask({ urlParams: [{ key: ":taskId", value: id }] });
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
                    onAdd={() => navigate(`/projects/${projectId}/tasks/new`)}
                    onRowClick={(id) =>
                      navigate(`/projects/${projectId}/tasks/${id}`)
                    }
                    onDelete={(id) => handleDelete("tasks", id)}
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
