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

export default function TaskView() {
  const { setHeader } = useOutletContext();
  const { projectId, taskId } = useParams();

  const [task, setTask] = useState(null);
  const [tools, setTools] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

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
  } = useFetch(`tools/:toolId`, "PATCH", false);

  useEffect(() => {
    setHeader("Task View");
  }, []);

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

  if (taskLoading) {
    return <>Loading...</>;
  }

  return (
    <>
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
                onDelete={(rowId) => setDeleteId({ parts: rowId })}
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
                onDelete={(rowId) => setDeleteId({ tools: rowId })}
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
