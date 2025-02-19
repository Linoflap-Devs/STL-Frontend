import { useEffect, useState } from "react";
import fetchHistoricalSummary from "~/utils/api/transactions";

const HistoricalSummary = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = {  };
                const response = await fetchHistoricalSummary(queryParams);

                if (response.success) {
                    setData(response.data);
                } else {
                    setError(response.message || "Failed to fetch data.");
                }
            } catch (err) {
                setError("An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Small Town Lottery Betting Summary</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    );
};

export default HistoricalSummary;
