// import { useRouter } from 'next/router';
// import React, { useEffect, useState } from 'react';
import BettingSummaryPage from '../index';
// import getTransactionsData from '~/utils/api/transactions/get.TransactionsData.service';

const DynamicBettingSummary = () => {
  // const router = useRouter();
  // Extract Dynamic param
  // const { gameCategory } = router.query;
  // const gameCategory = router.query.gameCategory as string | undefined;
 // Extract category from URL

  return <BettingSummaryPage />;
};

export default DynamicBettingSummary;
