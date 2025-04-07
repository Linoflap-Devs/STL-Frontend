import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import BettingSummaryPage from '../index';
import getTransactionsData from '~/utils/api/transactions/get.TransactionsData.service';

const DynamicBettingSummary = () => {
  const router = useRouter();
  // Extradct Dynamic param
  const { gameCategory } = router.query;
  // const gameCategory = router.query.gameCategory as string | undefined;
 // Extract category from URL

  useEffect(()=>{
    console.log("Router Ready:", router.isReady);
    console.log("Query Params:", router.query);
  },[router.isReady, router.query])

  interface TransactionsData {
    TransactionId: number;
    TransactionNumber: string;
    Name: string;
    CombinationOne: number;
    CombinationTwo: number;
    BetAmount: number;
    GameCategoryId: number;
    GameCategory: string;
    GameTypeId: number;
    GameType: string;
    DrawOrder: number;
    BetTypeId: number;
    BetType: string;
    RegionId: number;
    Region: string;
    ProvinceId: number;
    Province: string;
    City: string;
    UserId: number;
    Collector: string;
    DateOfTransaction: string; // ISO date string
  }
  interface HistoricalRegionData {
    TransactionDate: string; // ISO 8601 date string
    RegionId: number;
    Region: string;
    RegionFull: string;
    TotalBets: number;
    TotalBettors: number;
    TotalWinners: number;
    TotalBetAmount: number;
    TotalPayout: number;
    TotalEarnings: number;
  }
  interface TransactionResponse {
    success: boolean;
    message?: string;
    data: TransactionsData[] | null;
  }

  const [historicalData, setHistoricalData] = useState<HistoricalRegionData[] | null>(null);
  const [transactionsData, setTransactionsData] = useState<TransactionsData[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Map lowercase URL category to API GameCategory format
  const getGameCategory = (category: string | string[] | undefined): string | null => {
    if (!category || typeof category !== 'string') return null;

    const categoryMap: Record<string, string> = {
      'stl-pares': 'STL Pares',
      'stl-swer2': 'STL Swert2',
      'stl-swer3': 'STL Swert3',
      'stl-swer4': 'STL Swert4',
      'dashboard': '' // Show all transactions if dashboard
    };
    // STL Pares etc.
    return categoryMap[category] || null;
  };

  useEffect(() => {
    if (!router.isReady || !gameCategory) return;
    // if undefined, ensure the dynamic route is set uop correctly.
    console.log("gameCategory:", gameCategory)

    const fetchTransactionsData = async () => {
      setLoading(true);
        try {
          const game_category = getGameCategory(gameCategory);
          console.log("Fetching data for category:", gameCategory);

          const [historicalResponse, transactionsResponse] = await Promise.all([
            getTransactionsData('/transactions/getHistoricalRegion'),
            getTransactionsData<TransactionsData>('/transactions/getTransactions', game_category ? { GameCategory: game_category } : {})
          ]);

          console.log(`Historical Response: `, historicalResponse)
          console.log(`Transactions Response: `, transactionsResponse)

          if (historicalResponse.success) {
            setHistoricalData(historicalResponse.data as HistoricalRegionData[]);
            console.log(`Get Historical Region: ${historicalResponse.data}`)
          }
          if (transactionsResponse.success) {
            const responseData = transactionsResponse.data;
            setTransactionsData(responseData ? (Array.isArray(responseData) ? responseData : [responseData]) : null)
            console.log(`Get Transactions Data: ${responseData}`)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
    };

    fetchTransactionsData();
  }, [router.isReady, gameCategory]); // Ensure re-run when router is ready

  if (loading) return <p>Loading...</p>;

  return <BettingSummaryPage GameCategory={gameCategory as string} />;
};

export default DynamicBettingSummary;
