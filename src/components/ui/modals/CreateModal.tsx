import React from 'react';
import ReusableModal from './ReusableModal';
import useUserRoleStore from '../../../../store/useUserStore';
import axios from 'axios';
import { CreateModalPageProps } from '~/types/interfaces';

const CreateModalPage: React.FC<CreateModalPageProps> = ({ open, onClose, fields = [], endpoint = '' }) => {
  const { modalOpen, setModalOpen } = useUserRoleStore();

  const isOpen = open ?? modalOpen;
  const handleClose = onClose ?? (() => setModalOpen(false));

  // Handle form submission
  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      await axios.post(endpoint, formData);
      // Handle success and close the modal
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (    
    <ReusableModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add New ${fields[0]?.label?.split(' ')[0]}`}
      //fields={fields}
      endpoint={endpoint}
      onSubmit={handleSubmit} 
      fields={[]}
    />
  );
};

export default CreateModalPage;
