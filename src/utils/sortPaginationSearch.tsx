import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ManagerTable, { User } from "~/components/manager/ManagerTable";

// SortConfig interface
interface SortConfig {
  key: keyof User;
  direction: "asc" | "desc";
}

// SortableTableCellProps interface
interface SortableTableCellProps {
  label: string;
  sortKey: keyof User;
  sortConfig: SortConfig;
  onSort: (sortKey: keyof User) => void;
  colSpan?: number;
}

// SortableTableCell component
export const SortableTableCell: React.FC<SortableTableCellProps> = ({
  label,
  sortKey,
  sortConfig,
  onSort,
}) => {
  const handleSort = () => {
    onSort(sortKey);
  };

  return (
    <TableCell sx={{ cursor: "pointer" }} onClick={handleSort}>
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === "asc" ? (
          <KeyboardArrowUpIcon sx={{ fontSize: 16, marginLeft: 1 }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: 16, marginLeft: 1 }} />
        )
      )}
    </TableCell>
  );
};

// Sorting function
export const sortData = (
  data: Array<{ [key: string]: any }>,
  sortConfig: { key: string; direction: "asc" | "desc" }
) => {
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
};

// Handle sorting
export const handleSort = (
  sortKey: keyof User,
  sortConfig: { key: keyof User; direction: "asc" | "desc" },
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof User; direction: "asc" | "desc" }>>
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

// Search Function
export const filterData = (
  data: User[],
  searchQuery: string,
  fields: (keyof User)[]
): User[] => {
  return data.filter(item =>
    fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    })
  );
};