// utility function to get user status based on the last login and registration date
// src\utils\dashboarddata.ts
import dayjs from "dayjs";

// Define the getUserStatus function
export const getUserStatus = (user: any, sevenDaysAgo: dayjs.Dayjs): string => {
  let status = "Active";
  if (user.IsActive === 0) {
    status = "Suspended";
  } else if (
    user.LastLogin &&
    dayjs(user.LastLogin).isBefore(sevenDaysAgo) &&
    user.LastTokenRefresh &&
    dayjs(user.LastTokenRefresh).isBefore(sevenDaysAgo)
  ) {
    status = "Inactive";
  } else if (
    user.DateOfRegistration &&
    dayjs(user.DateOfRegistration).isAfter(sevenDaysAgo)
  ) {
    status = "New";
  } else {
    //console.log("Status remains Active");
  }

  return status;
};
