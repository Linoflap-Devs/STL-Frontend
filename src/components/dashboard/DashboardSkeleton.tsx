import { Box, Grid } from "@mui/material";
import { cardDashboardStyles } from "~/styles/theme";

interface SkeletonCardProps {
    height?: string | number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = "110px" }) => (
    <Box
        sx={{
            ...cardDashboardStyles,
            flex: "1 1 200px",
            height: height,
            backgroundColor: "#171717",
            borderRadius: "8px",
            margin: 0,
        }}
    />
);

export default function DashboardSkeleton() {
    return (
        <Box className="animate-pulse space-y-4">
            <Box sx={{ height: "1.2rem", backgroundColor: "#171717", borderRadius: "8px", width: "20%" }}></Box>
            <Box sx={{ height: "1.2rem", backgroundColor: "#171717", borderRadius: "8px", width: "20%" }}></Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    mt: 2,
                }}
            >
                {[...Array(5)].map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <SkeletonCard height="200px" />
                            <SkeletonCard height="200px" />
                            <SkeletonCard height="200px" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                            <SkeletonCard height="305px" />
                            <SkeletonCard height="305px" />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
