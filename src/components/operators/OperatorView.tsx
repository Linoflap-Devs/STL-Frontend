import React, { useEffect, useState } from "react";
import { ReusableModalPageProps } from "~/types/interfaces";

const OperatorViewPage: React.FC<ReusableModalPageProps> = ({
  initialUserData,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (initialUserData && Object.keys(initialUserData).length > 0) {
      setFormData(initialUserData);
    } else {
      setFormData({});
    }
  }, [initialUserData]);

  return (
    <div className="p-4 space-y-2 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Operator View</h2>
      {Object.keys(formData).length > 0 ? (
        <pre className="whitespace-pre-wrap max-h-96 overflow-auto bg-gray-50 p-4 rounded border">
          {JSON.stringify(formData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500 italic">No operator data to display.</p>
      )}
    </div>
  );
};

export default OperatorViewPage;
