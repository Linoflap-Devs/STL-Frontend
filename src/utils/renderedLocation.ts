import { MenuItem, MenuItemProps } from "@mui/material";

interface LocationItem {
  id: number;
  name: string;
}

export const useRenderOptions = () => {
  const renderOptions = (key: string, data: LocationItem[]) => {
    switch (key) {
      case "Region":
      case "Province":
      case "City":
        return data.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ));
      case "Barangay":
        return <MenuItem value="Sample Barangay">Sample Barangay</MenuItem>;
      default:
        return null;
    }
  };

  return { renderOptions };
};