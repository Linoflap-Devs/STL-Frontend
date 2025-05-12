import React from 'react';

interface TextInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ name, label, value, onChange, error, placeholder }) => {
  return (
    <div className="">
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-[#0038A8]'}`}
        aria-label={label}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;
