import React from "react";

export interface ReusableButtonProps {
  handleSubmit: () => void;
  loading: boolean;
  label: string;
  style?: React.CSSProperties;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  handleSubmit,
  loading,
  label,
}) => {
  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className={`
        mt-2
        w-full
        rounded-lg
        px-6
        py-2.5
        text-xs
        font-normal
        text-[#181A1B]
        bg-[#F6BA12]
        hover:bg-[#FFD100]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-[#F6BA12]
        transition-colors
        ease-in-out
      `}
      style={{ textTransform: "none",}}
    >
      {loading ? "Submitting..." : label}
    </button>
  );
};

export default ReusableButton;
