// src/components/user/UserForm.tsx
import React, { useEffect } from 'react';
import CreateModalPage from '~/components/ui/modals/CreateModal';
import { useOperatorsData } from '../../../store/useOperatorStore';

const operatorConfig = {
  endpoint: '/operators/addOperator',
  fields: [
    { name: 'OperatorName', label: 'Given Name', type: 'text', placeholder: 'Given name', value: '' },
    { name: 'OperatorEmail', label: 'Email', type: 'email', placeholder: 'Enter email', value: '' },
    { name: 'ContactNo', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', value: '' },
    { name: 'DateOfOperation', label: 'Assigned Company', type: 'text', placeholder: 'Enter assigned company', value: '' },
    { name: 'AreaOfOperations', label: 'Area of Operations', type: 'text', placeholder: 'Enter area of Operations', value: '' },
  ],
};

const OperatorFieldFormPage: React.FC = () => {
  const { modalOpen, setModalOpen, fields, setFields, } = useOperatorsData();

  useEffect(() => {
    setFields(operatorConfig.fields);
  }, [setFields]);

  return (
    <div className="p-4">
      <CreateModalPage
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fields={fields}
        endpoint={operatorConfig.endpoint}
      />
    </div>
  );
};

export default OperatorFieldFormPage;
