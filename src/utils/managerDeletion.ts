import ManagerTable, { User } from "~/components/manager/ManagerTable";
import Swal from "sweetalert2";

export const managerDeletion = (
  sortedUsers: User[],
  selectedUserIds: Set<number>,
  setSelectedUserIds: React.Dispatch<React.SetStateAction<Set<number>>>,
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>,
  onDelete: (ids: number[]) => void
) => {
  // Select all users checkbox
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedUserIds = new Set<number>();
    if (event.target.checked) {
      sortedUsers.forEach((user) => newSelectedUserIds.add(user.id!));
    }
    setSelectedUserIds(newSelectedUserIds);
    setSelectedCount(newSelectedUserIds.size);
  };

  // Check if all users are selected
  const isAllSelected =
    sortedUsers.length > 0 && selectedUserIds.size === sortedUsers.length;

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
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(Array.from(selectedUserIds));

        Swal.fire({
          title: "Deleted!",
          text: "The selected users have been deleted.",
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
    event: React.ChangeEvent<HTMLInputElement>,
    userId: number
  ) => {
    const newSelectedUserIds = new Set(selectedUserIds);
    if (event.target.checked) {
      newSelectedUserIds.add(userId);
    } else {
      newSelectedUserIds.delete(userId);
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
