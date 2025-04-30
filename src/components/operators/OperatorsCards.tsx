import { cardDashboardStyles } from "../../styles/theme";

// Operators Page Store
import { useOperatorsStore} from "../../../store/useOperatorsStore";

const CardsOperatorsPage = () => {
  const {operatorsData} = useOperatorsStore();
  
  type Operators = {
    title: string;
    value: number
  }
  
  const OperatorsInfo: Operators[] = [
    { 
      title: "Total Operators", 
      value: operatorsData.totalOperators 
    },
    { title: "Total Active Operators", 
      value: operatorsData.totalActiveOperators 
    },
    {
      title: "Total Deleted Operators",
      value: operatorsData.totalDeletedOperators,
    },
    {
      title: "Total Inactive Operators",
      value: operatorsData.totalInactiveOperators,
    },
    {
      title: "Total Total New Operators",
      value: operatorsData.totalNewOperators,
    },
  ]
  return (
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-3">
            {OperatorsInfo.map((item, index) => (
              <div
                key={index}
                className="px-4 py-[1.5rem] flex-[1_1_200px] bg-gray-800 rounded-lg"
                style={{ ...cardDashboardStyles }}
              >
                <p className="text-[12px] leading-4 text-gray-400">{item.title}</p>
                {item.value === undefined || item.value === null ? (
                  <div className="w-20 h-6 bg-gray-500 animate-pulse rounded-md mt-3" />
                ) : (
                  <p className="text-3xl font-bold leading-[1.1]">{item.value}</p>
                )}
              </div>
            ))}
          </div>
  )
}

export default CardsOperatorsPage