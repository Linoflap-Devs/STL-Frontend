import React, { useState, useEffect } from "react";
import {
  fetchHistoricalRegion,
  fetchTransactions,
} from "~/utils/api/transactions";
import DetailedTable from "../ui/tables/DetailedTable";

export interface Transactions {
  transactionNumber: string;
  date: string;
  drawTime: string;
  betAmount: number;
  tumbok: number;
  sahod: number;
  ramble: number;
  gameType: string;
  selectedPair: string;
  status: string;
}

const TableBettingSummary = (params: { gameCategoryId?: number }) => {
  const [transactions, setTransactions] = useState<Transactions[]>([
    {
      transactionNumber: "2025040300000001",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 1000,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Pares",
      selectedPair: "12-34",
      status: "Active",
    },
    {
      transactionNumber: "2025040300000002",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2000,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer2",
      selectedPair: "56-78",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000003",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 1500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer3",
      selectedPair: "90-12",
      status: "Active",
    },
    {
      transactionNumber: "2025040300000004",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000005",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000006",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000007",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000008",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000009",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000010",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000011",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000012",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000013",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000014",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000015",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      tumbok: 0,
      sahod: 0,
      ramble: 0,
      gameType: "STL Swer4",
      selectedPair: "34-56",
      status: "Void",
    },
  ]);
  
  const fetchTransactionsData = async () => {
    let response = await fetchTransactions();

    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }

    if (params.gameCategoryId && params.gameCategoryId > 0) {
      response.data = response.data.filter(
        (item: { GameCategoryId: number }) =>
          item.GameCategoryId === params.gameCategoryId
      );
    }

    const formattedData: Transactions[] = response.data.map((transaction: any) => {
      return {
        transactionNumber: transaction.TransactionNumber,
        date: transaction.DateOfTransaction,
        drawTime:
          transaction.DrawOrder == 1
            ? "First Draw"
            : transaction.DrawOrder == 2
              ? "Second Draw"
              : "Third Draw",
        betAmount: transaction.BetAmount,
        tumbok: transaction.Tumbok,
        sahod: transaction.Sahod,
        ramble: transaction.Ramble,
        gameType: transaction.GameCategory,
        selectedPair: `${transaction.CombinationOne}-${transaction.CombinationTwo}${transaction.CombinationThree > 0 ? `-${transaction.CombinationThree}` : ""}${transaction.CombinationFour > 0 ? `-${transaction.CombinationFour}` : ""}`,
        status: transaction.TransactionStatus,
      };
    });

    setTransactions(formattedData);
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const formatDate = (dateString: string) => {
    // Create a new Date object
    const date = new Date(dateString);

    // Format the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Create the formatted date string
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  // Render table
  return (
      <DetailedTable
        source="users" 
        data={[]} 
        columns={[]}      
      />
  );
};

export default TableBettingSummary;
