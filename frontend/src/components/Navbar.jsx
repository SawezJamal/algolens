import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, md: 6 } }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.5px",
            flexGrow: 1,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          AlgoLens
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
          >
            Analyzer
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/history"
          >
            History
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/problems"
          >
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