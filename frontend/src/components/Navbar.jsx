import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function Navbar() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, md: 6 } }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.5px",
            flexGrow: 1,
          }}
        >
          AlgoLens
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit">
            Problems
          </Button>

          <Button color="inherit">
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;