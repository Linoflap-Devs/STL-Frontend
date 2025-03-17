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
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
            Street: user.Street ?? "N/A",
          }));

        setManagers(filteredUsers);
      } else {
        console.error("Failed to fetch some data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Re-fetch data when `refresh` changes
  useEffect(() => {
    loadData();
  }, [refresh]);

  const handleUserCreate = () => {
    setSelectedUser(null);
    setUpdateModalOpen(false);
    setModalOpen(true);
  };

  const handleUserEdit = (user: User, mode: "view" | "update") => {
    setSelectedManager(user);
    setUpdateModalOpen(true);

    if (mode === "update") {
      setIsClicked(true);
      setIsDisabled(false);
    } else {
      setIsClicked(false);
      setIsDisabled(true);
    }
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedManager(null);
  };

  const handleSubmitUser = async (userData: User | null) => {
    if (userData) {
      try {
        await fetchUsers({});
        setRefresh(prev => !prev);
      } catch (error) {
        console.error("Error fetching updated users:", error);
      }
    }
  
    setSelectedUser(null);
  
    setModalOpen(false);
  };

  const handleSaveUpdatedUser = (updatedUser: User) => {
    setManagers(prevManagers =>
      prevManagers.map(manager =>
        manager.id === updatedUser.id ? updatedUser : manager
      )
    );
    setSelectedManager(null);
    setUpdateModalOpen(false);
    setRefresh(prev => !prev);
  };

  const handleDeleteManager = (ids: number[]) => {
    const updatedManagers = managers.filter(manager => !ids.includes(manager.id!));
    setManagers(updatedManagers);
    setRefresh(prev => !prev);
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
          onEdit={(user, mode = "view") => handleUserEdit(user, mode)}
          managers={managers}
          onDelete={handleDeleteManager}
          onSubmit={handleSubmitUser}
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
          isDisabled={isDisabled}
          isClicked={isClicked}
        />
      )}
    </Box>
  );
};

export default ManagersPage;