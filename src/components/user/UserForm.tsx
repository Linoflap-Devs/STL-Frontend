// src\components\user\UserForm.tsx
import React, { useEffect } from 'react';
import CreateModalPage from '~/components/ui/modals/CreateModal';
import useUserRoleStore from '../../../store/useUserStore';
import { useOperatorsData } from '../../../store/useOperatorStore';
import { getOperatorsData } from '~/utils/api/operators/get.operators.service';
import { GetOperatorsResponse } from '~/types/interfaces';
import { Operator } from '~/types/types';

const roleConfigs = {
  manager: {
    userTypeId: 2,
    endpoint: '/users/addUser',
    fields: [
      { name: 'firstName', label: 'Given Name', type: 'text', placeholder: 'Given name', value: '' },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', value: '' },
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
        placeholder: 'Select suffix',
      },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', value: '' },
      { name: 'operatorId', label: 'Assigned Company', type: 'text', placeholder: 'Enter assigned company', value: '' },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address', value: '' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', value: '' },
    ],
  },

  executive: {
    userTypeId: 3,
    endpoint: '/users/addUser',
    fields: [
      { name: 'firstName', label: 'Given Name', type: 'text', placeholder: 'Given name', value: '' },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', value: '' },
      {
        name: 'suffix',
        label: 'Suffix',
        type: 'select',
        placeholder: 'Select Suffix',
        options: [
          { label: 'Mr.', value: 'mr' },
          { label: 'Mrs.', value: 'mrs' },
          { label: 'Dr.', value: 'dr' },
        ],
      },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', value: '' },
      { name: 'operatorId', label: 'Assigned Company', type: 'text', placeholder: 'Enter assigned company', value: '' },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address', value: '' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', value: '' },
    ],
  },
};

const UserFieldFormPage: React.FC = () => {
  const { modalOpen, setModalOpen, setFields, fields, setRoleId } = useUserRoleStore();
  const { operatorMap, setOperatorMap } = useOperatorsData();

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pageType =
    pathname.includes('manager') ? 'manager' :
    pathname.includes('executive') ? 'executive' :
    null;

  if (!pageType) return null;

  const roleConfig = roleConfigs[pageType];

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const operatorResponse = await getOperatorsData<GetOperatorsResponse>("/operators/getOperators");
        if (operatorResponse.success && Array.isArray(operatorResponse.data?.data)) {
          const map = operatorResponse.data.data.reduce((acc, operator) => {
            acc[operator.OperatorId] = operator;
            return acc;
          }, {} as { [key: number]: Operator });
          setOperatorMap(map);
          console.log("Fetched and set Operator Map:", map);
        } else {
          setOperatorMap({});
        }
      } catch (error) {
        console.error("Error fetching operator data:", error);
        setOperatorMap({});
      }
    };

    fetchOperators();
  }, [setOperatorMap]);

  useEffect(() => {
    setRoleId(roleConfig.userTypeId);

    const operatorOptions = Object.values(operatorMap).map(operator => ({
      label: operator.OperatorName,
      value: operator.OperatorId,
    }));

    const updatedFields = roleConfig.fields.map(field =>
      field.name === 'operatorId'
        ? { ...field, type: 'select', options: operatorOptions, value: field.value || '', placeholder: field.placeholder || '' }
        : { ...field, value: field.value || '', placeholder: field.placeholder || '' }
    );

    setFields(updatedFields);
    setOperatorMap(operatorMap);
  }, [pageType, setFields, setRoleId, operatorMap, setOperatorMap]);

  return (
    <div className="p-4">
      <CreateModalPage
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fields={fields}
        endpoint={roleConfig.endpoint}
        additionalPayload={{ userTypeId: roleConfigs[pageType].userTypeId }}
      />
    </div>
  );
};

export default UserFieldFormPage;