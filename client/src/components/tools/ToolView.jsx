import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import useFetch from "../../common/utils/useFetch";
import TableWrapper from "../../common/components/Table/TableWrapper";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import { TOOL_TASK_COLS } from "./toolsContants";
import AccessDenied from "../../common/components/AccessDenied";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";

export default function ToolView() {
  const { toolId } = useParams();

  const { pathname } = useLocation();

  const [edit, setEdit] = useState(false);

  const [tool, setTool] = useState(null);

  const navigate = useNavigate();

  const {
    response: toolResponse,
    loading: toolLoading,
    runFetch: updateTool,
  } = useFetch(`tools/${toolId}`);
  const {
    response: newToolResponse,
    loading: newToolLoading,
    runFetch: createTool,
  } = useFetch("tools", "POST", false);

  useEffect(() => {
    if (toolResponse) {
      setTool(toolResponse);
      setEdit(false);
    }
  }, [toolResponse]);

  useEffect(() => {
    if (newToolResponse) {
      navigate(`/tools/${newToolResponse.id}`);
      setEdit(false);
    }
  }, [newToolResponse]);

  function handleChange(e) {
    const name = e.target.id;
    let value;
    switch (e.target.type) {
      case "checkbox":
        value = e.target.checked;
        break;
      case "number":
        value = Number(e.target.value);
        break;
      default:
        value = e.target.value;
    }
    setTool((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSave() {
    updateTool({
      ...tool,
      method: "PATCH",
    });
  }

  if (toolLoading || newToolLoading) {
    return <>Loading</>;
  }

  if (edit) {
    return (
      <>
        <Grid container sx={{ alignContent: "center" }}>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <TextField
              label="name"
              id="name"
              value={tool.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  id="owned"
                  checked={tool.owned}
                  onChange={handleChange}
                  slotProps={{
                    input: { "aria-label": "controlled" },
                  }}
                />
              }
              label="Owned?"
              labelPlacement="start"
            />
          </Grid>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <TextField
              type="number"
              label="Cost"
              value={tool.cost}
              id="cost"
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                setEdit(false);
                setTool(toolResponse);
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
        <>
          <h3>Tasks Used In</h3>
          <TableWrapper cols={TOOL_TASK_COLS} data={tool?.tasks || []} />
        </>
      </>
    );
  }

  return (
    <>
      {tool ? (
        <>
          <h2>
            {tool.name} <Button onClick={() => setEdit(true)}>Edit</Button>
          </h2>
          <p>Owned?: {tool.owned ? <CheckIcon /> : <RemoveIcon />}</p>
          <p>Cost: {tool.cost}</p>
          <h3>Tasks Used In</h3>
          <TableWrapper cols={TOOL_TASK_COLS} data={tool?.tasks || []} />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
