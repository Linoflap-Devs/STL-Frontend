// src/components/operators/OperatorsView.tsx

import React, { useEffect } from "react";
import OperatorViewPage from "~/components/operators/OperatorView";

export interface OperatorViewPageProps {
  slug: string;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug }) => {
  useEffect(() => {
    console.debug("[OperatorViewPage] Rendered with slug:", slug);
  }, [slug]);

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col w-full md:w-2/3">
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="text-sm text-gray-600">
            Slug: <strong>{slug}</strong>
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <OperatorViewPage />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        <div className="bg-gray-100 p-4 rounded">Right Column</div>
      </div>
    </div>
  );
};

export default OperatorsView;
