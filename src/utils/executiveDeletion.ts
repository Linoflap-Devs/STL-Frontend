import ManagerTable, { User } from "~/components/user/UserTable";
import Swal from "sweetalert2";

export const executiveDeletion = (
  sortedFilteredExecutive: User[],
  selectedExecutiveIds: Set<number>,
  setSelectedExecutiveIds: React.Dispatch<React.SetStateAction<Set<number>>>,
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>,
  onDelete: (ids: number[]) => void,
  page: number,
  rowsPerPage: number
) => {
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedUserIds = new Set<number>();
    const usersForCurrentPage = sortedFilteredExecutive.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const allOnPageSelected = usersForCurrentPage.every((user) =>
      selectedExecutiveIds.has(user.id!)
    );

    if (allOnPageSelected) {
      usersForCurrentPage.forEach((user) => newSelectedUserIds.delete(user.id!));
    } else {
      usersForCurrentPage.forEach((user) => newSelectedUserIds.add(user.id!));
    }
    setSelectedExecutiveIds(newSelectedUserIds);
    setSelectedCount(newSelectedUserIds.size);
  };

  const isAllSelected =
  sortedFilteredExecutive.length > 0 && selectedExecutiveIds.size === sortedFilteredExecutive.length;

  // Delete selected users
  const handleDeleteSelectedExecutives = () => {
    if (selectedExecutiveIds.size === 0) return;

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
        onDelete(Array.from(selectedExecutiveIds));

        Swal.fire({
          title: "Deleted!",
          text: "The selected managers have been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        setSelectedExecutiveIds(new Set());
        setSelectedCount(0);
      }
    });
  };

  // Handle individual user selection
  const handleSelectExecutive = (
    event:
      | React.MouseEvent<HTMLTableRowElement, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>,
    userId: number | undefined
  ) => {
    if (userId === undefined) return;

    if (event.type === "click" && event.target instanceof HTMLTableRowElement) {
      event.stopPropagation();
    }

    const newSelectedUserIds = new Set(selectedExecutiveIds);
    
    // If the user is already selected, remove them, otherwise add them
    if (newSelectedUserIds.has(userId)) {
      newSelectedUserIds.delete(userId);
    } else {
      newSelectedUserIds.add(userId);
    }

    setSelectedExecutiveIds(newSelectedUserIds);
    setSelectedCount(newSelectedUserIds.size);
  };

  return {
    handleSelectAll,
    isAllSelected,
    handleDeleteSelectedExecutives,
    handleSelectExecutive,
  };
};
