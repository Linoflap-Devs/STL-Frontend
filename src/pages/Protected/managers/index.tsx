import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,

} from "@mui/material";
import { UserSectionData } from "~/data/AdminSectionData";
import ManagerTable, { User } from '~/components/manager/ManagerTable';
import ManagerDashboardPage from '~/components/manager/ManagerDashboard';
import CreateManager from '~/components/manager/CreateManager';
import UpdateManager from '~/components/manager/UpdateManager';
import { fetchUsers } from '~/utils/api/users';
import { fetchRegions, fetchProvinces } from '~/utils/api/location';

// Import location data
const cities = require('philippines/cities');

const ManagersPage = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [regions, setRegions] = useState([]); // Store regions
  const [provinces, setProvinces] = useState([]); // Store provinces
  const [cityList, setCityList] = useState([]); // Store cities
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);

  // Fetching data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResponse, regionResponse, provinceResponse] = await Promise.all([
          fetchUsers({}),
          fetchRegions({}),
          fetchProvinces({})
        ]);

        if (userResponse.success && regionResponse.success && provinceResponse.success) {
          setRegions(regionResponse.data);
          setProvinces(provinceResponse.data);
          
          const cityData = cities.map((city: any) => ({
            name: city.name,
            province: city.province
          }));
          setCityList(cityData);

          // Filter only managers (UserTypeId === 3)
          const filteredUsers = userResponse.data
            .filter((user: { UserTypeId: number }) => user.UserTypeId === 3)
            .map((user: any) => ({
              userId: user.UserId,
              FirstName: user.FirstName ?? "N/A",
              LastName: user.LastName ?? "N/A",
              Email: user.Email ?? "N/A",
              DateOfRegistration: user.DateOfRegistration ?? "N/A",
              CreatedBy: user.CreatedBy ?? "N/A",
              Region: user.Region ?? "N/A",
              Province: user.Province ?? "N/A",
              City: user.City ?? "N/A",
            }));

          setManagers(filteredUsers);
        } else {
          console.error("Failed to fetch some data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
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

  const handleSubmitUser = async (userData: User | null) => {
    if (userData) {
      try {
        const response = await fetchUsers({}); // Fetch the latest data
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

          setManagers(filteredUsers); // Update state with fresh data
        } else {
          console.error("Failed to fetch updated users:", response.message);
        }
      } catch (error) {
        console.error("Error fetching updated users:", error);
      }
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
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 0, }}
          gutterBottom
        >
          {UserSectionData.titleManager}
        </Typography>
      </Box>
      <Box sx={{ marginTop: 2, marginBottom: 3, }}>
        <ManagerDashboardPage />
      </Box>
      <Box>
        <ManagerTable
          onCreate={handleUserCreate}
          onEdit={handleUserEdit}
          managers={managers}
          onDelete={handleDeleteManager}
        />
      </Box>
      <CreateManager
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitUser}
        userData={selectedUser}
        managers={managers}
        regions={regions} 
        provinces={provinces} 
        cities={cityList} 
      />
      {isUpdateModalOpen && (
        <UpdateManager
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          onSubmit={handleSaveUpdatedUser}
          manager={selectedManager}
          cities={cityList}
          regions={regions}
          provinces={provinces}
        />
      )}
    </Box>
  );
};

export default ManagersPage;