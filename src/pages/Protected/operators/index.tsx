import React, { useEffect } from "react";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import { getOperatorsData } from "~/utils/api/operators/get.operators.service";
import { GetOperatorsResponse } from "~/types/interfaces";
import dayjs from "dayjs";
import { useOperatorsData } from "../../../../store/useOperatorStore";
import CardsPage from "~/components/ui/dashboardcards/CardsData";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { Button } from "@mui/material";
import { getUserStatus } from "~/utils/dashboarddata";
import { Operator } from "~/types/types";
import OperatorFieldFormPage from "~/components/operators/OperatorForm";

const OperatorsPage = () => {
  const {
    data,
    setData,
    columns,
    setColumns,
    setModalOpen,
  } = useOperatorsData();

  const textlabel = "Operators";

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
        filterable: false,
      },
      {
        key: "Cities",
        label: "Approved Area of Operations",
        sortable: true,
        filterable: false,
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
        filterable: false,
        render: (operator: Operator) => operator?.Executive || "No executive",
      },
      {
        key: "Status",
        label: "Status",
        sortable: true,
        filterable: true,
        render: (user: Operator) => {
          const sevenDaysAgo = dayjs().subtract(7, "days");
          const status = getUserStatus(user, sevenDaysAgo);
          return (
            <Button
              variant="contained"
              sx={{
                cursor: "auto",
                textTransform: "none",
                borderRadius: "12px",
                padding: "2px 13px",
                fontSize: "12px",
                backgroundColor:
                  status === "Suspended"
                    ? "#FF7A7A"
                    : status === "Inactive"
                      ? "#FFA726"
                      : "#046115",
                color: "#ffff",
                "&:hover": {
                  backgroundColor:
                    status === "Suspended"
                      ? "#F05252"
                      : status === "Inactive"
                        ? "#FFA726"
                        : "#046115",
                },
              }}
            >
              {status}
            </Button>
          );
        },
      },
    ]);
  }, [setColumns]);

  return (
    <div className="mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-3">Small Town Lottery Operators</h1>
      <CardsPage
        dashboardData={data}
        cardData={[]}
        textlabel={textlabel || ""}
      />
      <ChartsDataPage
        userType="operator"
        pageType="operator"
        regions={[]}
        dashboardData={data.map(op =>
          ({ ...op, region: op.OperatorRegion?.RegionName ?? "Unknown" }))}
      />
      <>
        <DetailedTable
          data={data}
          columns={columns}
          statsPerRegion={[]}
        />
        {/* Conditionally render CreateUserModalPage */}
        <OperatorFieldFormPage />
      </>
    </div>
  );
};

export default OperatorsPage;