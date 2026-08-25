import { Box, Chip, Divider, Typography } from "@mui/material";

function ProblemPanel({ problem }) {
    if (!problem) {
        return null;
    }

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <Chip
                    label={problem.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1.5 }}
                />

                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700 }}
                >
                    {problem.title}
                </Typography>
            </Box>

            <Typography
                variant="body1"
                sx={{
                    color: "text.secondary",
                    lineHeight: 1.7,
                    mb: 2,
                }}
            >
                {problem.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 600,
                    mb: 1,
                }}
            >
                Example
            </Typography>

            {problem.examples?.map((example, index) => (
                <Box
                    key={index}
                    sx={{
                        backgroundColor: "#0b1120",
                        borderRadius: 2,
                        p: 2,
                        mb: 1,
                        fontFamily: "monospace",
                        color: "text.secondary",
                    }}
                >
                    <div>
                        Input: {example.input}
                    </div>

                    <div>
                        Output: {example.output}
                    </div>
                </Box>
            ))}

            <Typography
                variant="body2"
                sx={{
                    color: "text.secondary",
                    mt: 2,
                }}
            >
                Try to solve this problem using an efficient approach.
            </Typography>
        </Box>
    );
}

export default ProblemPanel;