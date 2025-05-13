import React, { useState } from 'react';
import ReusableButton from '../ui/buttons/ReusableSubmitButton';
import useUserRoleStore from '../../../store/useUserStore';
import { getRoleName } from '~/utils/dashboarddata';
import { ModalPageProps } from '../../types/interfaces';
import CreateOperationsPage from './CreateOperationsModal';

const CreateModalOperationsPage: React.FC<ModalPageProps> = ({
  open,
  onClose,
  fields = [],
  endpoint = '',
  operatorMap,
  provinces = [],
  regions = [],
  cities = [],
  setSelectedRegion,
  setSelectedProvince,
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
      <CreateOperationsPage
        isOpen={isOpen}
        onClose={handleClose}
        endpoint={formattedEndpoint}
        fields={fields}
        title={`Add ${getRoleName(roleId ?? 0)}`}
        operatorMap={operatorMap ?? {}}
        provinces={provinces}
        regions={regions}
        cities={cities}
        setSelectedRegion={setSelectedRegion ?? (() => {})}
        setSelectedProvince={setSelectedProvince ?? (() => {})}
      >
        {({ handleSubmit }) => (
          <ReusableButton
            handleSubmit={handleSubmit}
            loading={loading}
            label="Submit"
          />
        )}
      </CreateOperationsPage>
    </>
  );
};

export default CreateModalOperationsPage;