import React, { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import { useLocation, useNavigate, useParams } from "react-router";
import AccessDenied from "../../common/components/AccessDenied";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TableWrapper from "../../common/components/Table/TableWrapper";
import { PART_TABLE_COLS } from "../parts/partsConstants";
import { TOOL_TABLE_COLS } from "../tools/toolsContants";
import { TASK_PARTS_COLS, TASK_TOOLS_COLS } from "./taskConstants";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function TaskView() {
  const { projectId, taskId } = useParams();
  const { pathname } = useLocation();
  const isNew = pathname.includes("new");

  const [edit, setEdit] = useState(isNew);
  const [task, setTask] = useState(null);
  const [tools, setTools] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  const {
    response: taskResponse,
    loading: taskLoading,
    runFetch: updateTask,
  } = useFetch(`projects/${projectId}/tasks/${taskId}`);

  const {
    response: createTaskResponse,
    loading: createTaskLoading,
    runFetch: createTask,
  } = useFetch(`projects/${projectId}/tasks`, "POST", false);

  const {
    response: createPartResponse,
    loading: createPartLoading,
    runFetch: createPart,
  } = useFetch(`projects/${projectId}/tasks/${taskId}/parts`, "POST", false);

  const {
    response: updatePartResponse,
    loading: updatePartLoading,
    runFetch: updatePart,
    setResponse: setUpdatePartResponse,
  } = useFetch("parts/:partId", "PATCH", false);
  // secondary alias for clarity when deleting
  const deletePart = updatePart;

  const {
    response: toolResponse,
    loading: toolsLoading,
    runFetch: getTools,
  } = useFetch("tools");

  const {
    response: createToolResponse,
    loading: createToolLoading,
    runFetch: createTool,
  } = useFetch(`projects/${projectId}/tasks/${taskId}/tools`, "POST", false);

  const {
    response: updateToolResponse,
    loading: updateToolLoading,
    runFetch: updateTool,
  } = useFetch(`tools/:toolId`, "PATCH", false);

  useEffect(() => {
    if (updateToolResponse) {
      if (deleteId) {
        setTools((prevState) =>
          prevState.filter((tool) => tool.id !== deleteId.tools),
        );
      }
    }
  }, [updateToolResponse]);

  useEffect(() => {
    if (createToolResponse) {
      setTools((prevState) => [...prevState, createToolResponse]);
    }
  }, [createToolResponse]);

  useEffect(() => {
    if (deleteId?.parts) {
      deletePart({
        urlParams: [{ key: ":partId", value: deleteId.parts }],
        method: "DELETE",
      });
    } else if (deleteId?.tools) {
      updateTool({
        urlParams: [{ key: ":toolId", value: deleteId.tools }],
        remove_task: taskId,
      });
    }
  }, [deleteId]);

  useEffect(() => {
    if (taskResponse) {
      setTask(taskResponse);
      setTools(taskResponse.tools)
      setEdit(false);
    }
  }, [taskResponse]);

  useEffect(() => {
    if (createTaskResponse) {
      navigate(`/projects/${projectId}/tasks/${createTaskResponse.id}`);
      setTask(createTaskResponse);
      setEdit(false);
    }
  }, [createTaskResponse]);

  useEffect(() => {
    if (edit && !task) {
      setTask({
        name: "",
        description: "",
        completed: false,
      });
    }
  }, [edit]);

  useEffect(() => {
    if (createPartResponse) {
      setTask((prevState) => ({
        ...prevState,
        parts: [...prevState.parts, createPartResponse],
      }));
    }
  }, [createPartResponse]);

  useEffect(() => {
    if (updatePartResponse) {
      if (deleteId) {
        setTask((prevState) => ({
          ...prevState,
          parts: prevState.parts.filter((part) => part.id !== deleteId.parts),
        }));
        setDeleteId(null);
        setUpdatePartResponse(null);
      } else {
        setTask((prevState) => ({
          ...prevState,
          parts: prevState.parts.map((part) => {
            if (part.id === updatePartResponse.id) {
              return updatePartResponse;
            }
            return part;
          }),
        }));
      }
    }
  }, [updatePartResponse]);

  function handleChange(e) {
    const newData = { ...task };
    if (e.target.type === "checkbox") {
      newData[e.target.id] = e.target.checked;
    } else {
      newData[e.target.id] = e.target.value;
    }
    setTask(newData);
  }

  function handleSave() {
    if (isNew) {
      createTask(task);
    } else {
      updateTask({ method: "PATCH", ...task });
    }
  }

  function handleRowSave(row, table) {
    if (table === "parts") {
      const part = task.parts.find((part) => part.id === row.id);
      if (part) {
        updatePart({ urlParams: [{ key: ":partId", value: part.id }], ...row });
      } else {
        createPart(row);
      }
    } else if (table === "tools") {
      if (row.id) {
        updateTool({
          ...row,
          add_task: taskId,
          urlParams: [{ key: ":toolId", value: row.id }],
        });
      } else {
        createTool(row);
      }
    }
  }

  if (taskLoading) {
    return <>Loading...</>;
  }

  if (edit) {
    return (
      <Grid container sx={{ textAlign: "center" }}>
        <Grid size={12}>
          <TextField
            label="Name"
            id="name"
            value={task.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Description"
            id="description"
            onChange={handleChange}
            value={task.description}
          />
        </Grid>
        <Grid size={12}>
          <FormControlLabel
            control={
              <Checkbox
                id="completed"
                checked={task.complete}
                onChange={handleChange}
                slotProps={{
                  input: { "aria-label": "completed" },
                }}
              />
            }
            label="Complete?"
            labelPlacement="start"
          />
        </Grid>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={() => {
            setEdit(false);
            setTask(taskResponse);
          }}
        >
          Cancel
        </Button>
      </Grid>
    );
  }

  return (
    <>
      {task ? (
        <>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            {task.name}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {task.description}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {task.complete ? "Completed" : "Pending"}
          </Typography>
          <Button variant="contained" onClick={() => setEdit(true)}>
            Edit
          </Button>
          <Grid container spacing={2} sx={{ textAlign: "center" }}>
            <Grid size={6}>
              <Typography variant="h4">Parts</Typography>
              <TableWrapper
                cols={PART_TABLE_COLS}
                data={task.parts}
                canAdd
                canEdit
                onSave={(row) => handleRowSave(row, "parts")}
                onDelete={(rowId) => setDeleteId({ parts: rowId })}
              />
            </Grid>
            <Grid size={6}>
              <Typography variant="h4">Tools</Typography>
              <TableWrapper
                cols={TASK_TOOLS_COLS}
                data={tools}
                lookups={{
                  tools:
                    toolResponse?.items?.map((tool) => ({
                      ...tool,
                      value: tool.id,
                      label: tool.name,
                    })) || [],
                }}
                canAdd
                onSave={(row) => handleRowSave(row, "tools")}
                onDelete={(rowId) => setDeleteId({ tools: rowId })}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
