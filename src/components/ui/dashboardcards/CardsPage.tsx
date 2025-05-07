import React from "react";
import { CardsPageProps } from "~/types/interfaces";
import { Card } from "./Cards";
import dayjs from "dayjs";

// Define the getUserStatus function
const getUserStatus = (user: any, sevenDaysAgo: dayjs.Dayjs): string => {
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
    console.log("Status remains Active");
  }

  return status;
};

const CardsPage = <T extends { 
  LastLogin?: string; 
  LastTokenRefresh?: string; 
  UserStatusId?: number;
  DateOfRegistration?: string;
  IsActive?: number;
}>({
  dashboardData,
  roleLabel,
  textlabel,
  cardData,
}: CardsPageProps<T>) => {
  // Get the date for seven days ago
  const sevenDaysAgo = dayjs().subtract(7, "days");

  // Calculate the status for each user and categorize them
  const totalItems = dashboardData.length;
  
  const activeItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "Active"
  ).length;

  const inactiveItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "Inactive"
  ).length;

  const suspendedItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "Suspended"
  ).length;

  const newItems = dashboardData.filter(
    (item) => getUserStatus(item, sevenDaysAgo) === "New"
  ).length;

  // Calculated card data to pass to the Card component
  const calculatedCardData = [
    {
      label: `Total of ${textlabel}`,
      textlabel,
      value: totalItems.toString(),
      color: "#4A90E2",
    },
    {
      label: `Active ${textlabel}`,
      textlabel,
      value: activeItems.toString(),
      color: "#50E3C2",
    },
    {
      label: `Inactive ${textlabel}`,
      textlabel,
      value: inactiveItems.toString(),
      color: "#F5A623",
    },
    {
      label: `Suspended ${textlabel}`,
      textlabel,
      value: suspendedItems.toString(),
      color: "#F76E3F",
    },
    {
      label: `New ${textlabel}`,
      textlabel,
      value: newItems.toString(),
      color: "#7ED321",
    },
  ];

  return (
    <div className="mt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-3 pb-3">
      {calculatedCardData.map((item, index) => (
        <Card
          key={index}
          label={item.label}
          value={item.value}
          color={item.color}
          textlabel={item.textlabel || ""}
        />
      ))}
    </div>
  );
};

export default CardsPage;
