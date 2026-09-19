import React, { useEffect, useState } from "react";
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
  PROJECT_TASKS_COLUMNS,
  PROJECT_TOOL_COLUMNS,
} from "./projectConstants";
import PartsTable from "../parts/PartsTable";
import ToolsTable from "../tools/ToolsTable";
import Button from "@mui/material/Button";
import AccessDenied from "../../common/components/AccessDenied";

export default function ProjectView() {
  const { projectId } = useParams();

  const { response: projectResponse, loading } = useFetch(`projects/${projectId}`);

  const [deleteId,setDeleteId]=useState(null)
  const [project,setProject]=useState(null)

  const {
    response: deleteTaskResponse,
    loading: deleteTaskLoading,
    runFetch: deleteTask,
  } = useFetch(`projects/${projectId}/tasks/:taskId`, "DELETE", false);

  const navigate = useNavigate();

  useEffect(()=>{
    if(projectResponse){
      setProject(projectResponse)
    }
  },[projectResponse])

  useEffect(()=>{
    if (deleteTaskResponse){
      const newProject={...project}
      newProject.tasks=newProject.tasks.filter(task=>task.id!==deleteId)
      setProject(newProject)
      setDeleteId(null)
    }
  })

  function handleDelete(table, id) {
    if (table === "tasks") {
      setDeleteId(id)
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
                    <PartsTable />
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid size={6}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h4">Tools</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ToolsTable cols={PROJECT_TOOL_COLUMNS} />
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
