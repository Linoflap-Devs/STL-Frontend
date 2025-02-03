import React, { useState } from 'react';
import ExecutiveTable, { Executive } from '~/components/executive/ExecutiveTable';
import CreateExecutive from '~/components/executive/CreateExecutive';

const ExecutivePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [executives, setExecutives] = useState<Executive[]>([]);

  // open modal for create execs
  const handleExecutiveCreate = (executive: Executive | null = null) => {
    setSelectedExecutive(executive);
    setModalOpen(true);
  };

  // handle form submission
  const handleSubmitExecutive = (userData: Executive | null) => {
    if (userData) {
      console.log('Submitted user data:', userData);

      setExecutives((prevExecutives) => [...prevExecutives, userData]);
    } else {
      console.log('No user data submitted');
    }
    setModalOpen(false);
  };

  return (
    <>  
      <ExecutiveTable
        executives={executives}
        onCreate={handleExecutiveCreate}
        onClose={() => setModalOpen(false)}
      />      
      <CreateExecutive
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitExecutive}
        userData={selectedExecutive}
      />
    </>
  );
};

export default ExecutivePage;
