import React, {useState} from 'react';
import ExecutiveTable, { Executive } from '~/components/executive/ExecutiveTable';
import CreateExecutive from '~/components/executive/CreateExecutive';

const ExecutivePage = () => {
const [isModalOpen, setModalOpen] = useState(false);
const [selectedExecutive, setselectedExecutive] = useState<Executive | null>(null);

  const handleExecutiveCreate = () => {
    //setSelectedExecutive(null);
    setModalOpen(true);
  }

  const handleSubmitExecutive = (userData: Executive | null) => {
    if (userData) {
      //console.log('Submitted user data: ', userData);
      //setManagers((prevManagers) => [...prevManagers, userData]);
    } else {
      //console.log('No user data submitted');
      //console.log(managers);
    }
    setModalOpen(false);
  };

    return (
        <>  
        <ExecutiveTable
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
    )
}

export default ExecutivePage;