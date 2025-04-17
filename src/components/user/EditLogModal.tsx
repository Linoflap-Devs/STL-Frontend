import React, { Key, useEffect, useState } from "react";
import {
  IconButton,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  SortableTableCell,
  sortData,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
} from "../../utils/sortPaginationSearch";
import CloseIcon from "@mui/icons-material/Close";
import { editLogUser } from "~/utils/api/users";
import { Search } from "@mui/icons-material";

export interface EditLogFields {
  EditLogDetailsId: Key | null | undefined;
  User: string;
  EditedBy: string;
  CreatedAt: string;
  OldValue: string;
  NewValue: string;
  Remarks: string;
}

interface EditLogModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

const EditLogModalPage: React.FC<EditLogModalProps> = ({
  open,
  onClose,
  userId,
}) => {
  const [logData, setLogData] = useState<EditLogFields[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof EditLogFields;
    direction: "asc" | "desc";
  }>({
    key: "CreatedAt",
    direction: "asc",
  });

  const sortedData = sortData(logData, sortConfig);

  const filteredData = sortedData.filter((item) => {
    const searchLower = searchQuery?.toLowerCase() || "";
    return (
      (item.User?.toLowerCase() || "").includes(searchLower) ||
      (item.EditedBy?.toLowerCase() || "").includes(searchLower) ||
      (item.OldValue?.toLowerCase() || "").includes(searchLower) ||
      (item.NewValue?.toLowerCase() || "").includes(searchLower) ||
      (item.Remarks?.toLowerCase() || "").includes(searchLower)
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (open && userId) {
      fetchEditLogDetails();
    }
  }, [open, userId]);

  const fetchEditLogDetails = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await editLogUser(userId, {});
      if (response.success) {
        setLogData(response.data);
      } else {
        setError(response.message || "Failed to fetch logs");
      }
    } catch (err) {
      setError("Error fetching edit log details");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-[#1f1f1f] text-white w-full max-w-4xl mx-auto rounded-lg shadow-lg p-7 pt-9 relative overflow-hidden max-h-[90vh]">
            <div className="mb-4">
              {userId ? (
                <>
                  <h2 className="text-3xl font-bold">
                    {logData?.[0]?.User ?? "Unknown User"}
                  </h2>
                  <p className="text-sm text-gray-400">Manager</p>
                </>
              ) : (
                <p className="text-xl">No User Information</p>
              )}

              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  backgroundColor: "#171717",
                  position: "absolute",
                  right: 30,
                  top: 30,
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>

            {/* Content */}
            <div className="bg-[#171717] rounded-lg p-4 overflow-y-auto max-h-[65vh]">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <>
                  {/* Search */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search"
                        className="w-full bg-transparent border border-gray-600 pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <SortableTableCell
                          label="Edited By"
                          sortKey="EditedBy"
                          sortConfig={sortConfig}
                          onSort={() =>
                            handleSort("EditedBy", sortConfig, setSortConfig)
                          }
                        />
                        <SortableTableCell
                          label="Date"
                          sortKey="CreatedAt"
                          sortConfig={sortConfig}
                          onSort={() =>
                            handleSort("CreatedAt", sortConfig, setSortConfig)
                          }
                        />
                        <SortableTableCell
                          label="Old Value"
                          sortKey="OldValue"
                          sortConfig={sortConfig}
                          onSort={() =>
                            handleSort("OldValue", sortConfig, setSortConfig)
                          }
                        />
                        <SortableTableCell
                          label="New Value"
                          sortKey="NewValue"
                          sortConfig={sortConfig}
                          onSort={() =>
                            handleSort("NewValue", sortConfig, setSortConfig)
                          }
                        />
                        <SortableTableCell
                          label="Remarks"
                          sortKey="Remarks"
                          sortConfig={sortConfig}
                          onSort={() =>
                            handleSort("Remarks", sortConfig, setSortConfig)
                          }
                        />
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <div className="flex flex-col items-center py-5">
                              <EditIcon sx={{ fontSize: 50, color: "gray" }} />
                              <p className="text-gray-400 mt-4 text-lg font-medium">
                                No Edit Log found
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((log) => (
                          <TableRow key={log.EditLogDetailsId}>
                            <TableCell>{log.EditedBy}</TableCell>
                            <TableCell>
                              {new Date(log.CreatedAt).toLocaleString()}
                            </TableCell>
                            <TableCell>{log.OldValue || "N/A"}</TableCell>
                            <TableCell>{log.NewValue || "N/A"}</TableCell>
                            <TableCell>{log.Remarks || "No remarks"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      component="div"
                      count={filteredData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(event, newPage) =>
                        handleChangePage(event, newPage, setPage)
                      }
                      onRowsPerPageChange={(event) =>
                        handleChangeRowsPerPage(event, setRowsPerPage)
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default EditLogModalPage;
