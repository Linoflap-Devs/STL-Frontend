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
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useDetailTableStore from "../../../../store/useTableStore";
import { SortableTableCell, filterData, sortData } from "../../../utils/sortPaginationSearch";
import { Column, User } from "../../../types/interfaces";
import { buttonStyles } from "~/styles/theme";
import { Operator } from "~/types/types";

interface DetailedTableProps<T> {
  data: T[];
  columns: Column<T>[];
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
    anchorEl,
    selectedRow,
    setAnchorEl,
    setSelectedRow,
    resetMenu,
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

  function handleView(row: Operator | User): void {
    throw new Error("Function not implemented.");
  }

  function handleDelete(row: Operator | User): void {
    throw new Error("Function not implemented.");
  }

  return (
    <React.Fragment>
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
                {pageType === "manager"
                  ? "Add Manager"
                  : pageType === "executive"
                  ? "Add Executive"
                  : "Add Operator"}
              </Button>
            )}
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) =>
                col.sortable || col.filterable ? (
                  <SortableTableCell
                    key={String(col.key)}
                    label={col.label}
                    sortKey={String(col.key)}
                    isFilterVisible={isFilterActive && col.filterable}
                  />
                ) : (
                  <TableCell key={String(col.key)}>{col.label}</TableCell>
                )
              )}
              <TableCell>Actions</TableCell>
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
                  {columns.map((col) => {
                    const key = String(col.key);
                    const value = (row as any)[key];
                    return (
                      <TableCell key={key}>
                        {col.render
                          ? col.render(row as T)
                          : col.filterValue
                            ? typeof col.filterValue === "function"
                              ? col.filterValue(row as T)
                              : col.filterValue
                            : typeof value === "string" || typeof value === "number"
                              ? value.toString()
                              : Array.isArray(value)
                                ? value.map((v: any) => v?.CityName ?? v?.toString()).join(", ")
                                : ""}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <IconButton onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedRow(row as T);
                    }}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={resetMenu}
                    >
                      <MenuItem onClick={() => {
                        handleView(selectedRow);
                        resetMenu();
                      }}>
                        View
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleDelete(selectedRow);
                        resetMenu();
                      }}>
                        Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
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
    </React.Fragment>
  );
};

export default DetailedTable;
