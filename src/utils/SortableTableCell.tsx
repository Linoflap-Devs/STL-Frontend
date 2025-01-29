import React from "react";
import TableCell from "@mui/material/TableCell";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ManagerTable, { User } from '~/components/manager/ManagerTable';

interface SortableTableCellProps {
  label: string;
  sortKey: keyof User;
  sortConfig: SortConfig;
  onSort: (sortKey: keyof User) => void;
}

interface SortConfig {
    key: string;
    direction: "asc" | "desc";
  }

  export const SortableTableCell: React.FC<SortableTableCellProps> = ({
    label,
    sortKey,
    sortConfig,
    onSort,
    
  }) => {
    return (
      <TableCell sx={{ cursor: "pointer" }} onClick={() => onSort(sortKey)}>
        {label}
        {sortConfig.key === sortKey &&
          (sortConfig.direction === "asc" ? (
            <KeyboardArrowUpIcon sx={{ fontSize: 16, marginLeft: 1 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: 16, marginLeft: 1 }} />
          ))}
      </TableCell>
    );
  };