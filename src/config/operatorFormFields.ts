import { Field } from '~/types/interfaces';

export const operatorConfig: {
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