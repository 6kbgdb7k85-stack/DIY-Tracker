import { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import AccessDenied from "../../common/components/AccessDenied";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TableWrapper from "../../common/components/Table/TableWrapper";
import { PART_TABLE_COLS, TASK_TOOLS_COLS } from "./taskConstants";
import ConfirmationDialog from "../../common/components/ConfirmationDialog";

export default function TaskView() {
  const { setHeader } = useOutletContext();
  const { projectId, taskId } = useParams();

  const [task, setTask] = useState(null);
  const [tools, setTools] = useState([]);
  const [deleteRow, setDeleteRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    response: taskResponse,
    loading: taskLoading,
    runFetch: updateTask,
  } = useFetch(`projects/${projectId}/tasks/${taskId}`);

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
    setResponse: setUpdateToolResponse,
  } = useFetch(`tools/:toolId`, "PATCH", false);

  useEffect(() => {
    setHeader("Task View");
  }, []);

  useEffect(() => {
    if (updateToolResponse) {
      if (deleteRow) {
        setTools((prevState) =>
          prevState.filter((tool) => tool.id !== deleteRow.tools.id),
        );
        setUpdateToolResponse(null);
      }
    }
  }, [updateToolResponse]);

  useEffect(() => {
    if (createToolResponse) {
      setTools((prevState) => [...prevState, createToolResponse]);
    }
  }, [createToolResponse]);

  useEffect(() => {
    if (deleteRow) {
      setDialogOpen(true);
    }
  }, [deleteRow]);

  useEffect(() => {
    if (taskResponse) {
      setTask(taskResponse);
      setTools(taskResponse.tools);
      setHeader(taskResponse.name);
    }
  }, [taskResponse]);

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
      if (deleteRow) {
        setTask((prevState) => ({
          ...prevState,
          parts: prevState.parts.filter(
            (part) => part.id !== deleteRow.parts.id,
          ),
        }));
        setDeleteRow(null);
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

  function handleRowClick(id, table) {
    if (table === "tools") {
      navigate(`/tools/${id}`, { state: { prevLocation: pathname } });
    }
  }

  function handleDelete(id) {
    if (deleteRow?.parts) {
      deletePart({
        urlParams: [{ key: ":partId", value: id }],
        method: "DELETE",
      });
    } else if (deleteRow?.tools) {
      updateTool({
        urlParams: [{ key: ":toolId", value: id }],
        remove_task: taskId,
      });
    }
    setDialogOpen(false);
  }

  if (taskLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <ConfirmationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        resource={deleteRow?.parts || deleteRow?.tools||{}}
        confirmCallback={handleDelete}
        customMessage={
          deleteRow?.tools
            ? `Are you sure you want to remove Tool "${deleteRow?.tools?.name}" from this task? This does not delete the tool from your profile and it will remain accessible.`
            : null
        }
      />
      {task ? (
        <>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {task.description}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {task.completed
              ? `Completed - Time: ${task.time}`
              : `Pending - Estimated Time: ${task.time}`}
          </Typography>
          <Grid container spacing={2} sx={{ textAlign: "center" }}>
            <Grid size={{ lg: 6, xs: 12 }}>
              <Typography variant="h4">Parts</Typography>
              <TableWrapper
                cols={PART_TABLE_COLS}
                data={task.parts}
                canAdd
                canEdit
                onSave={(row) => handleRowSave(row, "parts")}
                onDelete={(row) =>
                  setDeleteRow({ parts: { ...row, resourceType: "Part" } })
                }
              />
            </Grid>
            <Grid size={{ lg: 6, xs: 12 }}>
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
                onDelete={(row) =>
                  setDeleteRow({ tools: { ...row, resourceType: "Tool" } })
                }
                onRowClick={(rowId) => handleRowClick(rowId, "tools")}
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
