import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ManagerTable, { User } from "~/components/user/UserTable";
import EditLogModalPage, { EditLogFields } from "~/components/user/EditLogModal";
import TextField from "@mui/material/TextField";
import { filterStyles } from "../styles/theme";
import { Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

// SortConfig interface
interface SortConfig {
  key: keyof User;
  direction: "asc" | "desc";
}

interface SortableTableCellProps {
  label: string;
  sortKey: keyof (User & EditLogFields);
  sortConfig: { key: keyof (User & EditLogFields); direction: "asc" | "desc" };
  onSort: (sortKey: keyof (User & EditLogFields)) => void;
  isFilterVisible?: boolean;
  filterValue?: string;
  onFilterChange?: (value: string | Dayjs | null) => void;
}

// Component
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

  // Text input handler
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onFilterChange) {
      onFilterChange(event.target.value);
    }
  };

  // DatePicker handler (Format: "YYYY/MM/DD")
  const handleDateChange = (date: Dayjs | null) => {
    if (onFilterChange) {
      onFilterChange(date ? date.format("YYYY-MM-DD") : ""); // Match filtering format
    }
  };  

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
                format="YYYY/MM/DD" // Set display format
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

// Sorting function
export function sortData<T extends User | EditLogFields>(
  data: T[],
  sortConfig: { key: keyof T; direction: "asc" | "desc" }
): T[] {
  return [...data].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    // Ensure DateOfRegistration or CreatedAt is parsed correctly
    if (sortConfig.key === "DateOfRegistration" || sortConfig.key === "CreatedAt") {
      const dateA = dayjs(valueA as string).valueOf(); // Convert to timestamp
      const dateB = dayjs(valueB as string).valueOf(); // Convert to timestamp

      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // If both are strings, compare lexicographically
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // If both are numbers, compare numerically
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });
}

// Handle sorting
export const handleSort = <T extends keyof (User & EditLogFields)>(
  sortKey: T,
  sortConfig: { key: T; direction: "asc" | "desc" },
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: T; direction: "asc" | "desc" }>>
) => {
  let direction: "asc" | "desc" = "asc";

  if (sortConfig.key === sortKey && sortConfig.direction === "asc") {
      direction = "desc";
  }

  setSortConfig({ key: sortKey, direction });
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

// Search and Filter Function
export const filterData = (
  data: User[], // Accept only User[]
  filters: { [key: string]: string },
  filterKeys: string[]
) => {
  return data.filter((item) => {
    const searchValue = filters.searchQuery?.toLowerCase() || "";
    if (searchValue) {
      const fullName = `${item.FirstName || ""} ${item.LastName || ""}`.toLowerCase();
      const createdByFullName = `${item.CreatedByFirstName || ""} ${item.CreatedByLastName || ""}`.toLowerCase();

      const matches =
        Object.values(item).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(searchValue)
        ) ||
        fullName.includes(searchValue) ||
        createdByFullName.includes(searchValue);

      if (!matches) {
        return false;
      }
    }

    // Handle individual filters
    return filterKeys.every((key) => {
      const filterValue = filters[key] || "";

      if (key === "DateOfRegistration" && item[key]) {
        const itemDate = dayjs(item[key]).format("YYYY-MM-DD");
        const filterDate = dayjs(filters[key]).format("YYYY-MM-DD");

        if (filters[key]) {
          return itemDate === filterDate;
        }
      }

      // Handle Status filtering (Active/Inactive)
      if (key === "Status" && filterValue) {
        const normalizedFilter = filterValue.toLowerCase();
        if (normalizedFilter === "active") {
          return item.IsDeleted === 0;
        } else if (normalizedFilter === "inactive") {
          return item.IsDeleted !== 0;
        }
      }

      // Handle CreatedBy filtering
      if (key === "CreatedBy") {
        return item.CreatedBy?.toLowerCase().includes(filterValue.toLowerCase());
      }

      // Default filtering for other fields
      const itemValue = item[key];
      if (filterValue) {
        if (!itemValue || !String(itemValue).toLowerCase().includes(filterValue.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  });
};
