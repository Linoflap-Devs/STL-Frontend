import React, { useState } from 'react';
import { ModalPageProps } from '../../../types/interfaces';
import ReusableButton from "../button/ReusableSubmitButton";
import useUserRoleStore from '../../../../store/useUserStore';
import ReusableCreateModalPage from './ReusableCreateModal';
import { getRoleName } from '~/utils/dashboarddata';

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

  const formattedEndpoint =
    typeof endpoint === 'string'
      ? { create: endpoint, update: endpoint }
      : endpoint;


  return (
    <>
      <ReusableCreateModalPage
        isOpen={isOpen}
        onClose={handleClose}
        endpoint={formattedEndpoint}
        fields={fields}
        title={`Add ${getRoleName(roleId ?? 0)}`}
      >
        {({ handleSubmit }) => (
          <ReusableButton
            handleSubmit={handleSubmit}
            loading={loading}
            label="Submit"
          />
        )}
      </ReusableCreateModalPage>
    </>
  );
};

export default CreateModalPage;