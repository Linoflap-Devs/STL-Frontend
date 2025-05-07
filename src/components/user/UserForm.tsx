import React, { useEffect } from 'react';
import ReusableModalPage from '~/components/ui/modals/ReusableModal';
import useUserRoleStore from '../../../store/useUserStore';

const roleConfigs = {
  manager: {
    userTypeId: 2,
    endpoint: '/users/addUser',
    fields: [
      { name: 'FirstName', label: 'Manager First Name', type: 'text', placeholder: 'Enter manager first name' },
      { name: 'LastName', label: 'Manager Last Name', type: 'text', placeholder: 'Enter manager last name' },
      { name: 'Suffix', label: 'Suffix', type: 'text', placeholder: 'Enter suffix' },
      { name: 'PhoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number' },
      { name: 'OperatorId', label: 'Assigned Company', type: 'text', placeholder: 'Enter assigned company' },
      { name: 'Email', label: 'Email Address', type: 'email', placeholder: 'Enter email address' },
      { name: 'Password', label: 'Password', type: 'password', placeholder: 'Enter password' },
    ],
  },
  executive: {
    userTypeId: 3,
    endpoint: '/users/addUser',
    fields: [
      { name: 'FirstName', label: 'Executive First Name', type: 'text', placeholder: 'Enter executive first name' },
      { name: 'LastName', label: 'Executive Last Name', type: 'text', placeholder: 'Enter executive last name' },
      { name: 'Suffix', label: 'Suffix', type: 'text', placeholder: 'Enter suffix' },
      { name: 'PhoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number' },
      { name: 'OperatorId', label: 'Assigned Company', type: 'text', placeholder: 'Enter assigned company' },
      { name: 'Email', label: 'Email Address', type: 'email', placeholder: 'Enter email address' },
      { name: 'Password', label: 'Password', type: 'password', placeholder: 'Enter password' },
    ],
  },
};

const UserFieldFormPage: React.FC = () => {
  const { modalOpen, setModalOpen, setFields, fields, setRoleId } = useUserRoleStore();

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pageType =
    pathname.includes('manager') ? 'manager' :
    pathname.includes('executive') ? 'executive' :
    null;

  if (!pageType) return null;

  const roleConfig = roleConfigs[pageType];
  const roleString = pageType.charAt(0).toUpperCase() + pageType.slice(1);

  useEffect(() => {
    setFields(roleConfig.fields);
    setRoleId(roleConfig.userTypeId);
  }, [pageType, setFields, setRoleId]);

  return (
    <div className="p-4">
      <ReusableModalPage
        title={`Add ${roleString}`}
        endpoint={roleConfig.endpoint}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fields={fields}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
};

export default UserFieldFormPage;
