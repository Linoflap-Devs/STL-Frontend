import React, { useEffect, useState } from "react";
import { ReusableModalPageProps } from "~/types/interfaces";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import router from "next/router";
import Select from "react-select";
import useUpdateModalState from "../../../store/useUpdateModalStore";
import Swal from "sweetalert2";
import axiosInstance from "~/utils/axiosInstance";
import { AxiosError } from "axios";
type GameTypeOption = {
  value: number;
  label: string;
};
const OperatorViewPage: React.FC<ReusableModalPageProps> = ({
  initialUserData,
  gameTypes,
  regions,
  provinces,
  cities,
}) => {
  const {
    user,
    setUser,
    errors,
    setErrors,
    status,
    setStatus,
    isLoading,
    isViewMode,
    selectedUserId,
    setSelectedUserId,
    openEditLogModal,
    setOpenEditLogModal,
    handleManagerChange,
  } = useUpdateModalState();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);

  const handleDisable = () => {
    setIsDisabled(false);
    setShowEditButton(false);
  };

  const gameTypeOptions: GameTypeOption[] =
    gameTypes?.map((type) => ({
      value: type.GameCategoryId!, // <-- tells TypeScript this is never undefined
      label: `${type.GameCategory} (ID: ${type.GameCategoryId})`,
    })) || [];

  useEffect(() => {
    console.log("initialUserData:", initialUserData);

    const operatorData = initialUserData?.data;

    if (operatorData && operatorData.GameTypes) {
      const mappedGameTypes = operatorData.GameTypes.map(
        (gt: { GameCategory: any; GameCategoryId: any }) => ({
          label: gt.GameCategory,
          value: gt.GameCategoryId,
        })
      );

      console.log("Mapped GameTypes for Select:", mappedGameTypes);

      setSelectedGameTypes(mappedGameTypes);
      setFormData(operatorData);

      console.log("Form data set:", operatorData);
    } else {
      setFormData({});
      setSelectedGameTypes([]);

      console.log(
        "No initialUserData or GameTypes found. Resetting form and selected game types."
      );
    }
  }, [initialUserData]);

  const operator = formData?.data || {};

  // FOR SELECT FIELDS

  const handleMultiSelect = (fieldName: string, selectedOptions: any[]) => {
    const selectedValues = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : [];

    console.log(`Field Name: ${fieldName}`);
    console.log(`Selected Options:`, selectedOptions);
    console.log(`Selected Values:`, selectedValues);

    setFormData({
      ...formData, // Merge the existing user object
      [fieldName]: selectedValues,
    });
  };

  return (
    <div>
      {/* History */}
      <div className="">
        <div className="text-base font-bold mb-2">History</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="createdBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Created By
            </label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              placeholder="Admin User"
              value={operator?.CreatedBy || ""}
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="lastUpdatedBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Updated By
            </label>
            <input
              type="text"
              id="lastUpdatedBy"
              name="lastUpdatedBy"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              placeholder="2025-05-01"
              value={operator?.CreatedBy || ""}
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="creationDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Creation Date
            </label>
            <input
              type="text"
              id="creationDate"
              name="creationDate"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              value={operator?.CreatedAt || ""}
            />
          </div>

          <div>
            <label
              htmlFor="lastUpdatedDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Updated Date
            </label>
            <input
              type="text"
              id="lastUpdatedDate"
              name="lastUpdatedDate"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              value={operator?.CreatedAt || ""}
            />
          </div>
        </div>
      </div>

      {/* AAC Information */}
      <div className="mt-6">
        <div className="text-base font-bold mb-2">AAC Information</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="operatorsName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Name
            </label>
            <input
              type="text"
              id="operatorsName"
              name="operatorsName"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              placeholder="Operators Name"
              value={operator?.OperatorName || ""}
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              value={operator?.ContactNo || "N/A"}
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="operatorAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Address
            </label>
            <input
              type="text"
              id="operatorAddress"
              name="operatorAddress"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              value={operator?.OperatorAddress || ""}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operator's Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              placeholder="2025-05-01"
              value={operator?.OperatorEmail || ""}
            />
          </div>

          <div>
            <label
              htmlFor="dateOfOperations"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Operations
            </label>
            <input
              type="text"
              id="dateOfOperations"
              name="dateOfOperations"
              className={`w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]`}
              placeholder="2025-05-01"
              value={operator?.DateOfOperation || ""}
            />
          </div>

          {/* Games Provided */}
          <div>
            <label
              htmlFor="gameTypes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Games Provided
            </label>
            <Select<GameTypeOption, true> // true = isMulti
              id="gameTypes"
              name="gameTypes"
              isMulti
              options={gameTypeOptions}
              value={selectedGameTypes}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Games Provided"
              onChange={(selectedOptions) =>
                handleMultiSelect(
                  "gameTypes",
                  Array.isArray(selectedOptions) ? selectedOptions : []
                )
              }
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Area of Operations */}
          <div className="w-full">
            <label
              htmlFor="areofOperations"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area of Operations
            </label>
            <Select
              id="gameTypes"
              name="gameTypes"
              isMulti
              // options={gameTypeOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Area of Operations"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 1000000,
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 400,
                  overflowY: "auto",
                }),
              }}
              classNames={{
                control: () => "rounded text-sm",
              }}
            />
          </div>

          {/* Provincial Operations */}
          <div>
            <label
              htmlFor="provinces"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area of Provincial Operations
            </label>
            <Select
              id="provinces"
              name="provinces"
              isMulti
              options={provinces}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Provinces"
              onChange={(selectedOptions) =>
                handleMultiSelect(
                  "provinces",
                  Array.isArray(selectedOptions) ? selectedOptions : []
                )
              }
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Status */}
          <div className="w-full">
            <label
              htmlFor="areofOperations"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <Select
              id="gameTypes"
              name="gameTypes"
              isMulti
              // options={gameTypeOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Status"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 1000000,
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 400,
                  overflowY: "auto",
                }),
              }}
              classNames={{
                control: () => "rounded text-sm",
              }}
            />
          </div>
        </div>
      </div>

      {/* Remarks Field */}
      {!isDisabled && (
        <div className="w-full !mt-4">
          <label
            htmlFor="remarks"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            placeholder="Enter Remarks"
            value={typeof user.remarks === "string" ? user.remarks : ""}
            onChange={handleManagerChange}
            className={`w-full border !border-[#0038A8] rounded px-3 py-2 text-sm bg-transparent ${
              errors.remarks
                ? "border-red-600 focus:ring-red-600"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            rows={3} // same as minRows
          />
          {errors.remarks && (
            <p className="text-red-600 text-xs mt-1">{errors.remarks}</p>
          )}
        </div>
      )}
      {Object.keys(formData).length > 0 ? (
        <pre className="whitespace-pre-wrap max-h-96 overflow-auto bg-gray-50 p-4 rounded border">
          {JSON.stringify(formData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500 italic">No operator data to display.</p>
      )}
      {/* Show only when `showEditButton` is true */}
      {showEditButton && (
        <div className="w-full mt-4">
          <button
            onClick={isDisabled ? handleDisable : handleDisable}
            className="w-full bg-[#F6BA12] hover:bg-[#FFD100] text-black font-base text-sm px-7 py-2 rounded mt-1"
          >
            {isDisabled ? "Update Operator" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OperatorViewPage;
