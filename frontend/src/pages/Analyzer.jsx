import { useState } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";

import ProblemPanel from "../components/ProblemPanel";
import CodeEditor from "../components/CodeEditor";
import AnalysisPanel from "../components/AnalysisPanel";

function Analyzer() {
    const [selectedFinding, setSelectedFinding] = useState(null);
    const handleFindingClick = (finding) => {
        setSelectedFinding(finding);
    };
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [code, setCode] = useState(`#include <bits/stdc++.h>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] == nums[j]) {
                return true;
            }
        }
    }

    return false;
}`);

    const [analysis, setAnalysis] = useState(null);

    const handleAnalyze = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze code");
            }

            const result = await response.json();

            setAnalysis(result);
        } catch (error) {
            console.error("Analysis error:", error);
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("");

        try {
            const response = await fetch("http://localhost:5000/api/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    input,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setOutput(result.output);
            } else {
                setOutput(result.output || "Execution failed.");
            }
        } catch (error) {
            console.error("Execution error:", error);
            setOutput("Could not connect to execution server.");
        } finally {
            setIsRunning(false);
        }
    };

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
                    Smart Code Optimization Analyzer
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    Analyze your DSA solution and discover opportunities to improve
                    its efficiency.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{
                            p: 3,
                            backgroundColor: "background.paper",
                        }}
                    >
                        <ProblemPanel />
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        sx={{
                            p: 3,
                            backgroundColor: "background.paper",
                        }}
                    >
                        <CodeEditor
                            code={code}
                            onCodeChange={setCode}
                            onAnalyze={handleAnalyze}
                            onRun={handleRun}
                            input={input}
                            onInputChange={setInput}
                            output={output}
                            isRunning={isRunning}
                            analysis={analysis}
                            selectedFinding={selectedFinding}
                        />
                    </Paper>

                    {analysis && <AnalysisPanel
                        analysis={analysis}
                        onFindingClick={handleFindingClick}
                    />}
                </Grid>
            </Grid>
        </Container>
    );
}

export default Analyzer;