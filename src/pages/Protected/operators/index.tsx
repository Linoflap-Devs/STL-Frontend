import React, { useEffect } from "react";
import { useOperatorsData } from "../../../../store/useOperatorStore";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import CardsPage from "~/components/ui/dashboardcards/CardsData";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { OperatorFieldFormPage } from "~/components/operators/OperatorForm";
import { fetchOperators } from "~/services/userService";
import { operatorTableColumns } from "~/config/operatorTableColumns";

const OperatorsPage = () => {
  const { data, setData } = useOperatorsData();
  const textlabel = "Operators";

  useEffect(() => {
    fetchOperators(setData);
  }, [setData]);

  const tableColumns = operatorTableColumns();

  const dashboardData = data.map(op => ({
    ...op,
    region: op.OperatorRegion?.RegionName ?? "Unknown",
  }));

  return (
    <div className="mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-3">Small Town Lottery Operators</h1>
      <CardsPage 
        dashboardData={data}
        textlabel={textlabel}
      />
      <ChartsDataPage
        userType="operator" 
        pageType="operator" 
        dashboardData={dashboardData}
      />
      <DetailedTable
        data={data}
        columns={tableColumns}
        pageType="operator"
        source="operators"
      />
      <OperatorFieldFormPage />
    </div>
  );
};

export default OperatorsPage;
