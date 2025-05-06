import React from 'react';
import TableCell from '@mui/material/TableCell';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TextField from '@mui/material/TextField';
import { Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import useDetailTableStore from "../../store/useTableStore";
import { User, SortableTableCellProps, Operator } from '../types/types';
import { filterStyles } from "~/styles/theme";

// SORTING + FILTERING COMPONENT
export const SortableTableCell: React.FC<SortableTableCellProps> = ({
  label,
  sortKey,
  isFilterVisible = false,
}) => {
  const { sortConfig, setSortConfig, filters, setFilters } = useDetailTableStore();

  const handleSort = () => {
    const direction =
      sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: sortKey, direction });
  };

 // Handle filter change for text fields
  const handleFilterChange = (key: string) => (value: string | Dayjs | null) => {
    let filterValue: string;

    // Handle date filters if the value is a Dayjs object
    if (dayjs.isDayjs(value)) {
      filterValue = value.isValid() ? value.format("YYYY-MM-DD") : "";
    } else {
      filterValue = value || "";
    }

    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [key]: filterValue,
      };
      return updatedFilters;
    });
  };
 
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [sortKey]: date ? date.format('YYYY-MM-DD') : '',
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TableCell sx={{ cursor: 'pointer' }} onClick={handleSort}>
        {sortConfig.key === sortKey && (
          <Tooltip title={`Sort ${label} ${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'}`}>
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

        {isFilterVisible && (
          <div>
            {sortKey === 'DateOfRegistration' ? (
              <DatePicker
                value={filters[sortKey] ? dayjs(filters[sortKey]) : null}
                onChange={handleDateChange}
                format="YYYY/MM/DD"
                slotProps={{
                  textField: {
                    variant: 'filled',
                    fullWidth: true,
                    sx: filterStyles,
                    placeholder: 'YYYY/MM/DD',
                  },
                }}
              />
            ) : (
              <TextField
                placeholder={`Filter by ${label}`}
                variant="filled"
                value={filters[sortKey] || ''}
                onChange={(event) => handleFilterChange(sortKey)(event.target.value)}
                fullWidth
                className="bg-transparent"
                sx={filterStyles}
              />
            )}
          </div>
        )}
      </TableCell>
    </LocalizationProvider>
  );
};

// SORTING FUNCTION
export function sortData<T>(
  data: T[],
  sortConfig: { key: string; direction: 'asc' | 'desc' }
): T[] {
  return [...data].sort((a, b) => {
    const valueA = getNestedValue(a, sortConfig.key);
    const valueB = getNestedValue(b, sortConfig.key);

    const isValidDate = (value: any): boolean => {
      return typeof value === 'string' || value instanceof Date || dayjs(value).isValid();
    };

    if (isValidDate(valueA) && isValidDate(valueB)) {
      const dateA = dayjs(valueA).valueOf();
      const dateB = dayjs(valueB).valueOf();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });
}

// Helper function to get nested value safely
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// FILTERING + SEARCHING FUNCTION
export const filterData = (
  data: (User | Operator)[],  // can you make this generic instead of using User | Operato
  filterKeys: string[],
  filters: { [key: string]: string },
  operatorMap: { [key: number]: Operator }
): (User | Operator)[] => {
  const searchValue = filters.searchQuery?.toLowerCase() || "";

  // Helper function to check if the search query matches any field value
  const filterItem = (key: string, value: string | undefined) => {
    return value && value.toLowerCase().includes(searchValue);
  };

  return data.filter((item) => {
    // If the item is a User or Operator, handle differently
    const operatorName = operatorMap?.[item.OperatorId]?.OperatorName
    ? operatorMap[item.OperatorId].OperatorName.toLowerCase()
    : "no operator";  

    // If there's a search query, check if any of the fields match the search query
    if (searchValue && !Object.values(item).some((val) => filterItem("", String(val)))) {
      const fullName = `${"FirstName" in item ? item.FirstName : ""} ${"LastName" in item ? item.LastName : ""}`.toLowerCase();
      const createdByFullName = `${"CreatedByFirstName" in item ? item.CreatedByFirstName : ""} ${"CreatedByLastName" in item ? item.CreatedByLastName : ""}`.toLowerCase();

      // Check if the search query matches any of the name fields or operator name
      if (![fullName, createdByFullName, operatorName].some((val) => val.includes(searchValue))) {
        return false;
      }
    }

    // Apply filters for all filter keys (other columns like DateOfRegistration)
    return filterKeys.every((key) => {
      const filterValue = filters[key]?.toLowerCase() || "";
      const itemValue = getNestedValue(item, key)?.toString().toLowerCase() || "";

      if (!filterValue) return true; // If no filter, include the item

      if (key === "DateOfRegistration") {
        // Compare dates if filtering by date
        const itemDate = dayjs(getNestedValue(item, key)).format("YYYY-MM-DD");
        const filterDate = dayjs(filterValue).format("YYYY-MM-DD");
        return itemDate === filterDate;
      }

      // Handle the 'OperatorName' filtering logic for Users
      if (key === "OperatorDetails.OperatorName" && "OperatorId" in item) {
        return operatorName.includes(filterValue);
      }

      return itemValue.includes(filterValue);
    });
  });
};


