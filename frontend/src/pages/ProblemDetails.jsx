import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function ProblemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/problems/${id}`
                );

                if (!response.ok) {
                    throw new Error("Problem not found");
                }

                const data = await response.json();

                setProblem(data);
            } catch (error) {
                console.error(
                    "Failed to fetch problem:",
                    error
                );

                setError("Problem not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Typography>
                    Loading problem...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Typography color="error">
                    {error}
                </Typography>

                <Button
                    onClick={() => navigate("/problems")}
                    sx={{ mt: 2 }}
                >
                    Back to Problems
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Button
                onClick={() => navigate("/problems")}
                sx={{ mb: 3 }}
            >
                ← Back to Problems
            </Button>

            <Paper
                sx={{
                    p: { xs: 3, md: 5 },
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ mb: 2 }}
                >
                    <Chip
                        label={problem.difficulty}
                        color={
                            problem.difficulty === "Easy"
                                ? "success"
                                : problem.difficulty === "Medium"
                                    ? "warning"
                                    : "error"
                        }
                    />

                    <Chip
                        label={problem.category}
                        variant="outlined"
                    />
                </Stack>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                    }}
                >
                    {problem.title}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.8,
                        mb: 4,
                    }}
                >
                    {problem.description}
                </Typography>

                {problem.examples?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                            }}
                        >
                            Examples
                        </Typography>

                        <Stack spacing={2}>
                            {problem.examples.map(
                                (example, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "rgba(148, 163, 184, 0.06)",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily:
                                                    "monospace",
                                                mb: 1,
                                            }}
                                        >
                                            Input:{" "}
                                            {example.input}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily:
                                                    "monospace",
                                            }}
                                        >
                                            Output:{" "}
                                            {example.output}
                                        </Typography>
                                    </Box>
                                )
                            )}
                        </Stack>
                    </Box>
                )}

                {problem.constraints?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            Constraints
                        </Typography>

                        <Box component="ul" sx={{ pl: 3 }}>
                            {problem.constraints.map(
                                (constraint, index) => (
                                    <Typography
                                        component="li"
                                        key={index}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {constraint}
                                    </Typography>
                                )
                            )}
                        </Box>
                    </Box>
                )}

                <Box
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor:
                            "rgba(148, 163, 184, 0.06)",
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        Expected Complexity
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Time:{" "}
                        {problem.expectedTimeComplexity ||
                            "Not specified"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Space:{" "}
                        {problem.expectedSpaceComplexity ||
                            "Not specified"}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() =>
                        navigate(
                            `/analyzer?problem=${problem.slug}`
                        )
                    }
                >
                    Analyze Your Solution
                </Button>
            </Paper>
        </Container>
    );
}

export default ProblemDetails;