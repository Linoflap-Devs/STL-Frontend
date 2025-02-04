import React, { useState } from 'react';
import ExecutiveTable, { User } from '~/components/executive/ExecutiveTable';
import CreateExecutive from '~/components/executive/CreateExecutive';

const ExecutivePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<User | null>(null);
  const [executives, setExecutives] = useState<User[]>([]);

  // open modal for create execs
  const handleExecutiveCreate = (executive: User | null = null) => {
    setSelectedExecutive(executive);
    setModalOpen(true);
  };
  
  // handle form submission
  const handleSubmitExecutive = (userData: User | null) => {
    if (userData) {
      console.log('Submitted user data:', userData);

      setExecutives((prevExecutives) => [...prevExecutives, userData]);
    } else {
      console.log('No user data submitted');
    }
    setModalOpen(false);
  };

  const handleDeleteExecutive = (ids: number[]) => {
    const updatedExecutives= executives.filter(executive => !ids.includes(executive.id!));
    setExecutives(updatedExecutives);
  };

  return (
    <>  
      <ExecutiveTable
        executives={executives}
        onCreate={handleExecutiveCreate}
        onClose={() => setModalOpen(false)}
        onDelete={handleDeleteExecutive}
      />      
      <CreateExecutive
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitExecutive}
        userData={selectedExecutive}
        executives={executives}
      />
    </>
  );
};

export default ExecutivePage;
