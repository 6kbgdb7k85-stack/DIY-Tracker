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
import React, { useState } from "react";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableCellWrapper from "./TableCellWrapper";

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
  onRowClick,
  onPage,
  onChange
}) {
  const [open, setOpen] = useState();

  function rowClick(event,row){
    if (event.target.localName.toLowerCase()==='td'){
        onRowClick(row.id)
    }
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
              {[...Array(pagination.perPage)].map((_, idx) => (
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
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((rowData, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <TableRow hover onClick={(e)=>rowClick(e,rowData)}
                        sx={{
                          "& > .MuiTableCell-root": { borderBottom: "unset" },
                        }}
                      >
                        {expandedTable ? (
                          <TableCell>
                            <IconButton
                              aria-label={open ? "collapse row" : "expand row"}
                              aria-expanded={open}
                              aria-controls={idx + "-expanded"}
                              size="small"
                              onClick={() => setOpen(!open)}
                            >
                              {open ? (
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
                            <TableCellWrapper key={`${idx}-${col.id}`} id={col.id} rowId={rowData['id']} value={val} type={col.type} onChange={onChange}/>
                          );
                        })}
                      </TableRow>
                      {expandedTable ? (
                        <TableRow
                          id={idx + "-expanded"}
                          aria-hidden={!open ? true : undefined}
                        >
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse in={open} timeout="auto" unmountOnExit>
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
                                        >
                                          {xcol.label}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {rowData[expandedTable.dataCol].map(
                                      (xdata, xdataIndex) => (
                                        <TableRow key={"xdata-" + xdataIndex}>
                                          {expandedTable.cols.map(
                                            (xcol, xi) => (
                                              <TableCell
                                                key={xdataIndex + "-" + xi}
                                              >
                                                {xdata[xcol.id]}
                                              </TableCell>
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
              </TableBody>
            </Table>
          </TableContainer>
          {pagination?(<TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component={"div"}
            count={pagination.total}
            rowsPerPage={pagination.perPage}
            page={pagination.page - 1}
            onPageChange={onPage}
            onRowsPerPageChange={onPage}
          />):<></>}
        </>
      )}
    </Paper>
  );
}
