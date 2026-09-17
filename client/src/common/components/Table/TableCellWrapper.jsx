import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import React from "react";

export default function TableCellWrapper({ id, rowId, value, type, onChange }) {
  function onCheck(e) {
    onChange(rowId, id, e.target.checked);
  }

  switch (type) {
    case "edit-checkbox":
      return (
        <TableCell align="center">
          <Checkbox
            slotProps={{ input: { "aria-label": "isCompleted" } }}
            checked={value}
            onChange={onCheck}
          />
        </TableCell>
      );
    default:
      return <TableCell align="center">{value}</TableCell>;
  }
}
