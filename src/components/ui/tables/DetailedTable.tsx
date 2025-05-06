import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import useDetailTableStore from "../../../../store/useTableStore";
import { SortableTableCell, filterData, sortData } from "../../../utils/sortPaginationSearch";
import { Column, Operator, User } from "../../../types/types";
import { buttonStyles } from "~/styles/theme";

// Type guard to check if `row` is a `User`
const isUser = (row: User | Operator): row is User => {
  return (row as User).FirstName !== undefined;  // Checks if it's a User
};

// Type guard to check if `row` is an `Operator`
const isOperator = (row: User | Operator): row is Operator => {
  return (row as Operator).OperatorName !== undefined;  // Checks if it's an Operator
};

interface DetailedTableProps<T> {
  data: T[];
  columns: Column[];
  onCreate?: () => void;
  actionsRender?: (row: T) => React.ReactNode;
  pageType?: "manager" | "executive";
  showExportButton?: boolean;
  onExportCSV?: () => void;
  operatorMap?: { [key: number]: Operator };
}

const DetailedTable = <T extends User | Operator>({
  data,
  columns,
  onCreate,
  actionsRender,
  pageType,
  showExportButton = true,
  onExportCSV,
  operatorMap,
}: DetailedTableProps<T>) => {
  const {
    searchQuery,
    setIsFilterActive,
    isFilterActive,
    page,
    rowsPerPage,
    sortConfig,
    filters,
    handleChangePage,
    handleChangeRowsPerPage,
    setSearchQuery,
  } = useDetailTableStore();

  // FILTER + SEARCH
  const filteredData = useMemo(() => {
    const filterKeys = columns
      .filter((col) => col.filterable)
      .map((col) => col.filterKey || col.key.toString());

    const updatedFilters = { ...filters, searchQuery };

    return filterData(data, filterKeys, updatedFilters, operatorMap as { [key: number]: Operator });
  }, [data, filters, searchQuery, columns, operatorMap]);

  // SORT
  const sortedData = useMemo(() => sortData(filteredData, sortConfig), [filteredData, sortConfig]);

  // PAGINATION
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  return (
    <>
      <TableContainer>
        <div className="flex justify-between items-center py-3 px-1">
          <div className="flex items-center">
            <div className="relative w-[350px]">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-[10px] bg-transparent border border-gray-300 rounded-md text-sm focus:outline-none"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon style={{ fontSize: 20 }} />
              </div>
            </div>
            <IconButton onClick={() => setIsFilterActive(!isFilterActive)} className="ml-2">
              {isFilterActive ? <FilterListOffIcon /> : <FilterListIcon />}
            </IconButton>
          </div>
          {onCreate && (
            <Button variant="contained" onClick={onCreate} sx={buttonStyles}>
              {pageType === "manager" ? "Add Manager" : "Add Executive"}
            </Button>
          )}
        </div>

        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) =>
                col.sortable || col.filterable ? (
                  <SortableTableCell
                    key={col.key}
                    label={col.label}
                    sortKey={col.key.toString()}
                    isFilterVisible={isFilterActive && col.filterable}
                  />
                ) : (
                  <TableCell key={col.key}>{col.label}</TableCell>
                )
              )}
              {actionsRender && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actionsRender ? 1 : 0)} align="center">
                  <div className="flex flex-col items-center py-5">
                    <PersonOffIcon className="text-gray-500" style={{ fontSize: 50 }} />
                    <h6 className="mt-2 font-medium text-gray-400 text-lg">
                      {pageType === "manager" ? "No managers available" : "No executives available"}
                    </h6>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row)
                        : isUser(row) && col.key in row
                        ? String(row[col.key as keyof User] ?? "")
                        : isOperator(row) && col.key in row
                        ? String(row[col.key as keyof Operator] ?? "")
                        : ""}
                    </TableCell>
                  ))}
                  {actionsRender && <TableCell>{actionsRender(row as T)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-3">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </TableContainer>
      {showExportButton && (
        <div className="flex justify-end pt-2">
          <Button variant="contained" onClick={onExportCSV} sx={[buttonStyles, { marginTop: "0.5rem" }]}>
            Export as CSV
          </Button>
        </div>
      )}
    </>
  );
};

export default DetailedTable;
