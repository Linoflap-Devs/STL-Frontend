import React from "react";
import Select, { MultiValue, ActionMeta } from "react-select";

export type OptionType = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  value: string[]; // controlled value as array of strings (selected values)
  options: OptionType[];
  onChange: (selectedValues: string[]) => void; // simpler signature
  placeholder?: string;
  error?: boolean;
};

const MultiSelectInput: React.FC<Props> = ({
  name,
  value,
  options,
  onChange,
  placeholder,
  error,
}) => {
  // Find selected option objects for react-select value prop
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  // Wrapper to adapt react-select onChange to your onChange signature
  const handleChange = (
    selected: MultiValue<OptionType>,
    _actionMeta: ActionMeta<OptionType>
  ) => {
    const selectedValues = selected ? selected.map((opt) => opt.value) : [];
    onChange(selectedValues);
  };

  return (
    <Select
      isMulti
      name={name}
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder}
      classNamePrefix="react-select"
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: error ? "#EF4444" : "#0038A8",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
    />
  );
};

export default MultiSelectInput;
