import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  TableContainer,
} from "@mui/material";
import useUserRoleStore from "../../../../store/useUserStore";
import { getUsersData } from "~/utils/api/users/get.users.service";
import { getOperatorsData } from "~/utils/api/operators/get.operators.service";
import { User, Operator } from "~/types/types";
import { EditModalPageProps } from "~/types/interfaces";
import { SortableTableCell, filterData, sortData } from "../../../utils/sortPaginationSearch";
import useDetailTableStore from "../../../../store/useTableStore";
import SearchIcon from "@mui/icons-material/Search";

const EditModalPage: React.FC<EditModalPageProps> = ({ userId, onClose }) => {
  const {
    editLogColumns: columns,
    modalData,
    setModalData,
    setOperatorMap,
    setEditLogColumns,
  } = useUserRoleStore();
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

  const paginatedData = modalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEditResponse = await getUsersData<{ success: boolean; data: { data: User[] } }>(
          `/users/getEditLog?userId=${userId}`
        );
        const operatorEditResponse = await getOperatorsData<Record<number, Operator>>("/operators/getOperatorEdits");

        if (userEditResponse.success && userEditResponse.data && Array.isArray(userEditResponse.data.data)) {
          const filteredLogs = userEditResponse.data?.data?.filter((log) => log.UserId === userId) || [];
          setModalData(filteredLogs);
        }

        if (operatorEditResponse.success && operatorEditResponse.data) {
          setOperatorMap(operatorEditResponse.data);
        }
      } catch (error) {
        console.error("Error during fetching data:", error);
      }
    };

    if (userId) {
      fetchData();
    }

    setEditLogColumns([
      { key: "EditedBy", label: "Edited By", sortable: true, filterable: true },
      { key: "CreatedAt", label: "Time Edited", sortable: true, filterable: false },
      { key: "OldValue", label: "Previous Value", sortable: false, filterable: false },
      { key: "NewValue", label: "New Value", sortable: false, filterable: false },
      { key: "Remarks", label: "Remarks", sortable: false, filterable: false },
    ]);
  }, [userId, setModalData, setOperatorMap, setEditLogColumns]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-55 backdrop-blur-sm">
      <div className="bg-[#F8F0E3] w-full max-w-5xl mx-auto rounded-lg shadow-lg p-7 pt-9 relative overflow-hidden max-h-[90vh]">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Edit Log History</h2>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              backgroundColor: "#ACA993",
              position: "absolute",
              right: 20,
              top: 20,
              padding: 0,
              width: 30,
              height: 30,
            }}
          >
            <CloseIcon style={{ fontSize: 16 }} />
          </IconButton>
        </div>

        <TableContainer>
          <div className="relative w-[350px] py-3">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-[8px] bg-transparent border border-[#0038A8] rounded-md text-sm focus:outline-none"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon style={{ fontSize: 20 }} />
            </div>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <div className="flex flex-col items-center py-7 text-[#0038A8]">
                      <PersonOffIcon style={{ fontSize: 50 }} />
                      <h6 className="mt-2 font-sm text-lg">No edit logs available</h6>
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
                            ? col.render(row)
                            : typeof value === "string" || typeof value === "number"
                              ? value.toString()
                              : Array.isArray(value)
                                ? value.map((v: any) => v?.CityName ?? v?.toString()).join(", ")
                                : ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="p-3">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={modalData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default EditModalPage;
