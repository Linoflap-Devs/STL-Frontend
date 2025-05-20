import React from "react";
import { Button } from "@mui/material";
import { buttonStyles } from "~/styles/theme";
import { CSVExportButtonProps } from "~/types/interfaces";
import { getRoleName, getUserStatus } from "~/utils/dashboarddata";
import dayjs from "dayjs";

// Function to convert the data to CSV format
const convertToCSV = (data: any[], columns: any[], title: string, operatorMap: any[]) => {
  const headers = columns.map((col) => col.label);

  // Function to create each row of the CSV
  const createRow = (item: any, isHeader: boolean = false) => {
    return headers.map((header, index) => {
      const columnKey = columns[index].key;

      if (isHeader) return header; // No formatting for headers

      if (columnKey === "OperatorDetails.OperatorName") {
        const name = operatorMap[item.OperatorId]?.OperatorName ?? "No operator assigned";
        return name;
      }

      if (columnKey === "Status") {
        const sevenDaysAgo = dayjs().subtract(7, "days");
        const status = getUserStatus(item, sevenDaysAgo);
        return status;
      }

      if (columnKey === "Cities") {
        const cityNames = Array.isArray(item.Cities)
          ? item.Cities.map((c: any) => c.CityName).join(", ")
          : "No cities";
        return cityNames;
      }

      if (columnKey === "DateOfRegistration") {
        const formattedDate = item.DateOfRegistration
          ? dayjs(item.DateOfRegistration).format("MMMM D, YYYY h:mm A")
          : "";
        return formattedDate;
      }

      const value = columnKey.split('.').reduce((obj: any, key: string) => obj?.[key], item);
      return String(value ?? "");
    }).join(",");
  };

  const titleRow = `${title}\n\n`; // Add title with a newline
  const headerRow = createRow({}, true); // Create header row
  const dataRows = data.map(item => createRow(item)).join("\n"); // Create data rows

  return `${titleRow}${headerRow}\n${dataRows}`; // Combine everything
};

const CSVExportButtonTable: React.FC<CSVExportButtonProps> = ({ statsPerRegion, pageType, roleId, columns, operatorMap }) => {
  const downloadCSV = (data: any[], columns: any[], pageType: string, operatorMap: any[]) => {
    const baseRole = getRoleName(roleId ?? 0); // Get role name based on roleId
    const pluralRole = baseRole.endsWith("s") ? baseRole : baseRole + "s"; // Make the role plural
    const pageTitle = `${pluralRole} Dashboard Page`; // Define the title for the CSV

    // Generate CSV content
    const csvContent = convertToCSV(data, columns, pageTitle, operatorMap);

    // Create a Blob with the CSV content and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${pageType}_summary_data.csv`; // Set the file name dynamically
    link.click(); // Trigger the file download
  };

  return (
    <Button
      sx={buttonStyles}
      variant="contained"
      onClick={() => downloadCSV(statsPerRegion ?? [], columns ?? [], pageType, operatorMap ?? [])}
    >
      Export as CSV
    </Button>
  );
};

export default CSVExportButtonTable;
