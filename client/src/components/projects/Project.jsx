import React from "react";
import { Outlet, useParams } from "react-router";
import useFetch from "../../common/utils/useFetch";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableWrapper from "../../common/components/Table/TableWrapper";
import { PROJECT_TASKS_COLUMNS } from "./projectConstants";

function Project() {
  const { projectId } = useParams();

  const { response: project, loading } = useFetch(`projects/${projectId}`);

  if (loading) {
    return <h1>Project Loading</h1>;
  }

  return (
    <div>
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
              <AccordionDetails>Parts Table</AccordionDetails>
            </Accordion>
          </Grid>
          <Grid size={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4">Tools</Typography>
              </AccordionSummary>
              <AccordionDetails>Tools Table</AccordionDetails>
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
				/>
			</AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
      <Outlet />
    </div>
  );
}

export default Project;
