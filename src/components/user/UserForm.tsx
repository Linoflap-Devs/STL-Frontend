import React, { useEffect } from 'react';
import CreateModalPage from '~/components/user/UserCreateModalData';
import useUserRoleStore from '../../../store/useUserStore';
import { Field, UserFieldFormPageProps } from '~/types/interfaces';
import UpdateModalPage from '../ui/modals/UpdateModalData';
import { useModalStore } from '../../../store/useModalStore';

const roleConfigs: Record<string, { userTypeId: number; endpoint: { create: string; update: string }; fields: Field[] }> = {
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
          { value: '', label: 'None' },
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

const UserFieldFormPage: React.FC<UserFieldFormPageProps> = ({ operatorMap }) => {
  const { setFields, fields, setRoleId } = useUserRoleStore();
  const { modalOpen, modalType, selectedData, closeModal } = useModalStore();

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pageType =
    pathname.includes('manager') ? 'manager' :
      pathname.includes('executive') ? 'executive' :
        null;

  if (!pageType) return null;

  const roleConfig = roleConfigs[pageType];

  useEffect(() => {
    setRoleId(roleConfig.userTypeId);
    const operatorOptions = Object.values(operatorMap).map(operator => ({
      label: operator.OperatorName,
      value: operator.OperatorId,
    }));

    // Update the operatorId field to be a select field
    const updatedFields = roleConfig.fields.map(field =>
      field.name === 'operatorId'
        ? {
          ...field,
          type: 'select',
          options: operatorOptions,
          value: String(field.value ?? ''),
          placeholder: field.placeholder || '',
        }
        : {
          ...field,
          value: String(field.value ?? ''),
          placeholder: field.placeholder || '',
        }
    );

    setFields(updatedFields);
  }, [pageType, setFields, setRoleId, operatorMap, roleConfig]);

  return (
    <div className="p-4">
      {modalType === "create" && (
        <CreateModalPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={roleConfig.endpoint}
          operatorMap={operatorMap}
        />
      )}
      {modalType === "view" && (
        <UpdateModalPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={roleConfig.endpoint}
          initialUserData={selectedData}
          operatorMap={operatorMap}
        />
      )}
    </div>
  );
};

export default UserFieldFormPage;
