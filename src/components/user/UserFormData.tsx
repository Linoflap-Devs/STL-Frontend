import React, { useEffect } from 'react';
import useUserRoleStore from '../../../store/useUserStore';
import { UserFieldFormPageProps } from '~/types/interfaces';
import UpdateModalPage from '../ui/modals/UpdateModalData';
import { useModalStore } from '../../../store/useModalStore';
import { userRoleFormFields } from '~/config/userFormFields';
import CreateModalDataPage from '../ui/modals/CreateModalData';

const UserFieldFormPage: React.FC<UserFieldFormPageProps> = ({ operatorMap }) => {
  const { setFields, fields, setRoleId } = useUserRoleStore();
  const { modalOpen, modalType, selectedData, closeModal } = useModalStore();

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pageType =
    pathname.includes('manager') ? 'manager' :
      pathname.includes('executive') ? 'executive' :
        null;

  if (!pageType) return null;

  const roleConfig = userRoleFormFields[pageType];

// for operatorId field, we need to set the type to select and 
// provide options based on the operatorMap
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
        <CreateModalDataPage
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
