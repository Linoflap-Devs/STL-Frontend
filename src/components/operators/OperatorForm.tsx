import React, { useEffect } from 'react';
import CreateModalPage from '~/components/ui/modals/CreateModal';
import UpdateModalPage from '../ui/modals/UpdateModal';
import { useOperatorsData } from '../../../store/useOperatorStore';
import { useModalStore } from '../../../store/useModalStore';
import { Field } from '~/types/interfaces';

const operatorConfig: {
  endpoint: { create: string; update: string };
  fields: Field[];
} = {
  endpoint: {
    create: '/operators/addOperator',
    update: '/operators/editOperator',
  },
  fields: [
    { name: 'name', label: 'Operators Name', type: 'text', placeholder: 'Given name', value: '', gridSpan: 1 },
    { name: 'address', label: 'Operators Address', type: 'text', placeholder: 'Address', value: '', gridSpan: 'full', },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email', value: '', gridSpan: 1 },

    { name: 'contactNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', value: '', gridSpan: 2 },
    {
      name: 'DateOfOperations',
      label: 'Date of Operations',
      type: 'date',
      placeholder: '',
      value: '',
      gridSpan: 2,
    },
    { name: 'GamesProvided', label: 'Games Provided', type: 'text', placeholder: 'Enter Games Provided', value: '', gridSpan: 1 },


    { name: 'AreaOfOperations', label: 'Area of Operations', type: 'text', placeholder: 'Enter area of Operations', value: '', gridSpan: 2 },
  ],
};

const OperatorFieldFormPage: React.FC = () => {
  const { fields, setFields } = useOperatorsData();
  const { modalOpen, modalType, selectedData, closeModal } = useModalStore();

  useEffect(() => {
    setFields(operatorConfig.fields);
  }, [setFields]);

  return (
    <div className="p-4">
      {modalType === 'create' && (
        <CreateModalPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={operatorConfig.endpoint}
        />
      )}
      {modalType === 'view' && (
        <UpdateModalPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={operatorConfig.endpoint}
          initialUserData={selectedData}
          operatorMap={{}}
        />
      )}
    </div>
  );
};

export default OperatorFieldFormPage;
