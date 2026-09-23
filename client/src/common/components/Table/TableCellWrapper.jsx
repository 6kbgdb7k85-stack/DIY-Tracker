import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { FieldTypes } from "../../constants/FieldTypes";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

export default function TableCellWrapper({
  col,
  rowId,
  value,
  onChange,
  isEdit,
  lookups,
}) {
  const filter = createFilterOptions();
  const [inputValue, setInputValue] = useState(value || "");

  function handleChange(e, eventValue) {
    let newValue;
    switch (col.type) {
      case FieldTypes.CHECKBOX:
      case FieldTypes.EDIT_CHECKBOX:
        newValue = e.target.checked;
        break;
      case FieldTypes.NUMBER:
        newValue = Number(e.target.value);
        break;
      case FieldTypes.AUTOCOMPLETE:
        newValue = eventValue;
        break;
      default:
        newValue = e.target.value;
    }
    onChange({ rowId, id: col.id, value: newValue, type: col.type });
  }

  function handleInputChange(e, newInputValue) {
    setInputValue(newInputValue);
  }

  function getLookups() {
    return col.lookupName
      ? lookups?.[col.lookupName] || []
      : lookups?.[col.id] || [];
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
                checked={value || false}
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
            {isEdit ? (
              <TextField
                type="number"
                id={col.id}
                name={col.name}
                value={value || 0}
                onChange={handleChange}
              />
            ) : (
              <>{value}</>
            )}
          </>
        );
      case FieldTypes.AUTOCOMPLETE:
        return (
          <>
            {isEdit ? (
              <Autocomplete
                value={value}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onChange={handleChange}
                options={getLookups()}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.label,
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      label: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.label;
                }}
                renderOption={(props, option) => {
                  const { ...optionProps } = props;
                  return (
                    <li key={option.id} {...optionProps}>
                      {option.label}
                    </li>
                  );
                }}
                freeSolo
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} />}
              />
            ) : (
              <>{value}</>
            )}
          </>
        );
        case FieldTypes.CALCULATED:
          if (typeof col.calculation !== "function"){
            console.error("Column param 'calculation' must be a function to use type 'CALCULATED'")
            return <></>
          }
          console.log(value)
          return <>{col.calculation(value)}</>
      default:
        return (
          <>
            {isEdit ? (
              <TextField
                id={col.id}
                name={col.id}
                value={value || ""}
                onChange={handleChange}
              />
            ) : (
              <>{value}</>
            )}
          </>
        );
    }
  }

  return <TableCell align="center">{compileField()}</TableCell>;
}
