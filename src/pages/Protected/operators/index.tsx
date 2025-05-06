import React, { useEffect } from "react";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import { getOperatorsData } from "~/utils/api/operators/get.operators.service";
import { Operator, GetOperatorsResponse } from "~/types/interfaces";
import dayjs from "dayjs";
import { useOperatorsData } from "../../../../store/useOperatorStore";

const OperatorsPage = () => {
  const {
    data,
    setData,
    columns,
    setColumns,
  } = useOperatorsData();

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await getOperatorsData<GetOperatorsResponse>("/operators/getOperators");
        if (response.success && Array.isArray(response.data?.data)) {
          const fetchedOperators = response.data.data;
          console.log("Fetched Operators:", fetchedOperators);

          setData(fetchedOperators);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
        setData([]);
      }
    };

    fetchOperators();
  }, []);

  useEffect(() => {
    setColumns([
      {
        key: "OperatorName",
        label: "Name",
        sortable: true,
        filterable: true,
      },
      {
        key: "Cities",
        label: "Approved Area of Operations",
        sortable: false,
        filterable: true,
        filterKey: "Cities",
        filterValue: (row: Operator) =>
          Array.isArray(row.Cities)
            ? row.Cities.map((c) => c.CityName).join(", ")
            : "",
        render: (row: Operator) =>
          Array.isArray(row.Cities) && row.Cities.length
            ? row.Cities.map((city) => city.CityName).join(", ")
            : "No cities",
      }, 
      {
        key: "DateOfOperation",
        label: "Date of Operations",
        sortable: true,
        filterable: true,
        filterKey: "DateOfOperation",
        render: (row: Operator) => row.DateOfOperation ? dayjs(row.DateOfOperation).format("YYYY-MM-DD") : "", 
      },
      {
        key: "Executive",
        label: "Created By",
        sortable: true,
        filterable: true,
        render: (operator: Operator) => operator?.Executive || "No executive",
      },
      {
        key: "Actions",
        label: "Status",
        sortable: false,
        filterable: false,
      },
    ]);
  }, [setColumns]);

  return (
    <div className="container mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-4">Small Town Lottery Operators</h1>
      <DetailedTable
        data={data}
        columns={columns}
        onCreate={() => {
          console.log(`Create new Operator`);
        }}
      />
    </div>
  );
};

export default OperatorsPage;