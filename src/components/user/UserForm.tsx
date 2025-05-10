import React, { useEffect } from 'react';
import CreateModalPage from '~/components/ui/modals/CreateModal';
import useUserRoleStore from '../../../store/useUserStore';
import { useOperatorsData } from '../../../store/useOperatorStore';
import { getOperatorsData } from '~/utils/api/operators/get.operators.service';
import { Field, GetOperatorsResponse } from '~/types/interfaces';
import { Operator } from '~/types/types';
import UpdateModalPage from '../ui/modals/UpdateModal';
import { useModalStore } from '../../../store/useModalStore';

const roleConfigs: Record<string, { userTypeId: number; endpoint: { create: string; update: string }; fields: Field[] }> = {
  manager: {
    userTypeId: 2,
    endpoint: {
      create: '/users/addUser',
      update: '/users/edituser',
    },
    fields:  [
      { name: 'firstName', label: 'Given Name', type: 'text', placeholder: 'Given name', value: '', gridSpan: 1 },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', value: '', gridSpan: 1 },
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
        value: '',
        gridSpan: 1,
      },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', value: '', gridSpan: 1 },
      { name: 'operatorId', label: 'Assigned Company', type: 'text', placeholder: 'Enter assigned company', value: '', gridSpan: 2 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address', value: '', gridSpan: 2 },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', value: '', gridSpan: 2, required: true },
    ],
  },
  executive: {
    userTypeId: 3,
    endpoint: {
      create: '/users/addUser',
      update: '/users/edituser',
    },
    fields: [
      { name: 'firstName', label: 'Given Name', type: 'text', placeholder: 'Given name', value: '', gridSpan: 1 },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name', value: '', gridSpan: 1 },
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
        value: '',
        gridSpan: 1,
      },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', value: '', gridSpan: 1 },
      { name: 'operatorId', label: 'Assigned Company', type: 'text', placeholder: 'Enter assigned company', value: '', gridSpan: 2 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address', value: '', gridSpan: 2 },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', value: '', gridSpan: 2 },
    ],
  },
};

const UserFieldFormPage: React.FC = () => {
  const { setFields, fields, setRoleId } = useUserRoleStore();
  const { operatorMap, setOperatorMap } = useOperatorsData();
  const { modalOpen, modalType, selectedData, closeModal } = useModalStore();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pageType =
    pathname.includes('manager') ? 'manager' :
    pathname.includes('executive') ? 'executive' :
    null;

  if (!pageType) return null;
  
  const roleConfig = roleConfigs[pageType];
  
  // Calculate isUpdateMode after roleConfig is available
  const isUpdateMode = !!selectedData?.id;
  const endpoint = isUpdateMode
    ? roleConfig.endpoint.update
    : roleConfig.endpoint.create;

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
          // console.log("Fetched and set Operator Map:", map);
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
  }, [pageType, setFields, setRoleId, operatorMap, setOperatorMap, roleConfig]);

  return (
    <div className="p-4">
      {modalType === "create" && (
        <CreateModalPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={roleConfig.endpoint}
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
