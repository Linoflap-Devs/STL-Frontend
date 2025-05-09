import React, { useState, useEffect } from 'react';
import { ModalPageProps, Field } from '../../../types/interfaces';
import useUserRoleStore from '../../../../store/useUserStore';
import ReusableUpdateModalPage from './ReusableUpdateModal';
import ReusableButton from '../button/ReusableSubmitButton';

export const isManager = (roleId: number) => roleId === 2;
export const isExecutive = (roleId: number) => roleId === 3;

const UpdateModalPage: React.FC<ModalPageProps> = ({
  open,
  onClose,
  fields = [],
  endpoint = '',
  initialUserData,
  operatorMap,
}) => {

  useEffect(() => {
    console.log("Initial Data received by UpdateModalPage:", initialUserData);
  }, [initialUserData]);

  const [loading, setLoading] = useState(false);
  const isOpen = open ?? true;
  const handleClose = onClose ?? (() => { });
  const { roleId } = useUserRoleStore();

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
      <ReusableUpdateModalPage
        isOpen={isOpen}
        onClose={handleClose}
        endpoint={endpoint}
        fields={fields}
        title={`View ${getRoleName()}`}
        initialUserData={initialUserData}
        operatorMap={operatorMap}
      >
        {({ handleSubmit }) => (
          <ReusableButton
            handleSubmit={handleSubmit}
            loading={loading}
            label="Submit"
          />
        )}
      </ReusableUpdateModalPage>
    </>
  );
};

export default UpdateModalPage;