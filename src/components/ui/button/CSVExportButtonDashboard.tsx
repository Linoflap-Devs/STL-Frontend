import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { buttonStyles } from "~/styles/theme";

const convertToCSV = (data: any[]) => {
  const headers = ["Region", "Total", "Active", "Inactive", "Deleted", "New"];
  const columnWidths = headers.map((header, index) =>
    Math.max(...data.map(item => String(item[header.toLowerCase()]).length), header.length)
  );
  
  const createRow = (item: any, isHeader: boolean = false) => {
    return headers.map((header, index) => {
      const value = isHeader ? header : item[header.toLowerCase()];
      return String(value).padEnd(columnWidths[index] + 2); // Pad with spaces
    }).join("");
  };

  const csvContent = [
    createRow({}, true), // Header row
    ...data.map(item => createRow(item)) // Data rows
  ].join("\n");

  return csvContent;
};

interface CSVExportButtonProps {
  statsPerRegion: any[];
  pageType: string;
}

const CSVExportButton: React.FC<CSVExportButtonProps> = ({ statsPerRegion, pageType }) => {
  const downloadCSV = (data: any[], pageType: string) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${pageType}_data.csv`;
    link.click();
  };

  return (
    <Button
      sx={buttonStyles}
      variant="contained"
      onClick={() => downloadCSV(statsPerRegion, pageType)}
    >
      Export as CSV
    </Button>
  );
};

export default CSVExportButton;
