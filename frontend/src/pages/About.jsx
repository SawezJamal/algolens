import React from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Chip,
    Grid,
} from "@mui/material";

function About() {
    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 68px)",
                py: { xs: 5, md: 8 },
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ mb: 5 }}>
                    <Chip
                        label="ABOUT ALGOLENS"
                        size="small"
                        sx={{
                            mb: 2,
                            color: "#67e8f9",
                            background:
                                "rgba(34, 211, 238, 0.08)",
                            border:
                                "1px solid rgba(34, 211, 238, 0.20)",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            letterSpacing: "0.08em",
                        }}
                    />

                    <Typography
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: "2rem",
                                md: "2.8rem",
                            },
                            fontWeight: 750,
                            letterSpacing:
                                "-0.035em",
                            color: "#f8fafc",
                            mb: 1.5,
                        }}
                    >
                        Smarter code.
                        <br />
                        Better algorithms.
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 700,
                            color: "#94a3b8",
                            fontSize: "1rem",
                            lineHeight: 1.8,
                        }}
                    >
                        AlgoLens is a smart code
                        optimization analyzer designed
                        to help developers understand
                        algorithmic efficiency and
                        discover better approaches to
                        solving DSA problems.
                    </Typography>
                </Box>

                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: "100%",
                                borderRadius: "14px",
                                background:
                                    "rgba(25, 34, 51, 0.78)",
                                border:
                                    "1px solid rgba(148, 163, 184, 0.10)",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#22d3ee",
                                    fontSize:
                                        "0.75rem",
                                    fontWeight: 750,
                                    letterSpacing:
                                        "0.08em",
                                    textTransform:
                                        "uppercase",
                                    mb: 1.5,
                                }}
                            >
                                Static Analysis
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#cbd5e1",
                                    lineHeight: 1.7,
                                    fontSize:
                                        "0.92rem",
                                }}
                            >
                                Detects common
                                inefficient
                                algorithmic patterns
                                such as nested loops,
                                redundant traversal,
                                repeated searches,
                                and other optimization
                                opportunities.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: "100%",
                                borderRadius: "14px",
                                background:
                                    "rgba(25, 34, 51, 0.78)",
                                border:
                                    "1px solid rgba(148, 163, 184, 0.10)",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#818cf8",
                                    fontSize:
                                        "0.75rem",
                                    fontWeight: 750,
                                    letterSpacing:
                                        "0.08em",
                                    textTransform:
                                        "uppercase",
                                    mb: 1.5,
                                }}
                            >
                                ML Prediction
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#cbd5e1",
                                    lineHeight: 1.7,
                                    fontSize:
                                        "0.92rem",
                                }}
                            >
                                Uses a machine-learning
                                model to provide an
                                additional efficiency
                                prediction based on
                                extracted code
                                characteristics.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: "100%",
                                borderRadius: "14px",
                                background:
                                    "rgba(25, 34, 51, 0.78)",
                                border:
                                    "1px solid rgba(148, 163, 184, 0.10)",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#c084fc",
                                    fontSize:
                                        "0.75rem",
                                    fontWeight: 750,
                                    letterSpacing:
                                        "0.08em",
                                    textTransform:
                                        "uppercase",
                                    mb: 1.5,
                                }}
                            >
                                AI Recommendations
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#cbd5e1",
                                    lineHeight: 1.7,
                                    fontSize:
                                        "0.92rem",
                                }}
                            >
                                Generates concise,
                                context-aware
                                optimization
                                recommendations explaining
                                why an approach can be
                                improved and what complexity
                                can be achieved.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper
                    elevation={0}
                    sx={{
                        mt: 2.5,
                        p: {
                            xs: 3,
                            md: 4,
                        },
                        borderRadius: "14px",
                        background:
                            "rgba(25, 34, 51, 0.55)",
                        border:
                            "1px solid rgba(148, 163, 184, 0.08)",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "#f8fafc",
                            mb: 1,
                        }}
                    >
                        How AlgoLens works
                    </Typography>

                    <Typography
                        sx={{
                            color: "#94a3b8",
                            lineHeight: 1.8,
                            fontSize: "0.92rem",
                        }}
                    >
                        Submit a C++ DSA solution and
                        AlgoLens analyzes the code,
                        identifies supported algorithmic
                        patterns, evaluates efficiency
                        characteristics, and generates an
                        optimization recommendation.
                        Solutions can also be executed
                        against predefined test cases to
                        verify correctness.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

export default About;