import React from "react";
import { Button } from "@mui/material";
import { buttonStyles } from "~/styles/theme";
import { CSVExportButtonProps } from "~/types/interfaces";
import { getRoleName } from "~/utils/dashboarddata";

const convertToCSV = (data: any[], title: string) => {
  const headers = ["Region", "Total", "Active", "Inactive", "Deleted", "New"];

  const createRow = (item: any, isHeader: boolean = false) => {
    return headers.map(header => {
      const value = isHeader ? header : (item[header.toLowerCase()] ?? "");
      // If value contains spaces or commas, wrap with quotes
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes(" ")) {
        return `"${stringValue}"`;
      }
      return stringValue;
    }).join(",");
  };

  const titleRow = title + "\n";

  const csvContent = [
    titleRow,
    createRow({}, true), // Header row
    ...data.map(item => createRow(item)) // Data rows
  ].join("\n");

  return csvContent;
};


const CSVExportButtonDashboard: React.FC<CSVExportButtonProps> = ({ statsPerRegion, pageType, roleId }) => {
  const downloadCSV = (data: any[], pageType: string) => {
    
  const baseRole = getRoleName(roleId ?? 0);
  const pluralRole = baseRole.endsWith("s") ? baseRole : baseRole + "s";
  const pageTitle = `${pluralRole} Dashboard Page`;

    const csvContent = convertToCSV(data, pageTitle);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${pageType}_dashboard_data.csv`;
    link.click();
  };

  return (
    <Button
      sx={buttonStyles}
      variant="contained"
      onClick={() => downloadCSV(statsPerRegion ?? [],  pageType)}
    >
      Export as CSV
    </Button>
  );
};

export default CSVExportButtonDashboard;
