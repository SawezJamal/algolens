import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Problems() {
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");
    const [category, setCategory] = useState("All");

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/problems"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch problems");
                }

                const data = await response.json();

                setProblems(data);
            } catch (error) {
                console.error(
                    "Failed to fetch problems:",
                    error
                );

                setError("Failed to load problems.");
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const categories = [
        "All",
        ...new Set(
            problems.flatMap(
                (problem) => problem.categories || []
            )
        ),
    ];

    const filteredProblems = useMemo(() => {
        return problems.filter((problem) => {
            const matchesSearch =
                problem.title
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesDifficulty =
                difficulty === "All" ||
                problem.difficulty === difficulty;

            const matchesCategory =
                category === "All" ||
                problem.categories?.includes(category);

            return (
                matchesSearch &&
                matchesDifficulty &&
                matchesCategory
            );
        });
    }, [problems, search, difficulty, category]);

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 5 }}>
                <Typography>
                    Loading problems...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 5 }}>
                <Typography color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 5 }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    DSA Problems
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Practice algorithmic problems and analyze
                    your solutions with AlgoLens.
                </Typography>
            </Box>

            <TextField
                fullWidth
                label="Search problems"
                placeholder="Search by problem name..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                sx={{ mb: 3 }}
            />

            <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 2 }}
            >
                {["All", "Easy", "Medium", "Hard"].map(
                    (level) => (
                        <Chip
                            key={level}
                            label={level}
                            clickable
                            color={
                                difficulty === level
                                    ? "primary"
                                    : "default"
                            }
                            onClick={() =>
                                setDifficulty(level)
                            }
                        />
                    )
                )}
            </Stack>

            <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 4 }}
            >
                {categories.map((item) => (
                    <Chip
                        key={item}
                        label={item}
                        clickable
                        variant={
                            category === item
                                ? "filled"
                                : "outlined"
                        }
                        color={
                            category === item
                                ? "primary"
                                : "default"
                        }
                        onClick={() =>
                            setCategory(item)
                        }
                    />
                ))}
            </Stack>

            {filteredProblems.length === 0 ? (
                <Typography color="text.secondary">
                    No problems found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredProblems.map((problem) => (
                        <Grid
                            key={problem._id}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                            }}
                        >
                            <Card
                                onClick={() =>
                                    navigate(
                                        `/problems/${problem.slug}`
                                    )
                                }
                                sx={{
                                    height: "100%",
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    "&:hover": {
                                        transform:
                                            "translateY(-3px)",
                                    },
                                }}
                            >
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ mb: 2 }}
                                    >
                                        <Chip
                                            label={
                                                problem.difficulty
                                            }
                                            size="small"
                                            color={
                                                problem.difficulty ===
                                                    "Easy"
                                                    ? "success"
                                                    : problem.difficulty ===
                                                        "Medium"
                                                        ? "warning"
                                                        : "error"
                                            }
                                        />

                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            flexWrap="wrap"
                                            useFlexGap
                                            justifyContent="flex-end"
                                        >
                                            {(problem.categories || []).map((item) => (
                                                <Chip
                                                    key={item}
                                                    label={item}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Stack>
                                    </Stack>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                        }}
                                    >
                                        {problem.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {problem.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default Problems;