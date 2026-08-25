import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Chip,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

function History() {
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/analyses"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch history");
                }

                const data = await response.json();

                setAnalyses(data);
            } catch (error) {
                console.error("History error:", error);
                setError("Failed to load analysis history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 5 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 1,
                }}
            >
                Analysis History
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                View your previous code analyses.
            </Typography>

            {loading && (
                <Typography color="text.secondary">
                    Loading history...
                </Typography>
            )}

            {error && (
                <Typography color="error">
                    {error}
                </Typography>
            )}

            {!loading && !error && analyses.length === 0 && (
                <Paper sx={{ p: 4 }}>
                    <Typography>
                        No analysis history yet.
                    </Typography>
                </Paper>
            )}

            <Stack spacing={2}>
                {analyses.map((analysis) => (
                    <Paper
                        key={analysis._id}
                        onClick={() => navigate(`/analyzer/${analysis._id}`)}
                        sx={{
                            p: 3,
                            backgroundColor: "background.paper",
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                backgroundColor: "rgba(59, 130, 246, 0.08)",
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700 }}
                                >
                                    {analysis.findings?.length
                                        ? analysis.findings[0].pattern
                                        : "No Major Inefficiency"}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    {new Date(
                                        analysis.createdAt
                                    ).toLocaleString()}
                                </Typography>
                            </Box>

                            <Chip
                                label={
                                    analysis.detected
                                        ? `${analysis.findings.length} issue${analysis.findings.length !== 1
                                            ? "s"
                                            : ""
                                        }`
                                        : "No issues"
                                }
                                color={
                                    analysis.detected
                                        ? "warning"
                                        : "success"
                                }
                                size="small"
                            />
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        </Container>
    );
}

export default History;