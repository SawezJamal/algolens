import { Box, Chip, Divider, Typography } from "@mui/material";

function ProblemPanel() {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Chip
          label="Arrays"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mb: 1.5 }}
        />

        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Contains Duplicate
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
        Given an integer array nums, return true if any value appears at
        least twice in the array, and return false if every element is
        distinct.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Example
      </Typography>

      <Box
        sx={{
          backgroundColor: "#0b1120",
          borderRadius: 2,
          p: 2,
          fontFamily: "monospace",
          color: "text.secondary",
        }}
      >
        <div>Input: nums = [1, 2, 3, 1]</div>
        <div>Output: true</div>
      </Box>

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