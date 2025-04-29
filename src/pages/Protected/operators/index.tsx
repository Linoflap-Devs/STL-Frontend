import { Box, Typography} from "@mui/material"
import CardsOperatorsPage from "~/components/operators/OperatorsCards"
import ChartOperatorsSummary from "~/components/operators/OperatorsSummary"
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
          </Box>
      </Box>
    )
}

export default OperatorPage