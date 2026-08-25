import { useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

function getWorstComplexity(findings) {
    if (!findings || findings.length === 0) {
        return "O(n)";
    }

    const complexityRank = {
        "O(1)": 1,
        "O(log n)": 2,
        "O(n)": 3,
        "O(n log n)": 4,
        "O(n²)": 5,
        "O(n² log n)": 6,
    };

    return findings.reduce((worst, finding) => {
        const currentRank =
            complexityRank[finding.timeComplexity] || 0;

        const worstRank =
            complexityRank[worst] || 0;

        return currentRank > worstRank
            ? finding.timeComplexity
            : worst;
    }, "O(1)");
}

function AnalysisPanel({ analysis, onFindingClick }) {
    const [selectedOptimization, setSelectedOptimization] = useState(null);
    const issueCount = analysis?.findings?.length || 0;
const worstComplexity = getWorstComplexity(analysis?.findings);
    
    if (!analysis) {
        return null;
    }

    if (!analysis.detected) {
        return (
            <Paper
                sx={{
                    p: 3,
                    mt: 3,
                    backgroundColor: "background.paper",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 2 }}
                >
                    Code Analysis
                </Typography>

                <Chip
                    label="No Major Inefficiency"
                    color="success"
                    size="small"
                    sx={{ mb: 2 }}
                />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {analysis.explanation}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                >
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#0b1120",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Time Complexity
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                mt: 0.5,
                            }}
                        >
                            {analysis.timeComplexity}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#0b1120",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Space Complexity
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                mt: 0.5,
                            }}
                        >
                            {analysis.spaceComplexity}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                p: 3,
                mt: 3,
                backgroundColor: "background.paper",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                }}
            >
                Code Analysis
            </Typography>

            <Chip
                label={`${analysis.findings.length} issue${analysis.findings.length > 1 ? "s" : ""
                    } detected`}
                color="warning"
                size="small"
                sx={{ mb: 3 }}
            />

            <Box
    sx={{
        mb: 3,
        p: 2,
        borderRadius: 2,
        backgroundColor: "rgba(59, 130, 246, 0.05)",
        border: "1px solid rgba(59, 130, 246, 0.15)",
    }}
>
    <Typography
        variant="subtitle1"
        sx={{
            fontWeight: 700,
            mb: 2,
        }}
    >
        Analysis Summary
    </Typography>

    <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
    >
        <Box sx={{ flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                Issues Found
            </Typography>

            <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
            >
                {issueCount}
            </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                Worst Time Complexity
            </Typography>

            <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
            >
                {worstComplexity}
            </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                Optimization Opportunities
            </Typography>

            <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
            >
                {issueCount}
            </Typography>
        </Box>
    </Stack>
</Box>

            {analysis.findings.map((finding, index) => (
                <Box key={index}>
                    <Box
                        onClick={() => onFindingClick?.(finding)}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "rgba(239, 68, 68, 0.05)",
                            border: "1px solid",
                            borderColor: "rgba(239, 68, 68, 0.2)",
                            cursor: "pointer",
                            transition: "0.2s",

                            "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700 }}
                        >
                            {index + 1}. {finding.pattern}
                        </Typography>

                        {finding.startLine && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 0.5,
                                    color: "warning.main",
                                    fontWeight: 600,
                                }}
                            >
                                Lines {finding.startLine}–
                                {finding.endLine}
                            </Typography>
                        )}

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mt: 1,
                            }}
                        >
                            Click to view in code
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 2, mb: 2 }}
                        >
                            <Chip
                                label={`Time: ${finding.timeComplexity}`}
                                size="small"
                                color="error"
                            />

                            <Chip
                                label={`Space: ${finding.spaceComplexity}`}
                                size="small"
                            />
                        </Stack>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                        >
                            {finding.explanation}
                        </Typography>

                        <Typography
                            variant="subtitle2"
                            sx={{
                                mt: 2,
                                fontWeight: 700,
                            }}
                        >
                            Recommended Approach
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.5,
                                color: "primary.main",
                            }}
                        >
                            {finding.recommendation}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                fontWeight: 600,
                            }}
                        >
                            Expected Complexity:{" "}
                            {finding.optimizedComplexity}
                        </Typography>

                        {finding.optimizedCode && (
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{ mt: 3 }}
                                onClick={() => setSelectedOptimization(finding)}
                            >
                                View Optimized Code
                            </Button>
                        )}
                    </Box>

                    {index < analysis.findings.length - 1 && (
                        <Divider sx={{ my: 2 }} />
                    )}
                </Box>
            ))}
            <Dialog
                open={Boolean(selectedOptimization)}
                onClose={() => setSelectedOptimization(null)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Optimized Solution
                </DialogTitle>

                <DialogContent>
                    {selectedOptimization && (
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Recommended approach:{" "}
                                <strong>
                                    {selectedOptimization.recommendation}
                                </strong>
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, fontWeight: 700 }}
                            >
                                Optimized Code
                            </Typography>

                            <Box
                                component="pre"
                                sx={{
                                    p: 2,
                                    m: 0,
                                    borderRadius: 2,
                                    backgroundColor: "#0b1120",
                                    overflowX: "auto",
                                    fontFamily: "monospace",
                                    fontSize: "0.85rem",
                                    lineHeight: 1.6,
                                }}
                            >
                                {selectedOptimization.optimizedCode}
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 2,
                                    fontWeight: 600,
                                }}
                            >
                                Expected Complexity:{" "}
                                {selectedOptimization.optimizedComplexity}
                            </Typography>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                selectedOptimization.optimizedCode
                            );
                        }}
                    >
                        Copy Code
                    </Button>

                    <Button
                        onClick={() => setSelectedOptimization(null)}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default AnalysisPanel;