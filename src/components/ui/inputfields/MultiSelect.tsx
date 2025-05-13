import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  name: string;
  label: string;
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ name, label, value, onChange, options, error }) => {
  return (
    <div className="mb-4 w-full">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        multiple
        className={`w-full border rounded px-3 py-2 text-xs ${error ? 'border-red-500' : 'border-[#0038A8]'}`}
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelect;
