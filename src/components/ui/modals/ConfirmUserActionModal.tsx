import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Close as CloseIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { verifyPass } from "~/utils/api/auth";
import { LoginSectionData } from "../../../data/LoginSectionData";
import { ConfirmUserActionModalProps } from "~/types/interfaces";
import axiosInstance from "~/utils/axiosInstance";
import useUserRoleStore from "../../../../store/useUserStore";
import { fetchUsers } from "~/services/userService";

const ConfirmUserActionModalPage: React.FC<ConfirmUserActionModalProps> = ({
  formData,
  setFormData,
  setErrors,
  actionType,
  open,
  endpoint,
  onClose
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [userType, setUserType] = useState("");
  const router = useRouter();
  const { roleId, data, setData } = useUserRoleStore();

  useEffect(() => {
    const pageType = router.asPath.includes("managers") ? "manager" : "executive";
    setUserType(pageType);
  }, [router.asPath]);

  //const userTypeId = userType === "manager" ? 2 : 3;

  const handleVerifyUserAction = async () => {
    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const { success: isVerified } = await verifyPass(password);
      if (!isVerified) {
        setError("Invalid password. Please try again.");
        return;
      }

      setError("");

      // Conditionally add `userTypeId` to formData if roleId exists
      const dataToSend = {
        ...formData,
        ...(roleId && { userTypeId: roleId }),
      };

      // Create user via the API
      const response = await axiosInstance.post(endpoint.create, dataToSend, {
        withCredentials: true,
      });

      if (!response?.data?.success) {
        const errMsg = response?.data?.message || `Failed to ${actionType} user.`;
        setError(errMsg);
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errMsg,
          confirmButtonColor: "#D32F2F",
        });
        return;
      }

      onClose(); // Close modal
      await Swal.fire({
        icon: "success",
        title: "User Created!",
        text: "The user has been created successfully.",
        confirmButtonColor: "#67ABEB",
      });

      // Reset form and states
      setFormData({});
      setPassword("");
      setErrors({});
      onClose();

      if (roleId !== null) {
        fetchUsers(roleId, setData);
      } // to refresh without refreshing

    } catch (error) {
      console.error("Error during user action:", error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error!",
        text: `An error occurred while trying to ${actionType} user.`,
      });
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative z-20 flex w-full justify-center items-center">
            <div className="w-[60%] sm:w-[60%] md:w-[40%] max-w-[430px] py-12 px-6 bg-[#F8F0E3] rounded-lg relative">

              {/* Close Button */}
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: "#ACA993",
                  padding: 0,
                  minWidth: 0,
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: "#928F7F",
                  },
                }}
              >
                <CloseIcon
                  style={{
                    fontWeight: 'bold',
                    fontSize: 22,
                    color: "#F8F0E3",
                  }}
                />
              </IconButton>

              {/* Logo + Title */}
              <div className="text-center mb-4 mt-2">
                <img
                  src={LoginSectionData.image}
                  alt="altLogo"
                  className="max-w-[35%] mx-auto mb-3"
                  loading="lazy"
                />
                <h1 className="text-3xl font-bold">
                  {LoginSectionData.ConfirmIdentity}
                </h1>
                <p className="text-xs">
                  {LoginSectionData.ConfirmIdentityDescription}
                </p>
              </div>

              <div className="px-5 mt-7">
                {/* Password Input */}
                <div className="relative w-full mb-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 pr-10 text-sm rounded-md border ${error ? "border-red-500" : "border-gray-600"} bg-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-white-200"}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  onClick={handleVerifyUserAction}
                  className="w-full py-2.5 mt-5 bg-[#F6BA12] hover:bg-[#FFD100] text-[#212121] rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmUserActionModalPage;
