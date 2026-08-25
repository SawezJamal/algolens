import { Box, Chip, Divider, Stack, Typography } from "@mui/material";

function ProblemPanel({ problem }) {
    if (!problem) {
        return (
            <Typography color="text.secondary">
                Problem not found.
            </Typography>
        );
    }

    return (
        <Box>
            <Stack
                direction="row"
                spacing={0.5}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 1.5 }}
            >
                {(problem.categories || []).map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Stack>

            <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 2 }}
            >
                {problem.title}
            </Typography>

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
                sx={{ fontWeight: 600, mb: 1 }}
            >
                Example
            </Typography>

            {(problem.examples || []).map((example, index) => (
                <Box
                    key={index}
                    sx={{
                        backgroundColor: "#0b1120",
                        borderRadius: 2,
                        p: 2,
                        mb: 1.5,
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