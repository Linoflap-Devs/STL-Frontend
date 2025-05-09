import React, { useState } from 'react';
import { ModalPageProps, Field } from '../../../types/interfaces';
import ReusableButton from "../button/ReusableSubmitButton";
import ReusableModal from "./ReusableCreateModal";
import useUserRoleStore from '../../../../store/useUserStore';

export const isManager = (roleId: number) => roleId === 2;
export const isExecutive = (roleId: number) => roleId === 3;

const CreateModalPage: React.FC<ModalPageProps> = ({
  open,
  onClose,
  fields = [],
  endpoint = '',
}) => {
  const [loading, setLoading] = useState(false);
  const isOpen = open ?? true;
  const handleClose = onClose ?? (() => {});
  const { roleId } = useUserRoleStore();

  // getting the name
  const getRoleName = () => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;

      if (pathname.includes('managers')) return 'Manager';
      if (pathname.includes('executives')) return 'Executive';
      if (pathname.includes('operators')) return 'Operator';
    }

    switch (roleId) {
      case 2:
        return 'Manager';
      case 3:
        return 'Executive';
      default:
        return 'Operator';
    }
  };

  return (
    <>
      <ReusableModal
        isOpen={isOpen}
        onClose={handleClose}
        endpoint={endpoint}
        fields={fields}
        title={`Add ${getRoleName()}`}
      >
        {({ handleSubmit }) => (
          <ReusableButton
            handleSubmit={handleSubmit}
            loading={loading}
            label="Submit"
          />
        )}
      </ReusableModal>
    </>
  );
};

export default CreateModalPage;