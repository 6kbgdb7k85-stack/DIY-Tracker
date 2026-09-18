import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
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
    case "checkbox":
      return (
        <TableCell align="center">
          {value ? <CheckIcon /> : <RemoveIcon />}
        </TableCell>
      );
    default:
      return <TableCell align="center">{value}</TableCell>;
  }
}
