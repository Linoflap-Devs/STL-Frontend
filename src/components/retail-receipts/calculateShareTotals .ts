// src/utils/calculateShareTotals.ts

export interface AACShare {
  ShareTitle: string;
  ShareType: number;
  Percentage: number;
  ShareAmount: number;
  OperationDate: number;
  OperatorBreakdown?: Record<string, number>; // Add this
}

export interface PCSOShare {
  ShareAmount: number;
  Percentage: number;
  ShareType: number;
  ShareTitle: string;
  OperationDate: number;
  OperatorBreakdown?: Record<string, number>; // Add this
}

/**
 * Calculate total Percentage and ShareAmount
 * Filters by ShareType === 1 and matching ShareTitle
 * 
 * @param aacShares - Array of AACShare objects
 * @param title - ShareTitle string to filter on
 * @returns totals object with totalPercentage and totalShareAmount
 */
export function calculateShareTotals(
  aacShares: AACShare[],
  titles: string[],  // accept array now
  year: number,
  month: number
) {
  const filtered = aacShares.filter((share) => {
    if (share.ShareType !== 1 || !titles.includes(share.ShareTitle)) return false;

    if (!share.OperationDate) return false;

    const date = new Date(share.OperationDate);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });

  return {
    totalPercentage: filtered.reduce((sum, item) => sum + item.Percentage, 0),
    totalShareAmount: filtered.reduce((sum, item) => sum + item.ShareAmount, 0),
  };
}

// function for gross acc and pcso share
export function processAuthorizedAgentShares(data: any, year: number, month: number) {
  const shareTitlesToInclude = [
    "Authorized Agent Share",
    "Commission of Salesforce",
    "Net Prize fund",
  ];

  const aacData = data?.data?.Receipts?.AAC;
  if (!aacData) {
    console.warn("AAC data not found");
    return {
      totalPercentage: 0,
      totalShareAmount: 0,
      breakdown: [],
    };
  }

  const aacSharesArray: AACShare[] = shareTitlesToInclude
    .map((title) => {
      const share = aacData[title];
      if (share && share.ShareType === 1) {
        return {
          ShareTitle: title,
          ShareType: share.ShareType as number,
          Percentage: share.Percentage as number,
          ShareAmount: share.ShareAmount as number,
          OperationDate: new Date(year, month - 1, 1).getTime(),
          OperatorBreakdown: share.OperatorBreakdown ?? {},
        };
      }
      return null;
    })
    .filter(Boolean) as AACShare[];

  const totalPercentage = aacSharesArray.reduce((acc, curr) => acc + curr.Percentage, 0);
  const totalShareAmount = aacSharesArray.reduce((acc, curr) => acc + curr.ShareAmount, 0);

  return {
    totalPercentage,
    totalShareAmount,
    breakdown: aacSharesArray,
  };
}