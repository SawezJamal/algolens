import { Box, Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

function MLAnalysisCard({
    mlAnalysis,
    aiRecommendation,
}) {
    if (!mlAnalysis) {
        return null;
    }

    const needsOptimization =
        mlAnalysis.prediction === "Needs Optimization";

    return (
        <>
            {/* ML Analysis */}
            <Paper
                sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: needsOptimization
                        ? "warning.main"
                        : "success.main",
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
                    🤖 ML Efficiency Analysis
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Prediction
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: needsOptimization
                                    ? "warning.main"
                                    : "success.main",
                            }}
                        >
                            {mlAnalysis.prediction}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Confidence
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {mlAnalysis.confidence}%
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    The machine learning model evaluates code
                    characteristics and predicts whether the
                    current implementation may require optimization.
                </Typography>
            </Paper>

            {/* AI Recommendation */}
            {aiRecommendation && (
                <Paper
                    sx={{
                        mt: 3,
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "info.main",
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
                        💡 AI Optimization Recommendation
                    </Typography>

                    <Box
    sx={{
        lineHeight: 1.7,

        "& p": {
            marginTop: 0,
            marginBottom: 2,
        },

        "& ul": {
            paddingLeft: 3,
            marginTop: 1,
            marginBottom: 2,
        },

        "& li": {
            marginBottom: 0.5,
        },

        "& strong": {
            fontWeight: 700,
        },

        "& code": {
            backgroundColor: "action.hover",
            px: 0.6,
            py: 0.2,
            borderRadius: 1,
            fontFamily: "monospace",
        },
    }}
>
    <ReactMarkdown>
        {aiRecommendation}
    </ReactMarkdown>
</Box>
                </Paper>
            )}
        </>
    );
}

export default MLAnalysisCard;