import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableCellWrapper from "./TableCellWrapper";
import { FieldTypes } from "../../constants/FieldTypes";

/**
 * @param {Array} cols
 * @param {Array} data
 * @param {Object:{title,cols,dataCol}} expandedTable
 * @param {Object:{page,perPage,total,totalPages}} pagination
 * @param {Boolean} loading
 * @param {Boolean} expandedLoading
 * @returns {<Table>}
 */

export default function TableWrapper({
  cols,
  data,
  expandedTable,
  pagination,
  loading,
  onRowClick = () => {},
  onPage = () => {},
  onChange = () => {},
  onDelete,
  onAdd,
  canAdd,
  canEdit,
  onSave,
  lookups,
  totals,
}) {
  const [open, setOpen] = useState({});
  const [editRows, setEditRows] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  function rowClick(event, row) {
    const rowIndex = rows.findIndex((item) => item.id === row.id);
    if (
      event.target.localName.toLowerCase() === "td" &&
      !editRows.includes(rowIndex)
    ) {
      onRowClick(row.id);
    }
  }

  function isForeignKey(cols, colId) {
    const column = cols.find((col) => col.id === colId);
    return column.foreignKey;
  }

  function handleChange(e) {
    if (e.type === FieldTypes.EDIT_CHECKBOX) {
      onChange({ ...e, rowId: rows[e.rowId].id });
    } else {
      setRows((prevState) =>
        prevState.map((row, index) => {
          if (index !== e.rowId) {
            return row;
          }
          switch (e.type) {
            case FieldTypes.AUTOCOMPLETE:
              console.log(e);
              if (e.value?.id) {
                const newRow = { ...row, id: e.value.id };
                cols.forEach((col) => {
                  newRow[col.id] = e.value[col.id];
                });
                return newRow;
              } else {
                if (isForeignKey(cols, e.id)) {
                  return { [e.id]: e.value?.inputValue };
                }
                return { ...row, [e.id]: e.value?.inputValue };
              }
            case FieldTypes.NUMBER:
              if (!e.value) {
                return { ...row, [e.id]: 0 };
              }
              return { ...row, [e.id]: Number(e.value) };
            default:
              return { ...row, [e.id]: e.value };
          }
        }),
      );
    }
  }

  function addRow() {
    setEditRows((prevState) => {
      return [...prevState, rows.length];
    });
    const newRow = {};
    cols.forEach((col) => {
      switch (col.type) {
        case FieldTypes.CHECKBOX:
        case FieldTypes.EDIT_CHECKBOX:
          newRow[col.id] = false;
          break;
        case FieldTypes.NUMBER:
          newRow[col.id] = 0;
          break;
        default:
          newRow[col.id] = "";
          break;
      }
      if (expandedTable?.dataCol === col.id) {
        newRow[col.id] = [];
      }
    });
    setRows((prevState) => [...prevState, newRow]);
  }

  function handleSaveEdit(rowIndex) {
    if (editRows?.includes(rowIndex)) {
      onSave(rows[rowIndex]);
      setEditRows((prevState) =>
        prevState.filter((index) => index !== rowIndex),
      );
    } else {
      setEditRows((prevState) => [...prevState, rowIndex]);
    }
  }

  function handleCancel(rowIndex) {
    setEditRows((prevState) => prevState.filter((index) => index !== rowIndex));
    setRows(data);
  }

  function isReadOnly(column, row) {
    if (column.readOnly) {
      return true;
    }
    if (column.editRestriction) {
      if (column.editRestriction === "EDIT_IF_NEW" && row.id) {
        return true;
      }
    }
    return false;
  }

  return (
    <Paper>
      {loading ? (
        <Skeleton>
          <Table>
            <TableHead>
              <TableRow>
                {cols.map((col) => (
                  <TableCell key={col.id} align="center">
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(pagination?.perPage || 5)].map((_, idx) => (
                <TableRow key={idx}>
                  {cols.map((col) => (
                    <TableCell key={col.id} />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Skeleton>
      ) : (
        <>
          <TableContainer>
            <Table stickyHeader aria-label="table">
              <TableHead>
                <TableRow>
                  {expandedTable ? <TableCell /> : <></>}
                  {cols.map((col) => (
                    <TableCell key={col.id} align="center">
                      {col.label}
                    </TableCell>
                  ))}
                  {onDelete ? <TableCell /> : <></>}
                  {canAdd ? (
                    <TableCell sx={{ textAlign: "right" }}>
                      <IconButton aria-label="add" onClick={addRow}>
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  ) : (
                    <></>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((rowData, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <TableRow
                        hover
                        onClick={(e) => rowClick(e, rowData)}
                        sx={{
                          "& > .MuiTableCell-root": { borderBottom: "unset" },
                        }}
                      >
                        {expandedTable ? (
                          <TableCell>
                            <IconButton
                              aria-label={
                                open[idx] ? "collapse row" : "expand row"
                              }
                              aria-expanded={open[idx]}
                              aria-controls={idx + "-expanded"}
                              size="small"
                              onClick={() =>
                                setOpen((prevState) => ({
                                  ...prevState,
                                  [idx]: !prevState[idx],
                                }))
                              }
                            >
                              {open[idx] ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>
                        ) : null}
                        {cols.map((col) => {
                          const val = rowData[col.id];
                          return (
                            <TableCellWrapper
                              key={`${idx}-${col.id}`}
                              col={col}
                              rowId={idx}
                              value={val}
                              onChange={handleChange}
                              isEdit={
                                editRows?.includes(idx) &&
                                !isReadOnly(col, rowData)
                              }
                              lookups={lookups}
                            />
                          );
                        })}
                        {canEdit || canAdd ? (
                          <>
                            <TableCell align="center">
                              <IconButton onClick={() => handleSaveEdit(idx)}>
                                {editRows?.includes(idx) ? (
                                  <SaveIcon />
                                ) : (
                                  <>
                                    {canEdit ? (
                                      <>
                                        <EditIcon />
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                )}
                              </IconButton>
                            </TableCell>
                            {editRows.includes(idx) ? (
                              <TableCell align="center">
                                <IconButton onClick={() => handleCancel(idx)}>
                                  <CloseIcon />
                                </IconButton>
                              </TableCell>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        {onDelete && !editRows.includes(idx) ? (
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              onClick={() => onDelete(rowData.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        ) : (
                          <></>
                        )}
                        {onAdd ? <TableCell /> : <></>}
                      </TableRow>
                      {expandedTable ? (
                        <TableRow
                          id={idx + "-expanded"}
                          aria-hidden={!open[idx] ? true : undefined}
                        >
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse
                              in={open[idx]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  {expandedTable.title}
                                </Typography>
                                <Table
                                  size="small"
                                  aria-label={expandedTable.title}
                                >
                                  <TableHead>
                                    <TableRow>
                                      {expandedTable.cols.map((xcol, xi) => (
                                        <TableCell
                                          key={idx + "-expanded-" + xi}
                                          sx={{ textAlign: "center" }}
                                        >
                                          {xcol.label}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {rowData[expandedTable.dataCol]?.map(
                                      (xdata, xdataIndex) => (
                                        <TableRow key={"xdata-" + xdataIndex}>
                                          {expandedTable.cols.map(
                                            (xcol, xi) => (
                                              <TableCellWrapper
                                                key={xdataIndex + "-" + xi}
                                                col={xcol}
                                                value={xdata[xcol.id]}
                                              />
                                            ),
                                          )}
                                        </TableRow>
                                      ),
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <></>
                      )}
                    </React.Fragment>
                  );
                })}
                {totals ? (
                  <>
                    {totals.map((total, index) => {
                      if (index === 0) {
                        return (
                          <TableRow key={`totals-${index}`}>
                            <TableCell
                              rowSpan={totals.length}
                              colSpan={cols.length - 2}
                            />
                            <TableCell component="th" scope="row">
                              {total.header}
                            </TableCell>
                            <TableCell align="right">{total.value}</TableCell>
                          </TableRow>
                        );
                      } else {
                        return (
                          <TableRow key={`totals-${index}`}>
                            <TableCell component="th" scope="row">
                              {total.header}
                            </TableCell>
                            <TableCell align="right">{total.value}</TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </>
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {pagination ? (
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component={"div"}
              count={pagination.total}
              rowsPerPage={pagination.perPage}
              page={pagination.page - 1}
              onPageChange={(e, newPage) =>
                onPage({ perPage: pagination.perPage, page: newPage + 1 })
              }
              onRowsPerPageChange={(e) =>
                onPage({ perPage: parseInt(e.target.value, 10), page: 1 })
              }
            />
          ) : (
            <></>
          )}
        </>
      )}
    </Paper>
  );
}
