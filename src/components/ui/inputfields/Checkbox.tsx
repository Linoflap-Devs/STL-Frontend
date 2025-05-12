import React from 'react';

interface CheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ name, label, checked, onChange, error }) => {
  return (
    <div className="mb-4 w-full flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`mr-2 ${error ? 'border-red-500' : 'border-[#0038A8]'}`}
        aria-label={label}
      />
      <label htmlFor={name} className="text-sm">{label}</label>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Checkbox;
