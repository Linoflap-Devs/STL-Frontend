import React from "react";

type Props = {
  disabled?: boolean;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ disabled, error, className, ...rest }: Props) => {
  const baseClass = "w-full border rounded px-3 py-2 text-sm focus:outline-none";

  const classes = `${baseClass} 
    ${disabled
      ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed"
      : error
      ? "bg-[#F8F0E3] border-red-600 text-black focus:ring-red-600 focus:border-red-600"
      : "bg-[#F8F0E3] border-[#0038A8] text-black focus:border-[#0038A8] focus:ring-[#0038A8]"
    }`;

  return <input disabled={disabled} className={`${classes} ${className || ""}`} {...rest} />;
};

export default Input;
