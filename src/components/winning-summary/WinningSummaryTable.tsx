import React, { useState, useEffect } from "react";
import { fetchWinners } from "~/utils/api/winners";
import ReadOnlyTablePage from "../ui/tables/ReadOnlyTable";
import { winningTableColumns } from "~/config/winningTableColumns";

export interface Transactions {
  transactionNumber: string;
  date: string;
  drawTime: string;
  region: string,
  province: string,
  betAmount: number;
  tumbok: number,
  sahod: number,
  ramble: number,
  winType: string,
  gameType: string;
  selectedPair: string;
  status: string;
  payoutAmount: number
}

const TableWinningSummary = (params: {gameCategoryId?: number}) => {
  const tableColumns = winningTableColumns();

  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWinners();
        console.log(response);

        if (params.gameCategoryId && params.gameCategoryId > 0) {
          response.data = response.data.filter(
            (item: { GameCategoryId: number }) =>
              item.GameCategoryId === params.gameCategoryId
          );
        }

        if (response.success) {
          const transformedData = response.data.map((transaction: any) => ({
            transactionNumber: transaction.TransactionNumber,
            date: new Date(transaction.DateOfTransaction).toLocaleDateString(),
            drawTime:
              transaction.DrawOrder == 1
                ? "First Draw"
                : transaction.DrawOrder == 2
                  ? "Second Draw"
                  : "Third Draw",
            betAmount: transaction.BetAmount,
            region: transaction.Region,
            province: transaction.Province,
            tumbok: transaction.Tumbok,
            sahod: transaction.Sahod,
            ramble: transaction.Ramble,
            payoutAmount: transaction.PayoutAmount,
            gameType: transaction.GameCategory,
            selectedPair: `${transaction.WinningCombinationOne}-${transaction.WinningCombinationTwo}${transaction.WinningCombinationThree > 0 ? `-${transaction.WinningCombinationThree}` : ""}${transaction.WinningCombinationFour > 0 ? `-${transaction.WinningCombinationFour}` : ""}`, // Use hyphen instead of ampersand
            status: transaction.TransactionStatus,
          }));

          setTransactions(transformedData);
        } else {
          setError(response.message || "Failed to fetch transactions");
        }
      } catch (err) {
        setError("An error occurred while fetching transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log('Winning Transactions:',transactions); // we have no data here

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  } 

  return (
    <ReadOnlyTablePage
      data={transactions}
      columns={tableColumns}
    />
  );
};

export default TableWinningSummary;


