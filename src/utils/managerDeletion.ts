import ManagerTable, { User } from "~/components/manager/ManagerTable";
import Swal from "sweetalert2";

export const managerDeletion = (
  sortedFilteredUsers: User[],
  selectedUserIds: Set<number>,
  setSelectedUserIds: React.Dispatch<React.SetStateAction<Set<number>>>,
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>,
  onDelete: (ids: number[]) => void,
  page: number,
  rowsPerPage: number
) => {
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedUserIds = new Set<number>();
    const usersForCurrentPage = sortedFilteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const allOnPageSelected = usersForCurrentPage.every((user) =>
      selectedUserIds.has(user.id!)
    );

    if (allOnPageSelected) {
      usersForCurrentPage.forEach((user) => newSelectedUserIds.delete(user.id!));
    } else {
      usersForCurrentPage.forEach((user) => newSelectedUserIds.add(user.id!));
    }
    setSelectedUserIds(newSelectedUserIds);
    setSelectedCount(newSelectedUserIds.size);
  };

  const isAllSelected =
    sortedFilteredUsers.length > 0 && selectedUserIds.size === sortedFilteredUsers.length;

  // Delete selected users
  const handleDeleteSelectedManagers = () => {
    if (selectedUserIds.size === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4683D4",
      cancelButtonColor: "#D43D38",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(Array.from(selectedUserIds));

        Swal.fire({
          title: "Deleted!",
          text: "The selected managers have been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        setSelectedUserIds(new Set());
        setSelectedCount(0);
      }
    });
  };

  // Handle individual user selection
  const handleSelectManager = (
    event:
      | React.MouseEvent<HTMLTableRowElement, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>,
    userId: number | undefined
  ) => {
    if (userId === undefined) return;

    if (event.type === "click" && event.target instanceof HTMLTableRowElement) {
      event.stopPropagation();
    }

    const newSelectedUserIds = new Set(selectedUserIds);

    // If the user is already selected, remove them, otherwise add them
    if (newSelectedUserIds.has(userId)) {
      newSelectedUserIds.delete(userId);
    } else {
      newSelectedUserIds.add(userId);
    }

    setSelectedUserIds(newSelectedUserIds);
    setSelectedCount(newSelectedUserIds.size);
  };

  return {
    handleSelectAll,
    isAllSelected,
    handleDeleteSelectedManagers,
    handleSelectManager,
  };
};
