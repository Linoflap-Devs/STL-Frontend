import { Field } from '~/types/interfaces';

export const userRoleFormFields: Record<
  string,
  {
    userTypeId: number;
    endpoint: { create: string; update: string };
    fields: Field[];
  }
> = {
  manager: {
    userTypeId: 2,
    endpoint: {
      create: '/users/addUser',
      update: '/users/edituser',
    },
    fields: [
      { name: 'firstName', label: 'Given Name', type: 'text', placeholder: 'Given Name', value: '', gridSpan: 1 },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', value: '', gridSpan: 1 },
      {
        name: 'suffix',
        label: 'Suffix',
        type: 'select',
        options: [
          { value: 'Jr.', label: 'Jr.' },
          { value: 'Sr.', label: 'Sr.' },
          { value: 'II', label: 'II' },
          { value: 'III', label: 'III' },
          { value: '', label: 'N/A' },
        ],
        placeholder: 'Suffix',
        value: '',
        gridSpan: 1,
      },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number', value: '', gridSpan: 1 },
      { name: 'operatorId', label: 'Assigned Company', type: 'text', placeholder: 'Assigned company', value: '', gridSpan: 2 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address', value: '', gridSpan: 2 },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Password', value: '', gridSpan: 2 },
    ],
  },

  executive: {
    userTypeId: 3,
    endpoint: {
      create: '/users/addUser',
      update: '/users/edituser',
    },
    fields: [
      { name: 'firstName', label: 'Given Name', type: 'text', placeholder: 'Given Name', value: '', gridSpan: 1 },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', value: '', gridSpan: 1 },
      {
        name: 'suffix',
        label: 'Suffix',
        type: 'select',
        options: [
          { value: 'Jr.', label: 'Jr.' },
          { value: 'Sr.', label: 'Sr.' },
          { value: 'III', label: 'III' },
          { value: 'None', label: 'None' },
        ],
        placeholder: 'Suffix',
        value: '',
        gridSpan: 1,
      },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number', value: '', gridSpan: 1 },
      { name: 'operatorId', label: 'Assigned Company', type: 'text', placeholder: 'Assigned company', value: '', gridSpan: 2 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address', value: '', gridSpan: 2 },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Password', value: '', gridSpan: 2 },
    ],
  },
};
