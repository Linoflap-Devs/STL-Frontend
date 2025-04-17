import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TextField from "@mui/material/TextField";
import { Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { User } from "~/pages/Protected/users/[role]";
import { filterStyles } from "~/styles/theme";
import { EditLogFields } from "~/components/user/EditLogModal";
import { userAgent } from "next/server";

interface SortableTableCellProps {
  label: string;
  sortKey: keyof (User & EditLogFields);
  sortConfig: { key: keyof (User & EditLogFields); direction: "asc" | "desc" };
  onSort: (sortKey: keyof (User & EditLogFields)) => void;
  isFilterVisible?: boolean;
  filterValue?: string;
  onFilterChange?: (value: string | Dayjs | null) => void;
}

// Component for sortable table cell
export const SortableTableCell: React.FC<SortableTableCellProps> = ({
  label,
  sortKey,
  sortConfig,
  onSort,
  isFilterVisible = false,
  filterValue,
  onFilterChange,
}) => {
  const handleSort = () => {
    onSort(sortKey);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange && onFilterChange(event.target.value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    onFilterChange && onFilterChange(date ? date.format("YYYY-MM-DD") : "");
  };

  // Log values before rendering the JSX
  console.log('Sorting Key:', sortConfig.key);  // Log the current sorting key
  console.log('Sort Key from Props:', sortKey);  // Log the sortKey passed to the component
  console.log('Current Sort Direction:', sortConfig.direction);  // Log the current sorting direction

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TableCell sx={{ cursor: "pointer" }} onClick={handleSort}>
        {sortConfig.key === sortKey && (
          <Tooltip title={`Sort ${label} ${sortConfig.direction === "asc" ? "Ascending" : "Descending"}`}>
            <span>
              {sortConfig.direction === "asc" ? (
                <KeyboardArrowUpIcon sx={{ fontSize: 16, marginRight: 1 }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ fontSize: 16, marginRight: 1 }} />
              )}
            </span>
          </Tooltip>
        )}
        {label}

        {/* Filter Input Section */}
        {isFilterVisible && onFilterChange && (
          <div>
            {sortKey === "DateOfRegistration" ? (
              <DatePicker
                value={filterValue ? dayjs(filterValue, "YYYY/MM/DD") : null}
                onChange={handleDateChange}
                format="YYYY/MM/DD"
                slotProps={{
                  textField: {
                    variant: "filled",
                    fullWidth: true,
                    sx: filterStyles,
                    placeholder: "YYYY/MM/DD",
                    onClick: (e) => e.stopPropagation(),
                  },
                }}
              />
            ) : (
              <TextField
                id="filter-input"
                placeholder={`Filter by ${label}`}
                variant="filled"
                value={filterValue || ""}
                onChange={handleTextChange}
                fullWidth
                sx={filterStyles}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        )}
      </TableCell>
    </LocalizationProvider>
  );
};

// Function to get the nested value
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function sortData<T extends User | EditLogFields>(
  data: T[],
  sortConfig: { key: keyof T; direction: "asc" | "desc" }
): T[] {
  console.log("Sorting data with config:", sortConfig);

  return [...data].sort((a, b) => {
    const valueA = getNestedValue(a, sortConfig.key as string);
    const valueB = getNestedValue(b, sortConfig.key as string);

    console.log("Comparing values:", valueA, valueB);

    const isValidDate = (value: any): value is string => {
      return typeof value === "string" || value instanceof Date || dayjs(value).isValid();
    };

    if (["DateOfRegistration", "CreatedAt"].includes(sortConfig.key as string)) {
      if (isValidDate(valueA) && isValidDate(valueB)) {
        const dateA = dayjs(valueA).valueOf();
        const dateB = dayjs(valueB).valueOf();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });
}

// handle sort function
export const handleSort = <T extends keyof (User & EditLogFields)>(
  sortKey: T,
  sortConfig: { key: T; direction: "asc" | "desc" },
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: T; direction: "asc" | "desc" }>>
) => {
  const direction = sortConfig.key === sortKey && sortConfig.direction === "asc" ? "desc" : "asc";
  setSortConfig({ key: sortKey, direction });
};

// filtering logic
export const filterData = (
  data: User[],
  filters: { [key: string]: string },
  filterKeys: string[]
) => {
  return data.filter((item) => {
    const searchValue = filters.searchQuery?.toLowerCase() || "";
    const filterItem = (key: string, value: string | undefined) => {
      return value && value.toLowerCase().includes(searchValue);
    };

    if (searchValue && !Object.values(item).some((val) => filterItem("", String(val)))) {
      const fullName = `${item.FirstName || ""} ${item.LastName || ""}`.toLowerCase();
      const createdByFullName = `${item.CreatedByFirstName || ""} ${item.CreatedByLastName || ""}`.toLowerCase();
      const operatorName = item.OperatorDetails?.OperatorName?.toLowerCase() || "";

      if (![fullName, createdByFullName, operatorName].some((val) => val.includes(searchValue))) {
        return false;
      }
    }

    return filterKeys.every((key) => {
      const filterValue = filters[key] || "";
      const itemValue = item[key as keyof User] || "";

      if (key === "DateOfRegistration") {
        const itemDate = dayjs(item[key]).format("YYYY-MM-DD");
        const filterDate = dayjs(filters[key]).format("YYYY-MM-DD");
        return filterValue ? itemDate === filterDate : true;
      }

      if (key === "CreatedBy") {
        return item.CreatedBy?.toLowerCase().includes(filterValue.toLowerCase());
      }

      return filterValue ? itemValue.toString().toLowerCase().includes(filterValue.toLowerCase()) : true;
    });
  });
};

// Handle page change
export const handleChangePage = (
  event: React.MouseEvent<HTMLButtonElement> | null,
  newPage: number,
  setPage: React.Dispatch<React.SetStateAction<number>>
) => {
  setPage(newPage);
};

// Handle rows per page change
export const handleChangeRowsPerPage = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const newValue = parseInt(event.target.value, 10);
  setRowsPerPage(newValue);
};

