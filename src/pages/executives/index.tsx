import React, { useState } from 'react';
import ExecutiveTable, { User } from '~/components/executive/ExecutiveTable';
import CreateExecutive from '~/components/executive/CreateExecutive';
import UpdateExecutive from '~/components/executive/UpdateExecutive';

const ExecutivePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [executives, setExecutives] = useState<User[]>([]);

  // Open modal for creating a new executive
  const handleExecutiveCreate = (executive?: User) => {
    setSelectedExecutive(executive || null);
    setModalOpen(true);
  };

  // Open modal for editing an existing executive
  const handleExecutiveEdit = (user: User) => {
    setSelectedExecutive(user);
    setUpdateModalOpen(true);
  };

  // Handle form submission for a new executive
  const handleSubmitExecutive = (userData: User | null) => {
    if (userData) {
      console.log('Submitted user data:', userData);

      setExecutives((prevExecutives) => {
        const existingIndex = prevExecutives.findIndex(exec => exec.id === userData.id);
        if (existingIndex !== -1) {
          return prevExecutives.map((exec, idx) => idx === existingIndex ? userData : exec);
        }
        return [...prevExecutives, userData];
      });
    } else {
      console.log('No user data submitted');
    }
    setModalOpen(false);
  };

  const handleSaveUpdatedExecutive = (updatedExecutive: User) => {
    console.log("Updated user data:", updatedExecutive);
  
    setExecutives((prevExecutives) =>
      prevExecutives.map((executive) =>
        executive.id === updatedExecutive.id ? updatedExecutive : executive
      )
    );
    setSelectedExecutive(null);
    setUpdateModalOpen(false);
  };
  
  // Handle executive deletion
  const handleDeleteExecutive = (ids: number[]) => {
    setExecutives((prevExecutives) =>
      prevExecutives.filter((executive) => executive.id && !ids.includes(executive.id))
    );
  };

  return (
    <>  
      <ExecutiveTable
        executives={executives}
        onCreate={handleExecutiveCreate}
        onClose={() => setModalOpen(false)}
        onDelete={handleDeleteExecutive}
        onEdit={handleExecutiveEdit}
      />      
      <CreateExecutive
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitExecutive}
        userData={selectedExecutive}
        executives={executives}
      />
      {isUpdateModalOpen && (
        <UpdateExecutive
          open={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          onSubmit={handleSaveUpdatedExecutive}
          executives={selectedExecutive} userData={null}          
        />
      )}
    </>
  );
};

export default ExecutivePage;