import React, { useEffect, useState } from 'react';
import CreateModalOperationsPage from './CreateOperationsModal';
import UpdateModalPage from '~/components/ui/modals/UpdateModal';
import { useOperatorsData } from '../../../store/useOperatorStore';
import { useModalStore } from '../../../store/useModalStore';
import { Field } from '~/types/interfaces';
import { fetchGameCategories } from '~/services/userService';
import { fetchCityData, fetchProvinceData, fetchRegionData } from '~/services/locationService';
import { fetchOperators } from '~/services/userService';

const operatorConfig: {
  endpoint: { create: string; update: string };
  fields: Field[];
} = {
  endpoint: {
    create: '/operators/addOperator',
    update: '/operators/editOperator',
  },
  fields: [
    { name: 'name', label: 'Operators Name', type: 'text', placeholder: 'Given name', value: '', gridSpan: 1 },
    { name: 'address', label: 'Operators Address', type: 'text', placeholder: 'Address', value: '', gridSpan: 'full' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email Address', value: '', gridSpan: 1 },
    { name: 'contactNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', value: '', gridSpan: 2 },
    { name: 'dateOfOperation', label: 'Date of Operations', type: 'date', placeholder: 'Select Date of Operations', value: '', gridSpan: 2 },
    {
      name: 'gameTypes',
      label: 'Games Provided',
      type: 'multiselect',
      options: [],
      placeholder: 'Games Provided',
      value: [],
      gridSpan: 1,
    },
    {
      name: 'STLAreaOfOperations',
      label: 'STL Area of Operations',
      type: 'select',
      options: [
        { value: 'ProvincialWide', label: 'Provincial Wide' },
        { value: 'CityWide', label: 'City Wide' },
      ],
      placeholder: 'Select STL Area of Operations',
      value: '',
      gridSpan: 2,
    },
    {
      name: 'STLRegion',
      label: 'Area of Regional Operations',
      type: 'multiselect',
      options: [],
      placeholder: 'Area of Regional Operations',
      value: [],
      gridSpan: 1,
    },
    {
      name: 'STLProvince',
      label: 'Area of Provincial Operations',
      type: 'multiselect',
      options: [],
      placeholder: 'Area of Provincial Operations',
      value: [],
      gridSpan: 2,
    },
    {
      name: 'cities',
      label: 'Area of City Operations',
      type: 'multiselect',
      options: [],
      placeholder: 'Area of City Operations',
      value: [],
      gridSpan: 1,
    },
    {
      name: 'isExcludedCITY',
      label: 'Is there excluded city?',
      type: 'checkbox',
      value: false,
      gridSpan: 2,
    },
    {
      name: 'STLExcludedCity',
      label: 'Excluded City',
      type: 'multiselect',
      options: [],
      placeholder: '',
      value: [],
      gridSpan: 1,
    },
  ],
};

export const OperatorFieldFormPage: React.FC = () => {
  const { fields, setFields } = useOperatorsData();
  const { modalOpen, modalType, selectedData, closeModal } = useModalStore();

  const [gameTypes, setGameTypes] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<any>(''); // for region filtering
  const [selectedProvince, setSelectedProvince] = useState<any>(''); // for province filtering
  const [operatorDetails, setOperatorDetails] = useState<any>(null); // Add state for operator details

  // Fetch game categories, regions, provinces, and cities on component mount
  useEffect(() => {
    fetchGameCategories(setGameTypes);
    fetchRegionData(setRegions);
    fetchProvinceData(setProvinces);
    fetchCityData(setCities);
  }, []);
  
  // Update field options based on selected data (gameTypes, regions, provinces, cities)
  useEffect(() => {
    const updatedFields = operatorConfig.fields.map((field) => {
      if (field.name === 'gameTypes') {
        return {
          ...field,
          options: gameTypes.map((gameType) => ({
            value: gameType.GameCategoryId,
            label: gameType.GameCategory,
          })),
        };
      }

      if (field.name === 'STLRegion') {
        return {
          ...field,
          options: regions.map((region) => ({
            value: region.RegionId,
            label: region.RegionName,
          })),
        };
      }

      if (field.name === 'STLProvince') {
        const filteredProvinces = provinces.filter(
          (province) => province.RegionId === selectedRegion
        );
        return {
          ...field,
          options: filteredProvinces.map((province) => ({
            value: province.ProvinceId,
            label: province.ProvinceName,
          })),
        };
      }

      if (field.name === 'cities') {
        const filteredCities = cities.filter(
          (city) => city.ProvinceId === selectedProvince
        );
        return {
          ...field,
          options: filteredCities.map((city) => ({
            value: city.CityId,
            label: city.CityName,
          })),
        };
      }

      return field;
    });

    setFields(updatedFields);
  }, [gameTypes, regions, provinces, cities, selectedRegion, selectedProvince, setFields]);

  return (
    <div className="p-4">
      {modalType === 'create' && (
        <CreateModalOperationsPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={operatorConfig.endpoint}
          provinces={provinces}
          regions={regions}
          cities={cities}
          selectedRegion={selectedRegion}
          selectedProvince={selectedProvince}
        />
      )}
      {modalType === 'view' && (
        <UpdateModalPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={operatorConfig.endpoint}
          initialUserData={selectedData}
        />
      )}
    </div>
  );
};
