// src\components\operators\OperatorView.tsx

import React from "react";
import { ReusableModalPageProps } from "~/types/interfaces";

const OperatorViewPage: React.FC<ReusableModalPageProps> = ({
  endpoint,
  initialUserData,
  operatorMap,
  children,
  provinces,
  regions,
  cities,
  gameTypes,
}) => {
  return (
    <div>
      {/* Render operator details */}
      <pre>data::: {JSON.stringify(initialUserData, null, 2)}</pre>
    </div>
  );
};

export default OperatorViewPage;
