import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Chip,
    Button,
} from "@mui/material";

import { Link } from "react-router-dom";

import ProblemPanel from "../components/ProblemPanel";
import CodeEditor from "../components/CodeEditor";
import AnalysisPanel from "../components/AnalysisPanel";
import MLAnalysisCard from "../components/MLAnalysisCard";

function Analyzer() {
    const [searchParams] = useSearchParams();
    const problemId = searchParams.get("problem");

    const { id } = useParams();

    const [selectedProblem, setSelectedProblem] =
        useState(null);

    const [selectedFinding, setSelectedFinding] =
        useState(null);

    const handleFindingClick = (finding) => {
        setSelectedFinding(finding);
    };

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [testResults, setTestResults] =
        useState(null);

    const [isRunning, setIsRunning] =
        useState(false);

    const [executionStatus, setExecutionStatus] =
        useState(null);

    const [code, setCode] = useState("");

    const [analysis, setAnalysis] =
        useState(null);

    const handleAnalyze = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/analyze",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({ code }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to analyze code"
                );
            }

            const result =
                await response.json();

            setAnalysis(result);
        } catch (error) {
            console.error(
                "Analysis error:",
                error
            );
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("");
        setExecutionStatus(null);
        setTestResults(null);

        try {
            const response = await fetch(
                "http://localhost:5000/api/run",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        input,
                        problemId,
                    }),
                }
            );

            const result =
                await response.json();

            setExecutionStatus(result.type);
            setTestResults(
                result.testResults || null
            );

            if (result.success) {
                setOutput(result.output);
            } else {
                setOutput(
                    result.output ||
                    "Execution failed."
                );
            }
        } catch (error) {
            console.error(
                "Execution error:",
                error
            );

            setExecutionStatus("connection");

            setOutput(
                "Could not connect to execution server."
            );
        } finally {
            setIsRunning(false);
        }
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadAnalysis = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/analyses/${id}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load analysis"
                    );
                }

                const savedAnalysis =
                    await response.json();

                setCode(savedAnalysis.code);

                setAnalysis({
                    detected:
                        savedAnalysis.detected,
                    findings:
                        savedAnalysis.findings,
                    timeComplexity:
                        savedAnalysis.timeComplexity,
                    spaceComplexity:
                        savedAnalysis.spaceComplexity,
                    mlAnalysis:
                        savedAnalysis.mlAnalysis,
                    aiRecommendation:
                        savedAnalysis.aiRecommendation,
                });
            } catch (error) {
                console.error(
                    "Failed to load saved analysis:",
                    error
                );
            }
        };

        loadAnalysis();
    }, [id]);

    useEffect(() => {
        if (!problemId || id) {
            return;
        }

        const loadProblem = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/problems/${problemId}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load problem"
                    );
                }

                const problem =
                    await response.json();

                setSelectedProblem(problem);
                setCode(problem.starterCode);
                setAnalysis(null);
                setSelectedFinding(null);
            } catch (error) {
                console.error(
                    "Failed to load problem:",
                    error
                );
            }
        };

        loadProblem();
    }, [problemId, id]);

    return (
        <Box
            sx={{
                minHeight:
                    "calc(100vh - 68px)",
                pb: 8,
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    pt: {
                        xs: 4,
                        md: 5,
                    },
                }}
            >
                {/* Header */}

                <Box
                    sx={{
                        mb: 4,
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 1.5,
                            mb: 1.3,
                        }}
                    >
                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: "2rem",
                                    md: "2.55rem",
                                },
                                lineHeight: 1.15,
                                fontWeight: 750,
                                letterSpacing:
                                    "-0.035em",
                                color: "#f8fafc",
                            }}
                        >
                            Smart Code
                            Optimization
                            Analyzer
                        </Typography>

                        <Chip
                            label="BETA"
                            size="small"
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "flex",
                                },
                                mt: 0.5,
                                height: 24,
                                fontSize:
                                    "0.65rem",
                                fontWeight: 750,
                                letterSpacing:
                                    "0.08em",
                                color: "#67e8f9",
                                background:
                                    "rgba(34, 211, 238, 0.08)",
                                border:
                                    "1px solid rgba(34, 211, 238, 0.20)",
                            }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            maxWidth: 720,
                            color: "#94a3b8",
                            fontSize: {
                                xs: "0.92rem",
                                md: "1rem",
                            },
                            lineHeight: 1.7,
                        }}
                    >
                        Analyze your DSA solution,
                        identify inefficiencies,
                        and discover smarter
                        approaches.
                    </Typography>
                </Box>

                {/* Main workspace */}

                <Grid
                    container
                    spacing={2.5}
                    alignItems="flex-start"
                >
                    {/* Problem */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                            lg: 3.7,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 0,
                                overflow:
                                    "hidden",
                                borderRadius:
                                    "14px",
                                background:
                                    "rgba(25, 34, 51, 0.78)",
                                border:
                                    "1px solid rgba(148, 163, 184, 0.10)",
                                boxShadow:
                                    "0 18px 50px rgba(0, 0, 0, 0.16)",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 2.5,
                                    py: 1.8,
                                    borderBottom:
                                        "1px solid rgba(148, 163, 184, 0.09)",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.78rem",
                                        fontWeight:
                                            750,
                                        letterSpacing:
                                            "0.08em",
                                        textTransform:
                                            "uppercase",
                                        color:
                                            "#cbd5e1",
                                    }}
                                >
                                    Problem
                                </Typography>

                                {selectedProblem ? (
                                    <Chip
                                        label="Selected"
                                        size="small"
                                        sx={{
                                            height: 22,
                                            color: "#86efac",
                                            background:
                                                "rgba(34, 197, 94, 0.08)",
                                            border:
                                                "1px solid rgba(34, 197, 94, 0.15)",
                                            fontSize: "0.62rem",
                                            fontWeight: 700,
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        sx={{
                                            fontSize: "0.65rem",
                                            color: "#64748b",
                                            fontWeight: 600,
                                        }}
                                    >
                                        None selected
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ p: 2.5 }}>
                                {selectedProblem ? (
                                    <ProblemPanel
                                        problem={selectedProblem}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            minHeight: 230,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            px: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 52,
                                                height: 52,
                                                borderRadius: "14px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mb: 2,
                                                color: "#67e8f9",
                                                background:
                                                    "rgba(34, 211, 238, 0.08)",
                                                border:
                                                    "1px solid rgba(34, 211, 238, 0.16)",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "1.35rem",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                &lt;/&gt;
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#f8fafc",
                                                mb: 0.8,
                                                fontSize: "1rem",
                                            }}
                                        >
                                            Ready to analyze?
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#64748b",
                                                fontSize: "0.82rem",
                                                lineHeight: 1.6,
                                                maxWidth: 260,
                                                mb: 2.5,
                                            }}
                                        >
                                            Select a DSA problem to load its
                                            description, constraints, and
                                            starter code.
                                        </Typography>

                                        <Button
                                            component={Link}
                                            to="/problems"
                                            variant="outlined"
                                            sx={{
                                                borderColor:
                                                    "rgba(34, 211, 238, 0.35)",
                                                color: "#67e8f9",
                                                textTransform: "none",
                                                fontWeight: 650,
                                                borderRadius: "9px",
                                                px: 2.2,

                                                "&:hover": {
                                                    borderColor: "#22d3ee",
                                                    background:
                                                        "rgba(34, 211, 238, 0.07)",
                                                },
                                            }}
                                        >
                                            Browse Problems
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Editor + Results */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 8,
                            lg: 8.3,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                overflow:
                                    "hidden",
                                borderRadius:
                                    "14px",
                                background:
                                    "rgba(25, 34, 51, 0.78)",
                                border:
                                    "1px solid rgba(148, 163, 184, 0.10)",
                                boxShadow:
                                    "0 18px 50px rgba(0, 0, 0, 0.16)",
                            }}
                        >
                            {/* Editor header */}

                            <Box
                                sx={{
                                    px: 2.5,
                                    py: 1.8,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    borderBottom:
                                        "1px solid rgba(148, 163, 184, 0.09)",
                                }}
                            >
                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: 1.2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius:
                                                "50%",
                                            background:
                                                "#22d3ee",
                                            boxShadow:
                                                "0 0 12px rgba(34, 211, 238, 0.5)",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "0.78rem",
                                            fontWeight:
                                                750,
                                            letterSpacing:
                                                "0.08em",
                                            textTransform:
                                                "uppercase",
                                            color:
                                                "#cbd5e1",
                                        }}
                                    >
                                        Code
                                    </Typography>
                                </Box>

                                <Chip
                                    label="C++"
                                    size="small"
                                    sx={{
                                        height: 25,
                                        color:
                                            "#94a3b8",
                                        background:
                                            "rgba(15, 23, 42, 0.75)",
                                        border:
                                            "1px solid rgba(148, 163, 184, 0.12)",
                                        fontSize:
                                            "0.68rem",
                                        fontWeight:
                                            700,
                                    }}
                                />
                            </Box>

                            <Box
    sx={{
        p: {
            xs: 1.2,
            md: 2,
        },
    }}
>
    {selectedProblem ? (
        <CodeEditor
            code={code}
            onCodeChange={setCode}
            onAnalyze={handleAnalyze}
            onRun={handleRun}
            input={input}
            onInputChange={setInput}
            output={output}
            executionStatus={executionStatus}
            testResults={testResults}
            isRunning={isRunning}
            analysis={analysis}
            selectedFinding={selectedFinding}
        />
    ) : (
        <Box
            sx={{
                height: 410,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                borderRadius: "10px",
                background: "#0b1120",
                border:
                    "1px solid rgba(148, 163, 184, 0.08)",
            }}
        >
            <Box
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    color: "#67e8f9",
                    background:
                        "rgba(34, 211, 238, 0.08)",
                    border:
                        "1px solid rgba(34, 211, 238, 0.16)",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                    }}
                >
                    &lt;/&gt;
                </Typography>
            </Box>

            <Typography
                sx={{
                    color: "#e2e8f0",
                    fontWeight: 700,
                    fontSize: "1rem",
                    mb: 0.8,
                }}
            >
                Select a problem to begin
            </Typography>

            <Typography
                sx={{
                    color: "#64748b",
                    fontSize: "0.82rem",
                    maxWidth: 360,
                    lineHeight: 1.6,
                }}
            >
                Choose a DSA problem from the
                Problems section to load its
                starter code and test cases.
            </Typography>
        </Box>
    )}
</Box>
                        </Paper>

                        {/* Analysis results */}

                        {analysis && (
                            <Box
                                sx={{
                                    mt: 2.5,
                                }}
                            >
                                <AnalysisPanel
                                    analysis={
                                        analysis
                                    }
                                    onFindingClick={
                                        handleFindingClick
                                    }

                                />

                                <Box
                                    sx={{
                                        mt: 2.5,
                                    }}
                                >
                                    <MLAnalysisCard
                                        mlAnalysis={
                                            analysis.mlAnalysis
                                        }
                                        aiRecommendation={
                                            analysis.aiRecommendation
                                        }
                                    />
                                </Box>
                            </Box>
                        )}
                    </Grid>
                </Grid>

                {/* Footer */}

                <Box
                    sx={{
                        mt: 6,
                        pt: 2.5,
                        borderTop:
                            "1px solid rgba(148, 163, 184, 0.07)",
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize:
                                "0.72rem",
                            color:
                                "#64748b",
                        }}
                    >
                        AlgoLens · Smart DSA
                        Code Analysis
                    </Typography>

                    <Typography
                        sx={{
                            fontSize:
                                "0.72rem",
                            color:
                                "#475569",
                        }}
                    >
                        Static Analysis · ML
                        Prediction · AI
                        Recommendation
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Analyzer;