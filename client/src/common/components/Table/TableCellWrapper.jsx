import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";
import TextField from "@mui/material/TextField";
import { FieldTypes } from "../../constants/FieldTypes";

export default function TableCellWrapper({
  col,
  rowId,
  value,
  onChange,
  isEdit,
}) {
  function handleChange(e) {
    let newValue;
    switch (col.type) {
      case FieldTypes.CHECKBOX:
      case FieldTypes.EDIT_CHECKBOX:
        newValue = e.target.checked;
        break;
      case FieldTypes.NUMBER:
        newValue=Number(e.target.value);
        break;
      default:
        newValue = e.target.value;
    }
    onChange({ rowId, id: col.id, value: newValue, type: col.type });
  }

  function compileField() {
    switch (col.type) {
      case FieldTypes.EDIT_CHECKBOX:
        return (
            <Checkbox
              slotProps={{ input: { "aria-label": "isCompleted" } }}
              checked={value}
              onChange={handleChange}
            />
        );
      case FieldTypes.CHECKBOX:
        return (
          <>
            {isEdit ? (
              <Checkbox
                slotProps={{ input: { "aria-label": col.id } }}
                checked={value||false}
                onChange={handleChange}
              />
            ) : (
              <>{value ? <CheckIcon /> : <RemoveIcon />}</>
            )}
          </>
        );
      case FieldTypes.NUMBER:
        return (
          <>
            {isEdit?<TextField type="number" id={col.id} name={col.name} value={value||0} onChange={handleChange}/>:<>{value}</>}
          </>
        )
      default:
        return (
          <>
            {isEdit ? (
              <TextField
                id={col.id}
                name={col.id}
                value={value||''}
                onChange={handleChange}
              />
            ) : (
              <>{value}</>
            )}
          </>
        );
    }
  }

  return (
    <TableCell align="center">
      {compileField()}
    </TableCell>
  )
}
