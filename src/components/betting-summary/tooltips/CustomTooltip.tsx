import { Box, Typography } from "@mui/material";

interface ToolTipProps {
  GameTime?: string; //First, Second, Third Draw
  // GameCategory?: string; //STL Pares, Swer2, Swer3, etc.
  BettingBreakdown: {
    Bettors?: number;
    Bets?: number;
  }
  STLBreakdown?: {
    Pares?: number;
    Swer2?: number;
    Swer3?: number;
    Swer4?: number;
  };
  BettorsBreakdown?: {
    Date1?: number;
    Date2?: number;
  };
  BetsBreakdown?: {
    Date1?: number;
    Date2: number;
  };
  TumbokBreakdown?: {
    Date1?: number;
    Date2?: number;
  };
  SahodBreakdown?: {
    Date1?: number;
    Date2?: number;
  };
  RegionsBreakdown?: {
    Region1?: string; // Ilocos Region
    Region2?: string; // Cagayan Valley
    Region3?: string; // Central Luzon
    Region4A?: string; // CALABARZON
    Region4B?: string; // MIMAROPA
    Region5?: string; // Bicol Region
    Region6?: string; // Western Visayas
    Region7?: string; // Central Visayas
    Region8?: string; // Eastern Visayas
    Region9?: string; // Zamboanga Peninsula
    Region10?: string; // Northern Mindanao
    Region11?: string; // Davao Region
    Region12?: string; // SOCCSKSARGEN
    Region13?: string; // Caraga
    BARMM?: string; // Bangsamoro Autonomous Region in Muslim Mindanao
    CAR?: string; // Cordillera Administrative Region
    NCR?: string; // National Capital Region
  };
  
}

const toolTip = ({GameTime, BettingBreakdown, STLBreakdown, BettorsBreakdown, BetsBreakdown, TumbokBreakdown, SahodBreakdown, RegionsBreakdown} : ToolTipProps) => {
  // handle cases where data is 0 / undefined
  // ?? Nullish Coalescing Operator
  // provides values when lefthand side is null or undefined
  const bettors = BettingBreakdown?.Bettors ?? 0;
  const bets = BettingBreakdown?.Bets ?? 0;
  const ratio = bets > 0 ? (bettors / bets).toFixed(2) : 0;

  const Pares = STLBreakdown?.Pares ?? 0;
  const Swer2 = STLBreakdown?.Swer2 ?? 0;
  const Swer3 = STLBreakdown?.Swer3 ?? 0;
  const Swer4 = STLBreakdown?.Swer4 ?? 0;

  const Date1Bettors = BettorsBreakdown?.Date1 ?? 0;
  const Date2Bettors = BettorsBreakdown?.Date2 ?? 0;

  const Date1Bets = BetsBreakdown?.Date1 ?? 0;
  const Date2Bets = BetsBreakdown?.Date2 ?? 0;

  const Date1Tumbok = TumbokBreakdown?.Date1 ?? 0;
  const Date2Tumbok = TumbokBreakdown?.Date2 ?? 0; 

  const Date1Sahod = SahodBreakdown?.Date1 ?? 0;
  const Date2Sahod = SahodBreakdown?.Date2 ?? 0;

  const Region = RegionsBreakdown?? "Region 1"; // Default to "Region 1" if undefined

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        color: "#FFFFFF",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        fontSize: "14px",
        lineHeight: "20px",
      }}
    > 
      {/* /betting-summary */}
      {/* Today's Bettors and Total Bets */}
      {GameTime && BettingBreakdown && (
        <>
          <Typography
            sx={{ fontWeight: 700, fontSize: "16px", marginBottom: "5px" }}
          >
            {GameTime}
          </Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
          <Typography>Bettors: {bettors.toLocaleString()}</Typography>
          <Typography>Bets: ₱ {bets.toLocaleString()}</Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
          <Typography>Ratio of Bettors to Bets is 1:{ratio}</Typography>
        </>
      )}

      {/* /betting-summary */}
      {/* Today's Bettor Count by Game Type */}
      {GameTime && STLBreakdown && (
        <>
          <Typography
            sx={{ fontWeight: 700, fontSize: "16px", marginBottom: "5px" }}
          >
            {GameTime}
          </Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
          <Typography>STL Pares: {Pares.toLocaleString()}</Typography>
          <Typography>STL Swer2: {Swer2.toLocaleString()}</Typography>
          <Typography>STL Swer3: {Swer3.toLocaleString()}</Typography>
          <Typography>STL Swer4: {Swer4.toLocaleString()}</Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
        </>
      )}

      {/* /bet-comparison */}
      {/* Summary of Total Bettors and Bets */}
      {GameTime && BettorsBreakdown && BetsBreakdown && (
        <>
          <Typography
            sx={{ fontWeight: 700, fontSize: "16px", marginBottom: "5px" }}
          >
            {GameTime}
          </Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
          <Typography>Bettors: {Date1Bettors.toLocaleString()}</Typography>
          <Typography>Bettors: {Date2Bettors.toLocaleString()}</Typography>
          <Typography>Bets: ₱ {Date1Bets.toLocaleString()}</Typography>
          <Typography>Bets: ₱ {Date2Bets.toLocaleString()}</Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
        </>
      )}

      {/* /bet-comparison */}
      {/* Regional Summary of Total Bettors and Bets */}
      {RegionsBreakdown && BettorsBreakdown && BetsBreakdown && (
        <>
          <Typography
            sx={{ fontWeight: 700, fontSize: "16px", marginBottom: "5px" }}
          >
            {Region}
          </Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
          <Typography>Bettors: {Date1Bettors.toLocaleString()}</Typography>
          <Typography>Bettors: {Date2Bettors.toLocaleString()}</Typography>
          <Typography>Bets: ₱ {Date1Bets.toLocaleString()}</Typography>
          <Typography>Bets: ₱ {Date2Bets.toLocaleString()}</Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
        </>
      )}

      {/* /bet-comparison */}
      {/* Summary of Total Bettors by Bet Type */}
      {GameTime && TumbokBreakdown && SahodBreakdown && (
        <>
          <Typography
            sx={{ fontWeight: 700, fontSize: "16px", marginBottom: "5px" }}
          >
            {GameTime}
          </Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
          <Typography>Tumbok: {Date1Tumbok.toLocaleString()}</Typography>
          <Typography>Tumbok: {Date2Tumbok.toLocaleString()}</Typography>
          <Typography>Sahod: ₱ {Date1Sahod.toLocaleString()}</Typography>
          <Typography>Sahod: ₱ {Date2Sahod.toLocaleString()}</Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
        </>
      )}

      {/* /bet-comparison */}
      {/* Summary of Total Bettors by Bet Type */}
      {Region && TumbokBreakdown && SahodBreakdown && (
        <>
          <Typography
            sx={{ fontWeight: 700, fontSize: "16px", marginBottom: "5px" }}
          >
            {Region}
          </Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
          <Typography>Tumbok: {Date1Tumbok.toLocaleString()}</Typography>
          <Typography>Tumbok: {Date2Tumbok.toLocaleString()}</Typography>
          <Typography>Sahod: ₱ {Date1Sahod.toLocaleString()}</Typography>
          <Typography>Sahod: ₱ {Date2Sahod.toLocaleString()}</Typography>
          <Box sx={{ borderBottom: "1px solid #FFFFFF", margin: "5px 0" }} />
        </>
      )}
    </Box>
  );
};

export default toolTip;