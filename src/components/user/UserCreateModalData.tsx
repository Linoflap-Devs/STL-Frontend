import React, { useState } from 'react';
import ReusableButton from '../ui/buttons/ReusableSubmitButton';
import useUserRoleStore from '../../../store/useUserStore';
import { getRoleName } from '~/utils/dashboarddata';
import { ModalPageProps } from '../../types/interfaces';
import UserCreateModalPage from './UserCreateModal';

export const isManager = (roleId: number) => roleId === 2;
export const isExecutive = (roleId: number) => roleId === 3;

const CreateModalPage: React.FC<ModalPageProps> = ({
  open,
  onClose,
  fields = [],
  endpoint = '',
  operatorMap,
}) => {
  const [loading, setLoading] = useState(false);
  const isOpen = open ?? true;
  const handleClose = onClose ?? (() => {});
  const { roleId } = useUserRoleStore();

  const formattedEndpoint =
    typeof endpoint === 'string'
      ? { create: endpoint, update: endpoint }
      : endpoint;
      
  return (
    <>
      <UserCreateModalPage
        isOpen={isOpen}
        onClose={handleClose}
        endpoint={formattedEndpoint}
        fields={fields}
        title={`Add ${getRoleName(roleId ?? 0)}`}
        operatorMap={operatorMap ?? {}}
      >
        {({ handleSubmit }) => (
          <ReusableButton
            handleSubmit={handleSubmit}
            loading={loading}
            label="Submit"
          />
        )}
      </UserCreateModalPage>
    </>
  );
};

export default CreateModalPage;