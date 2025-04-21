import React from "react";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { verifyPass } from "~/utils/api/auth";
import { addUser, updateUser } from "~/utils/api/users";
import Swal from "sweetalert2";
import { LoginSectionData } from "../../data/LoginSectionData";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import { User } from "~/pages/Protected/users/[role]";

interface ConfirmUserActionModalProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  user: any;
  onSubmit: (newUser: any) => void;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  selectedUser: User | null; // for remarks
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>; // for remarks
  actionType: "create" | "update" | "suspend";
}

const ConfirmUserActionModalPage: React.FC<ConfirmUserActionModalProps> = ({
  open,
  onClose,
  user,
  setUser,
  onSubmit,
  setErrors,
  actionType,
  selectedUser,
  setSelectedUser,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [userType, setUserType] = useState("");
  const router = useRouter();

  useEffect(() => {
    const pageType = router.asPath.includes("managers")
      ? "manager"
      : "executive";
    setUserType(pageType);
  }, [router.asPath]);

  // Dynamically set userTypeId based on userType
  const userTypeId = userType === "manager" ? 2 : 3;

  const handleManagerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedUser) {
      setSelectedUser((prevUser) => prevUser ? { ...prevUser, remarks: e.target.value } : null);
    }
  };

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

      let updatedUser = {
        ...user,
        ...(userTypeId && { userTypeId }), // Only needed for create
      };

      let response: { success: boolean; data: User | null; message: string };

      if (actionType === "create") {
        response = await addUser(updatedUser);
        if (!response.success) throw new Error(response.message);
      }
      else if (actionType === "update") {
        if (!user?.UserId) {
          console.error("UserId is null");
          return;
        }

        response = await updateUser(user.UserId, user);
        if (!response.success) throw new Error(response.message);

        if (setUser && response.data) {
          setUser((prevUser: any) => ({
            ...prevUser,
            ...response.data,
            remarks: response.data?.remarks ?? prevUser.remarks ?? "",
          }));
        }
      }
      else if (actionType === "suspend") {
        if (!user?.userId) {
          console.error("UserId is null");
          return;
        }

        const suspendPayload = {
          isActive: 0,
          remarks: user.remarks || "",
        };

        response = await updateUser(user.userId, suspendPayload);
        if (!response.success) {
          const errMsg = response.message || "Failed to suspend user.";
          setError(errMsg);
          await Swal.fire({
            icon: "error",
            title: "Error!",
            text: errMsg,
            confirmButtonColor: "#D32F2F",
          });
          return;
        }

        if (setSelectedUser && response.data) {
          setSelectedUser((prevUser) =>
            prevUser
              ? {
                ...prevUser,
                ...response.data,
                remarks: response.data?.remarks ?? prevUser.remarks ?? "",
              }
              : null
          );
        }
      }

      onClose();

      // Show success modal
      await Swal.fire({
        icon: "success",
        title:
          actionType === "create"
            ? `${userTypeId === 2 ? "Manager" : "Executive"} Created!`
            : actionType === "update"
              ? `${userTypeId === 2 ? "Manager" : "Executive"} Updated!`
              : "User Suspended!",
        text:
          actionType === "create"
            ? `The ${userTypeId === 2 ? "manager" : "executive"} has been added successfully.`
            : actionType === "update"
              ? `The ${userTypeId === 2 ? "manager" : "executive"} details have been updated successfully.`
              : `User suspended successfully.`,
        confirmButtonColor: "#67ABEB",
      });

      onSubmit(updatedUser);
      setUser({});
      setErrors({});
    } catch (error: any) {
      console.error(`Error during ${actionType}:`, error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error!",
        text: `An error occurred while trying to ${actionType} user.`,
      });
    }
  };

  return (
    <React.Fragment>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative z-20 flex w-full justify-center items-center">
            <div className="w-[90%] sm:w-[60%] md:w-[40%] max-w-[500px] px-6 pt-5 pb-12 bg-[#181A1B] rounded-lg relative">
              {/* Close Button */}
              <IconButton
                onClick={onClose}
                className="absolute top-2 left-2 text-gray-400 hover:text-white z-30"
                style={{ backgroundColor: "#171717" }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              {/* Logo + Title */}
              <div className="text-center mb-4 mt-2">
                <img
                  src={LoginSectionData.image}
                  alt="altLogo"
                  className="max-w-[35%] mx-auto mb-3"
                  loading="lazy"
                />
                <h1 className="text-3xl font-bold text-white">
                  {LoginSectionData.ConfirmIdentity}
                </h1>
                <p className="text-gray-400 text-xs">
                  {LoginSectionData.ConfirmIdentityDescription}
                </p>
              </div>

              <div className="px-5 mt-7">
                {/* Remarks Field */}
                <div className="w-full mb-2">
                  <label
                    htmlFor="remarks"
                    className="block text-sm font-medium text-white mb-1.5"
                  >
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    placeholder="Enter Remarks"
                    rows={3}
                    value={selectedUser?.remarks || ""}
                    onChange={handleManagerChange}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.stopPropagation();
                      }
                    }}
                    className="w-full px-4 py-3 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white-200"
                  />
                </div>

                {/* Password Field */}
                <div className="relative w-full mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-10 text-sm rounded-md border ${error ? "border-red-500" : "border-gray-600"
                      } bg-[#1F1F1F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-white-200"
                      }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute top-9 right-3 text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <VisibilityOff className="text-lg" />
                    ) : (
                      <Visibility className="text-lg" />
                    )}
                  </button>
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  onClick={handleVerifyUserAction}
                  className="w-full py-2.5 mt-5 bg-[#67ABEB] hover:bg-[#A5C9ED] text-[#212121] rounded-lg text-sm font-medium disabled:opacity-50"
                  disabled={false}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ConfirmUserActionModalPage;
