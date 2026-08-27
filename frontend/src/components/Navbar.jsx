import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

function AlgoLensLogo() {
    return (
        <Box
            component={Link}
            to="/"
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                textDecoration: "none",
                color: "inherit",
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    background:
                        "linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)",
                    boxShadow:
                        "0 8px 24px rgba(34, 211, 238, 0.18)",
                    overflow: "hidden",
                }}
            >
                <svg
                    width="27"
                    height="27"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9 8L5 8V24H9"
                        stroke="white"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M17 11L13 16L17 21"
                        stroke="white"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M23 18.5C26.0376 18.5 28.5 16.0376 28.5 13C28.5 9.96243 26.0376 7.5 23 7.5C19.9624 7.5 17.5 9.96243 17.5 13C17.5 16.0376 19.9624 18.5 23 18.5Z"
                        stroke="white"
                        strokeWidth="2.2"
                    />

                    <path
                        d="M26.5 17L30 20.5"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </svg>
            </Box>

            <Typography
                sx={{
                    fontSize: "1.15rem",
                    fontWeight: 750,
                    letterSpacing: "-0.02em",
                }}
            >
                AlgoLens
            </Typography>
        </Box>
    );
}

function Navbar() {
    const location = useLocation();

    const navItems = [
        {
            label: "Analyzer",
            path: "/",
        },
        {
            label: "History",
            path: "/history",
        },
        {
            label: "Problems",
            path: "/problems",
        },
    ];

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background:
                    "rgba(11, 17, 32, 0.88)",
                backdropFilter: "blur(14px)",
                borderBottom:
                    "1px solid rgba(148, 163, 184, 0.10)",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: "68px !important",
                    px: {
                        xs: 2,
                        md: 5,
                        lg: 7,
                    },
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <AlgoLensLogo />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: {
                            xs: 0.5,
                            md: 1,
                        },
                    }}
                >
                    {navItems.map((item) => {
                        const isActive =
                            item.path === "/"
                                ? location.pathname === "/" ||
                                  location.pathname.startsWith(
                                      "/analyzer"
                                  )
                                : location.pathname.startsWith(
                                      item.path
                                  );

                        return (
                            <Button
                                key={item.label}
                                component={Link}
                                to={item.path}
                                sx={{
                                    position: "relative",
                                    px: {
                                        xs: 1.2,
                                        md: 1.7,
                                    },
                                    py: 1,
                                    color: isActive
                                        ? "#f8fafc"
                                        : "#94a3b8",
                                    fontSize: "0.78rem",
                                    fontWeight: 650,
                                    letterSpacing:
                                        "0.03em",
                                    textTransform:
                                        "uppercase",
                                    borderRadius: "9px",

                                    "&:hover": {
                                        background:
                                            "rgba(148, 163, 184, 0.08)",
                                        color: "#f8fafc",
                                    },

                                    "&::after": isActive
                                        ? {
                                              content:
                                                  '""',
                                              position:
                                                  "absolute",
                                              left: "18%",
                                              right: "18%",
                                              bottom: 3,
                                              height: 2,
                                              borderRadius:
                                                  2,
                                              background:
                                                  "#22d3ee",
                                          }
                                        : {},
                                }}
                            >
                                {item.label}
                            </Button>
                        );
                    })}

                    <Button
    component={Link}
    to="/about"
    sx={{
        ml: 0.5,
        px: 1.7,
        py: 1,
        color:
            location.pathname.startsWith("/about")
                ? "#f8fafc"
                : "#94a3b8",
        fontSize: "0.78rem",
        fontWeight: 650,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        borderRadius: "9px",

        "&:hover": {
            background:
                "rgba(148, 163, 184, 0.08)",
            color: "#f8fafc",
        },
    }}
>
    About
</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;