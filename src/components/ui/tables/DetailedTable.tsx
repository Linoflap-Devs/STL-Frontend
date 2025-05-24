import React, { useState, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, IconButton, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useDetailTableStore from "../../../../store/useTableStore";
import { SortableTableCell, filterData, sortData } from "../../../utils/sortPaginationSearch";
import { DetailedTableProps } from "../../../types/interfaces";
import { buttonStyles } from "~/styles/theme";
import { User, Operator, SortConfig } from "~/types/types";
import { useModalStore } from "../../../../store/useModalStore";
import { getUserStatus } from "~/utils/dashboarddata";
import dayjs from "dayjs";
import CSVExportButtonTable from "../buttons/CSVExportButtonTable";
import Swal from 'sweetalert2';
import router from "next/router";
import ConfirmSuspendModal from "~/components/shared/ConfirmSuspendModal";

const DetailedTable = <T extends User | Operator>({
  data,
  columns,
  actionsRender,
  pageType,
  operatorMap,
  onClose,
  endpoint,
  source,
  onAddClick 
}: DetailedTableProps<T>) => {
  const { searchQuery, setIsFilterActive, isFilterActive, page, rowsPerPage, sortConfig, filters, handleChangePage, handleChangeRowsPerPage, setSearchQuery, anchorEl, selectedRow, setAnchorEl, setSelectedRow, resetMenu } = useDetailTableStore();
  const [openEditLogModal, setOpenEditLogModal] = useState(false);
  const sevenDaysAgo = useMemo(() => dayjs().subtract(7, "day"), []);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isVerifySuspendModalOpen, setIsVerifySuspendModalOpen] = useState(false);

  const [formData, setFormData] = useState<{ [key: string]: string | number | string[] }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [actionType, setActionType] = useState<'suspend' | 'create' | 'update' | 'delete'>('suspend');
  const modalStore = useModalStore.getState();

  // FILTER + SEARCH
  const filteredData = useMemo(() => {
    const filterKeys = columns
      .filter((col) => col.filterable)
      .map((col) => col.filterKey ?? col.key?.toString())
      .filter((key): key is string => !!key);

    const enrichedData = data.map((item) => {
      const operator = operatorMap?.[item.OperatorId];
      return {
        ...item,
        OperatorDetails: {
          OperatorName: operator?.OperatorName || "",
        },
        Status: getUserStatus(item, sevenDaysAgo),
      };
    });

    return filterData(
      enrichedData,
      filterKeys,
      { ...filters, searchQuery },
      operatorMap as Record<number, Operator>
    );
  }, [data, filters, searchQuery, columns, operatorMap, sevenDaysAgo]);

  // SORTING
  const sortedData = useMemo(() => {
    if (!filteredData || !sortConfig) {
      return [];
    }
    // console.log('Filtered Data before Sorting:', filteredData);
    // console.log('Sort Config:', sortConfig);

    // Perform sorting operation
    const result = sortData(filteredData, sortConfig as SortConfig<User | Operator>);
    // console.log('Sorted Data:', result);

    return result;
  }, [filteredData, sortConfig]);

  // PAGINATION
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  const generateSlug = (operatorName: string, operatorId: number) =>
    `${operatorId}-${operatorName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")}`;

  const handleOpenViewModal = useCallback(() => {
    if (!selectedRow) {
      console.warn("[handleOpenViewModal] No selected row available.");
      return;
    }

    const { OperatorName, OperatorId } = selectedRow;

    if (source === "operators") {
      if (!OperatorName || !OperatorId) {
        console.warn(
          "[handleOpenViewModal] Missing OperatorName or OperatorId."
        );
        return;
      }
      
      // Include OperatorId in the slug to ensure correct fetch on refresh
      const slug = generateSlug(OperatorName, OperatorId);

      modalStore.setSelectedData(selectedRow);
      modalStore.setOperatorId(OperatorId);

      router.push(`/operators/${slug}`);
    } else {
      modalStore.openModal("view", selectedRow);
    }

    setOpenEditLogModal(false);
  }, [selectedRow, source, router, setOpenEditLogModal]);

  const handleClose = () => {
    setIsVerifyModalOpen(false); // Close the verification modal
    onClose?.();
  };

  const handleSuspend = async (row: T) => {
    console.log('handleSuspend called with row:', row);

    // Adjust this check according to your actual id field
    if (!row || (!('OperatorId' in row) || !row.OperatorId)) {
      console.error('Invalid user data:', row);
      setErrors({ form: 'Invalid user data. Cannot proceed with suspension.' });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to suspend this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, suspend!',
    });

    console.log('User confirmed suspension:', result.isConfirmed);

    if (result.isConfirmed) {
      const userId = 'OperatorId' in row ? row.OperatorId ?? '' : '';
      console.log('Setting formData with UserId:', userId);

      setFormData({
        UserId: userId,
      });

      console.log('Setting actionType to suspend and opening verify suspend modal');
      setActionType('suspend'); 
      setIsVerifySuspendModalOpen(true);

      setSelectedRow(null);
      resetMenu();
    } else {
      console.log('Suspension cancelled by user');
    }
  };

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
                className="w-full pl-9 pr-3 py-[10px] bg-transparent border border-[#0038A8] rounded-md text-sm focus:outline-none"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon style={{ fontSize: 20 }} />
              </div>
            </div>
            <IconButton onClick={() => setIsFilterActive(!isFilterActive)} className="ml-2">
              {isFilterActive ? (
                <FilterListOffIcon sx={{ color: "#ACA993" }} />
              ) : (
                <FilterListIcon sx={{ color: "#ACA993" }} />
              )}
            </IconButton>
          </div>
          <Button variant="contained" onClick={onAddClick} sx={buttonStyles}>
            {pageType === "manager"
              ? "Add Manager"
              : pageType === "executive"
                ? "Add Executive"
                : "Add Operator"}
          </Button>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '&:hover': { backgroundColor: '#F08060' } }}>
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
                <TableCell colSpan={columns.length + (actionsRender ? 1 : 1)} align="center">
                  <div className="flex flex-col items-center py-7 text-[#0038A8]">
                    <PersonOffIcon style={{ fontSize: 50 }} />
                    <h6 className="mt-2 font-sm text-lg">
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
                    <IconButton
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelectedRow(row as T);
                      }}
                    >
                      <MoreHorizIcon sx={{ color: "#0038A8" }} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={resetMenu}
                    >
                      <MenuItem
                        onClick={() => {
                          resetMenu(); // close menu first
                          handleOpenViewModal(); // then handle action
                        }}
                      >
                        View
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          if (selectedRow) handleSuspend(selectedRow);
                          resetMenu(); // close menu after delete
                        }}
                      >
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

        {isVerifySuspendModalOpen && (
          <ConfirmSuspendModal
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            actionType='suspend'
            setErrors={setErrors}
            open={isVerifySuspendModalOpen}
            endpoint={endpoint ?? { create: '', update: '' }}
            onClose={handleClose}
          />
        )}

      </TableContainer>
      <div className="flex justify-end pt-2">
        <CSVExportButtonTable
          pageType={pageType ?? "unknown"}
          columns={columns}
          statsPerRegion={data}
          operatorMap={operatorMap ? Object.values(operatorMap) : []}
        />
      </div>
    </React.Fragment>
  );
};

export default DetailedTable;
