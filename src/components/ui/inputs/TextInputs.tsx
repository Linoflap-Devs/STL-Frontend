import React from "react";

type Props = {
  disabled?: boolean;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>; // Allow all native input props

const Input = ({ disabled, error, className, ...rest }: Props) => {
  const baseClass = "w-full border rounded px-3 py-2 text-sm";

  const classes = disabled
    ? `${baseClass} bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed`
    : error
    ? `${baseClass} bg-[#F8F0E3] border-red-500 text-black`
    : `${baseClass} bg-[#F8F0E3] border-[#0038A8] text-black`;

  return <input disabled={disabled} className={`${classes} ${className || ""}`} {...rest} />;
};

export default Input;
