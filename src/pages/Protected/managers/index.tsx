import React, { useState, useEffect } from 'react';
import ManagerTable, { User } from '~/components/manager/ManagerTable';
import CreateManager from '~/components/manager/CreateManager';
import UpdateManager from '~/components/manager/UpdateManager';
import { fetchUsers } from '~/utils/api/users';
import { Region, Province, City } from '~/utils/api/locationTypes';

// Import location data
const philippines = require('philippines');

const regions = require('philippines/regions');
const provinces = require('philippines/provinces');
const cities = require('philippines/cities');

const UsersPage = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [regionList, setRegionList] = useState<Region[]>([]);
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [cityList, setCityList] = useState<City[]>([]);

  // fetching of data
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers({});
        if (response.success) {
          const filteredUsers = response.data
            .filter((user: { UserTypeId: number; }) => user.UserTypeId === 3)
            .map((user: { FirstName: any; LastName: any; Email: any; DateOfRegistration: any; Location: { Region: any; Province: any; City: any; }; CreatedBy: { FirstName: any; LastName: any; }; }) => ({
              FirstName: user.FirstName, 
              LastName: user.LastName,
              Email: user.Email,
              DateOfRegistration: user.DateOfRegistration,
              Region: user.Location?.Region || "Unknown",
              Province: user.Location?.Province || "Unknown",
              City: user.Location?.City || "Unknown",
              CreatedByFirstName: user.CreatedBy?.FirstName || "Unknown",
              CreatedByLastName: user.CreatedBy?.LastName || "Unknown",
            }));
    
          setManagers(filteredUsers);
        } else {
          console.error("Failed to fetch users:", response.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    loadUsers();
  
    setRegionList(regions);
    setProvinceList(provinces);
    setCityList(cities);
  }, []);

  const handleUserCreate = () => {
    setSelectedUser(null);
    setUpdateModalOpen(false);
    setModalOpen(true);
  };

  const handleUserEdit = (user: User) => {
    setSelectedManager(user);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedManager(null);
  };

  const handleSubmitUser = (userData: User | null) => {
      if (userData) {
          setManagers((prevManagers) => {
              if (prevManagers.some(manager => manager.id === userData.id)) {
                  return prevManagers;
              }
              return [...prevManagers, userData];
          });
      }
      setModalOpen(false);
  };

  const handleSaveUpdatedUser = (updatedUser: User) => {
    setManagers((prevManagers) =>
      prevManagers.map((manager) =>
        manager.id === updatedUser.id ? updatedUser : manager
      )
    );
    setSelectedManager(null);
    setUpdateModalOpen(false);
  };

  const handleDeleteManager = (ids: number[]) => {
    const updatedManagers = managers.filter(manager => !ids.includes(manager.id!));
    setManagers(updatedManagers);
  };

  return (
    <>
      <ManagerTable
        onCreate={handleUserCreate}
        onEdit={handleUserEdit}
        managers={managers}
        onDelete={handleDeleteManager}
      />
      <CreateManager
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitUser}
        userData={selectedUser}
        managers={managers} // for log checking only
        regions={regionList}
        provinces={provinceList}
        cities={cityList}
      />
      {isUpdateModalOpen && (
        <UpdateManager
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          onSubmit={handleSaveUpdatedUser}
          manager={selectedManager}
          regions={regionList}
          provinces={provinceList}
          cities={cityList}
        />
      )}
    </>
  );
};

export default UsersPage;
