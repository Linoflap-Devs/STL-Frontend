import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import ManagerTable, { User } from "~/components/manager/ManagerTable";
import TextField from "@mui/material/TextField";
import { filterStyles } from "../styles/theme";

// SortConfig interface
interface SortConfig {
  key: keyof User;
  direction: "asc" | "desc";
}

interface SortableTableCellProps {
  label: string;
  sortKey: keyof User;
  sortConfig: SortConfig;
  onSort: (sortKey: keyof User) => void;
  isFilterVisible: boolean;
  onFilterToggle: () => void;
  filterValue: string;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colSpan?: number;
}

export const SortableTableCell: React.FC<SortableTableCellProps> = ({
  label,
  sortKey,
  sortConfig,
  onSort,
  isFilterVisible,
  onFilterToggle,
  filterValue,
  onFilterChange,
}) => {
  const handleSort = () => {
    onSort(sortKey);
  };

  return (
    <TableCell sx={{ cursor: "pointer" }} onClick={handleSort}>
      {sortConfig.key === sortKey &&
        (sortConfig.direction === "asc" ? (
          <KeyboardDoubleArrowUpIcon sx={{ fontSize: 16, marginLeft: 1 }} />
        ) : (
          <KeyboardDoubleArrowDownIcon sx={{ fontSize: 16, marginLeft: 1 }} />
        ))}{" "}
      {label}
      {isFilterVisible && (
        <div>
          <TextField
            id="filter-input"
            placeholder={`Filter by ${label}`} // No label
            variant="filled" // Set the variant to 'filled'
            value={filterValue} // Controlled value
            onChange={onFilterChange} // Handle change
            fullWidth
            sx={filterStyles}
          />
        </div>
      )}
    </TableCell>
  );
};

// Sorting function
export function sortData(
  data: User[],
  sortConfig: { key: keyof User; direction: "asc" | "desc" }
): User[] {
  return [...data].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);

      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return sortConfig.direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
    }

    return 0;
  });
}

// Handle sorting
export const handleSort = (
  sortKey: keyof User,
  sortConfig: { key: keyof User; direction: "asc" | "desc" },
  setSortConfig: React.Dispatch<
    React.SetStateAction<{ key: keyof User; direction: "asc" | "desc" }>
  >
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
  data: User[],
  filters: { [key: string]: string },
  filterKeys: string[]
) => {
  return data.filter((item) => {
    return filterKeys.every((key) => {
      const filterValue = filters[key] || "";
      const searchValue = filters.searchQuery || "";
      return (
        (filterValue
          ? item[key]?.toLowerCase().includes(filterValue.toLowerCase())
          : true) &&
        (searchValue
          ? Object.values(item).some(
              (val) =>
                typeof val === "string" &&
                val.toLowerCase().includes(searchValue.toLowerCase())
            )
          : true)
      );
    });
  });
};
