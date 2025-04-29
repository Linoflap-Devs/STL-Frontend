import { Box, Typography} from "@mui/material"
import CardsOperatorsPage from "~/components/operators/OperatorsCards"
import ChartOperatorsSummary from "~/components/operators/OperatorsSummary"
import TableOperatorsSummary from "~/components/operators/OperatorsSummaryTable"

const OperatorPage = () => {
    return (
      <Box>
          <Typography sx={{ fontWeight: 700 }} variant="h4">
            Small Town Lottery Operators
          </Typography>

          <Box>
            <CardsOperatorsPage/>
          </Box>

          <Box 
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
              width: "100%",
              mt: 2,
            }}
          >
            <ChartOperatorsSummary/>
            <TableOperatorsSummary/>
              <Box
                sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <button
                    style={{
                      backgroundColor: "#67ABEB",
                      color: "#000",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "400",
                      cursor: "pointer",
                      width: "150px",
                    }}
                  >
                    Export as CSV
                  </button>
              </Box>
          </Box>
      </Box>
    )
}

export default OperatorPage