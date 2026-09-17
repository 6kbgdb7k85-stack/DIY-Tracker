import React, { useEffect, useState } from "react";
import TableWrapper from "../../common/components/Table/TableWrapper";
import { useParams } from "react-router";
import useFetch from "../../common/utils/useFetch";
import { TOOL_TABLE_COLS } from "./toolsContants";

export default function ToolsTable() {
  const { projectId, taskId } = useParams();

  const url = taskId
    ? `projects/${projectId}/tasks/${taskId}/tools`
    : `projects/${projectId}/tools`;

  const { response: toolsData, loading } = useFetch(url);

  const [tools, setTools] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (toolsData) {
      setTools(toolsData.items);
      setPagination({page:toolsData.page,perPage:toolsData.per_page,total:toolsData.total,totalPages:toolsData.total_pages});
    }
  }, [toolsData]);

  return (
    <TableWrapper
      cols={TOOL_TABLE_COLS}
      data={tools}
      loading={loading}
      pagination={pagination}
    />
  );
}
