import React, { useEffect } from "react";
import DetailedTable from "~/components/ui/tables/DetailedTable"; // Reusable table component
import { getOperatorsData } from "~/utils/api/operators/get.operators.service";
import { Operator, GetOperatorsResponse } from "~/types/types";
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
          console.log("Fetched Operators:", fetchedOperators); // Debugging line

          setData(fetchedOperators); // Set the operators separately
        } else {
          setData([]); // Reset the operator state
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
        setData([]); // Reset the operator state in case of error
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
        filterable: false,
        render: (row: Operator) =>
          Array.isArray(row.Cities) && row.Cities.length
            ? row.Cities.map(city => city.CityName).join(", ")
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
      <h1 className="text-3xl font-bold mb-4">Small Town Lottery Operators
      </h1>
      <DetailedTable
        data={data} // or data={users}
        columns={columns}
        //operatorMap={operatorMap}
      />
    </div>
  );
};

export default OperatorsPage;
