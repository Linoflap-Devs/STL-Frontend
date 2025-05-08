// src\components\ui\modals\CreateModal.tsx

import React, { useState } from 'react';
import { CreateModalPageProps, Field } from '../../../types/interfaces';
import ReusableButton from "../button/ReusableSubmitButton";
import ReusableModal from "./ReusableModal";

const CreateModalPage: React.FC<CreateModalPageProps> = ({ open, onClose, fields = [], endpoint = '', pageType, onFieldChange }) => {
  const [loading, setLoading] = useState(false);
  const isOpen = open ?? true;
  const handleClose = onClose ?? (() => { });

  const getModalTitle = (pageType: string) => {
    const titles: Record<string, string> = {
      managers: "Add Manager",
      executives: "Add Executive",
      operators: "Add Operator",
    };
    return titles[pageType] || "Add User";
  };

  return (
    <>
      <ReusableModal
        isOpen={isOpen}
        onClose={handleClose}
        endpoint={endpoint}
        fields={fields}
        title={getModalTitle(pageType || '')}
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
