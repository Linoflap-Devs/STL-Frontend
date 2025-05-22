import React from "react";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface BackIconButtonProps {
  to?: string;
  bgColor?: string;
  hoverColor?: string;
  iconColor?: string;
  size?: number;
  paddingLeft?: string;
  onClick?: () => void;
}

const BackIconButton: React.FC<BackIconButtonProps> = ({
  to,
  bgColor = "#ACA993",
  hoverColor = "#928F7F",
  iconColor = "#F8F0E3",
  size = 30,
  paddingLeft = "7px",
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    if (typeof to === "string") router.push(to); // Navigate only if explicitly provided
  };
  
  return (
    <IconButton
      onClick={handleClick}
      sx={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          backgroundColor: hoverColor,
        },
      }}
    >
      <ArrowBackIosIcon
        style={{
          fontWeight: "bold",
          fontSize: size * 0.67,
          color: iconColor,
          paddingLeft,
        }}
      />
    </IconButton>
  );
};

export default BackIconButton;
