import React, { useState } from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Tooltip,
  Collapse,
  Stack,
  IconButton
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Extract error details safely
  const status = error?.status || 500;
  const statusText = error?.statusText || "Internal Server Error";
  const errorMessage = error?.message || error?.error?.message || "An unexpected error occurred.";
  const errorStack = error?.stack || error?.error?.stack || "";

  const handleCopyError = () => {
    const errorText = `Error Status: ${status} (${statusText})\nMessage: ${errorMessage}\nStack: ${errorStack}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const is404 = status === 404;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f6f5fa",
        overflow: "hidden",
        px: 3,
        py: 6,
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif"
      }}
    >
      {/* Background Glows for Modern Glassmorphic Look */}
      <Box
        sx={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(144, 85, 255, 0.15) 0%, rgba(223, 152, 250, 0.03) 70%)",
          filter: "blur(60px)",
          top: "-10%",
          left: "10%",
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(103, 44, 188, 0.12) 0%, rgba(36, 15, 79, 0.02) 70%)",
          filter: "blur(70px)",
          bottom: "-15%",
          right: "5%",
          zIndex: 0
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 1, position: "relative" }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 12px 40px rgba(36, 15, 79, 0.06)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3.5
          }}
        >
          {/* Animated Error Illustration */}
          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1
            }}
          >
            {/* Pulsating background ring */}
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                bgcolor: is404 ? "rgba(144, 85, 255, 0.1)" : "rgba(255, 82, 82, 0.1)",
                "@keyframes pulse": {
                  "0%, 100%": { transform: "scale(1)", opacity: 0.6 },
                  "50%": { transform: "scale(1.25)", opacity: 0.2 }
                },
                animation: "pulse 3s infinite ease-in-out"
              }}
            />
            {/* Inner Floating Circle */}
            <Box
              sx={{
                position: "relative",
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "white",
                boxShadow: "0 8px 24px rgba(103, 44, 188, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-6px)" }
                },
                animation: "float 4s infinite ease-in-out"
              }}
            >
              <ErrorOutlineRoundedIcon
                sx={{
                  fontSize: 48,
                  color: is404 ? "#672CBC" : "#ff5252",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "rotate(10deg)"
                  }
                }}
              />
            </Box>
          </Box>

          {/* Heading */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: { xs: "24px", md: "32px" },
                color: "#240F4F",
                mb: 1
              }}
            >
              {is404 ? "Oops! Page Not Found" : "A Slight Detour"}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
                color: "#8789A3",
                fontSize: "15px",
                lineHeight: 1.6,
                maxWidth: "400px",
                margin: "0 auto"
              }}
            >
              Assalamu Alaikum. We ran into an unexpected issue while loading this page. Let's get you back on track.
            </Typography>
          </Box>

          {/* Navigation Controls */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: "100%", justifyContent: "center", mt: 1 }}
          >
            <Button
              onClick={handleGoBack}
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: "14px",
                color: "#240F4F",
                borderColor: "rgba(36, 15, 79, 0.15)",
                textTransform: "none",
                borderRadius: "12px",
                py: 1.3,
                px: 3,
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "#240F4F",
                  backgroundColor: "rgba(36, 15, 79, 0.03)"
                }
              }}
            >
              Go Back
            </Button>
            <Button
              onClick={handleGoHome}
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              sx={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: "14px",
                background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                color: "white",
                textTransform: "none",
                borderRadius: "12px",
                py: 1.3,
                px: 3.5,
                boxShadow: "0 4px 14px rgba(144, 85, 255, 0.25)",
                transition: "all 0.2s",
                "&:hover": {
                  background: "linear-gradient(135deg, #9055FF 0%, #DF98FA 100%)",
                  boxShadow: "0 6px 20px rgba(144, 85, 255, 0.35)",
                  transform: "translateY(-1px)"
                }
              }}
            >
              Go Home
            </Button>
            <Button
              onClick={handleReload}
              variant="text"
              startIcon={<RefreshRoundedIcon />}
              sx={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: "14px",
                color: "#672CBC",
                textTransform: "none",
                borderRadius: "12px",
                py: 1.3,
                px: 2,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(103, 44, 188, 0.04)"
                }
              }}
            >
              Retry
            </Button>
          </Stack>

          {/* Diagnostics Accordion */}
          <Box sx={{ width: "100%", mt: 2 }}>
            <Button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              endIcon={
                <KeyboardArrowDownRoundedIcon
                  sx={{
                    transform: showDiagnostics ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s"
                  }}
                />
              }
              sx={{
                fontFamily: "Poppins",
                fontWeight: "600",
                fontSize: "13px",
                color: "#8789A3",
                textTransform: "none",
                py: 1,
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#240F4F"
                }
              }}
            >
              {showDiagnostics ? "Hide Technical Details" : "Show Technical Details"}
            </Button>

            <Collapse in={showDiagnostics}>
              <Box
                sx={{
                  mt: 2,
                  p: 2.5,
                  borderRadius: "16px",
                  bgcolor: "#1a1235",
                  color: "#dfdbf0",
                  textAlign: "left",
                  position: "relative",
                  boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.12)"
                }}
              >
                {/* Copy Button inside Box */}
                <Tooltip title={copied ? "Copied!" : "Copy Diagnostics"} arrow placement="top">
                  <IconButton
                    onClick={handleCopyError}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      color: "#dfdbf0",
                      bgcolor: "rgba(255, 255, 255, 0.06)",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        color: "white"
                      }
                    }}
                  >
                    {copied ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>

                {/* Error Information */}
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: is404 ? "#DF98FA" : "#ff8080",
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}
                >
                  Status: {status} — {statusText}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "12.5px",
                    wordBreak: "break-all",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.5,
                    maxHeight: "180px",
                    overflowY: "auto",
                    pr: 3,
                    "&::-webkit-scrollbar": {
                      width: "6px"
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "10px"
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px"
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "rgba(255, 255, 255, 0.2)"
                    }
                  }}
                >
                  {errorMessage}
                  {errorStack && `\n\nStack Trace:\n${errorStack}`}
                </Typography>
              </Box>
            </Collapse>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ErrorPage;
