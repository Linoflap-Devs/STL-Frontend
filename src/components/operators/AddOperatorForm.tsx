import React, { useState } from "react";
import { Operator, User } from "~/types/types";
import Input from "../ui/inputs/TextInputs";
import CustomSelect, { OptionType } from "../ui/inputs/SelectInputs";
import Select from "react-select";

interface AddOperatorFormProps {
  title?: string;
  onSubmit: (data: Operator) => void;
  initialData?: Partial<Operator>;
  gameTypes: any[]; // <-- add this
  regions: any[];
  provinces: any[];
  cities: any[];
  areaOfOperations: any;
}

export interface AreaOfOperation {
  AreaOfOperationsOptionsId: number;
  AreaOfOperations: string;
  // any other properties if needed
}

const AddOperatorForm: React.FC<AddOperatorFormProps> = ({
  initialData = {},
  onSubmit,
  gameTypes,
  regions,
  provinces,
  cities,
  areaOfOperations,
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    contactNumber: initialData.contactNumber || "",
    dateOfOperation: initialData.dateOfOperation || "",
    email: initialData.email || "",
    address: initialData.address || "",
    cities: initialData.cities || "",
    gameTypes: initialData.gameTypes || "",
    areaOfOperations: initialData.areaOfOperations || "",
    regions: initialData.regions || "",
    provinces: initialData.provinces || "",
  });

  //console.log("GAMETYPES:", gameTypes);
  //console.log("REGIONS", regions);
  //console.log("PROVINCES", provinces);
  //console.log("CITIES", cities);
  //console.log("AREA OF OPERATORS", areaOfOperations);

  const [filteredProvinces, setFilteredProvinces] = useState<OptionType[]>([]);
  const [filteredCities, setFilteredCities] = useState<OptionType[]>([]);

  const gameTypesOptions = gameTypes.map((cat) => ({
    value: cat.GameCategoryId.toString(),
    label: cat.GameCategory,
  }));

  const regionsOptions = regions.map((reg) => ({
    value: reg.RegionId.toString(),
    label: reg.RegionName,
  }));

  const areaOfOperationsOptions = areaOfOperations.map(
    (aop: AreaOfOperation) => ({
      value: aop.AreaOfOperationsOptionsId.toString(),
      label: aop.AreaOfOperations,
    })
  );

  const provinceOptions = filteredProvinces;

  const cityOptions = filteredCities;

  // Handle changes for normal inputs (text/select)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // store just the value, or use logic below
    }));
  };

  const handleMultiSelect = (name: string, selectedOptions: OptionType[]) => {
    const selectedValues = selectedOptions.map(option => option.value);
    const selectedValuesNum = selectedValues.map(v => Number(v)); // Convert all to numbers

    if (name === "regions") {
      const filteredProvinces = provinces
        .filter(province => selectedValuesNum.includes(province.RegionId))
        .map(province => ({
          value: province.ProvinceId,
          label: province.ProvinceName,
        }));

      console.log("Selected region IDs:", selectedValuesNum);
      console.log("Filtered provinces:", filteredProvinces);

      setFilteredProvinces(filteredProvinces);
      setFilteredCities([]);

      setFormData(prev => ({
        ...prev,
        regions: selectedValues,
        provinces: [],
        cities: [],
      }));
    } else if (name === "provinces") {
      const filteredCities = cities
        .filter(city => selectedValuesNum.includes(city.ProvinceId))
        .map(city => ({
          value: city.CityId,
          label: city.CityName.trim(),
        }));

      console.log("Selected province IDs:", selectedValuesNum);
      console.log("Filtered cities:", filteredCities);

      setFilteredCities(filteredCities);

      setFormData(prev => ({
        ...prev,
        provinces: selectedValues,
        cities: [],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // prepare data for submission
    const submittedData: Operator = {
      ...formData,
    };

    console.log("Submitted User Data:", submittedData);

    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Row 1 */}
      <div>
        <label htmlFor="name" className="block text-sm">
          Given Name
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Operator Name"
          className="mt-1"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="contactNumber" className="block text-sm">
          Phone Number
        </label>
        <Input
          type="tel"
          name="contactNumber"
          id="contactNumber"
          placeholder="Phone Number"
          className="mt-1"
          value={formData.contactNumber}
          onChange={handleChange}
        />
      </div>

      <div className="col-span-2">
        <label htmlFor="email" className="block text-sm">
          Address
        </label>
        <Input
          type="address"
          name="address"
          id="address"
          placeholder="Address"
          className="mt-1"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      {/* Row 3 */}
      <div>
        <label htmlFor="email" className="block text-sm">
          Email
        </label>
        <Input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="mt-1"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="dateOfOperation" className="block text-sm">
          Date of Operations
        </label>
        <Input
          type="date"
          name="dateOfOperation"
          id="dateOfOperation"
          placeholder="Date of Operations"
          className="mt-1"
          value={formData.dateOfOperation}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="gameTypes" className="block text-sm mb-1">
          STL Games Provided
        </label>
        <Select
          id="gameTypes"
          name="gameTypes"
          options={gameTypesOptions}
          isMulti
          onChange={(selectedOptions) =>
            handleMultiSelect("gameTypes", [...selectedOptions])
          }
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Select GameTypes"
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={{
            menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      <div>
        <label htmlFor="areaOfOperations" className="block text-sm mb-1">
          Area of Operations
        </label>
        <CustomSelect
          name="areaOfOperations"
          value={
            areaOfOperationsOptions.find(
              (opt: OptionType) => opt.value === formData.areaOfOperations
            ) || null
          }
          options={areaOfOperationsOptions}
          onChange={handleSelectChange}
          placeholder="Select Area of Operations"
          error={false}
        />
      </div>

      <div>
        <label htmlFor="regions" className="block text-sm mb-1">
          Area of Regional Operations
        </label>
        <Select
          id="regions"
          name="regions"
          options={regionsOptions}
          isMulti
          onChange={(selected) =>
            handleMultiSelect("regions", selected as OptionType[])
          }
          value={regionsOptions.filter((opt) =>
            formData.regions.includes(opt.value)
          )}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Regions"
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </div>

      <div>
        <label htmlFor="provinces" className="block text-sm mb-1">
          Area of Provincial Operations
        </label>
        <Select
          id="provinces"
          name="provinces"
          options={provinceOptions}
          isMulti
          onChange={(selected) =>
            handleMultiSelect("provinces", selected as OptionType[])
          }
          value={provinceOptions.filter((opt) =>
            formData.provinces.includes(opt.value)
          )}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Provinces"
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </div>

      <div>
        <label htmlFor="cities" className="block text-sm mb-1">
          Area of City Operations
        </label>
        <Select
          id="cities"
          name="cities"
          options={cityOptions}
          isMulti
          onChange={(selected) =>
            handleMultiSelect("cities", selected as OptionType[])
          }
          value={cityOptions.filter((opt) =>
            formData.cities.includes(opt.value)
          )}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Cities"
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : null
          }
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </div>
      




      <button
        type="submit"
        className="col-span-2 mt-2 w-full bg-[#F6BA12] text-sm text-black rounded px-4 py-2"
      >
        Submit
      </button>
    </form>
  );
};

export default AddOperatorForm;
