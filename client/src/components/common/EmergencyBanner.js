import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";

const EmergencyBanner = ({
  alertId = "default_alert_rain_2026", // Change this ID to show a new alert if details change
  title = "Operational Update: Temporary Rain Guidelines",
  message = "Heavy rain expected during prayer times. Please bring your own prayer mats as we will be using the indoor praying area only. Maintain order and assist elders.",
  severity = "warning", // warning, critical, info
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if this specific alert has been dismissed by the user
    const isDismissed = localStorage.getItem(`emergency_alert_dismissed_${alertId}`);
    if (!isDismissed) {
      setVisible(true);
    }
  }, [alertId]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(`emergency_alert_dismissed_${alertId}`, "true");
  };

  // Define gradients and icons based on severity
  const getBannerStyles = () => {
    switch (severity) {
      case "critical":
        return {
          background: "linear-gradient(135deg, #E03131 0%, #2B0D3D 100%)", // Midnight Crimson (Deep Red to Dark Violet)
          boxShadow: "0 8px 24px rgba(224, 49, 49, 0.2)",
        };
      case "info":
        return {
          background: "linear-gradient(135deg, #0CA678 0%, #1098AD 100%)", // Ocean Spruce (Teal to Blue-Green)
          boxShadow: "0 8px 24px rgba(12, 166, 120, 0.2)",
        };
      case "warning":
      default:
        return {
          background: "linear-gradient(135deg, #862E9C 0%, #E64980 100%)", // Plum Alert (Deep Purple to Coral Rose)
          boxShadow: "0 8px 24px rgba(134, 46, 156, 0.2)",
        };
    }
  };

  const styles = getBannerStyles();

  return (
    <Collapse in={visible}>
      <Card
        sx={{
          background: styles.background,
          color: "#fff",
          borderRadius: "5px",
          boxShadow: styles.boxShadow,
          mb: 3, // Margin bottom to space it from elements below
          p: { xs: 2, sm: 2.5 },
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <Box display="flex" alignItems="flex-start" gap={2} sx={{ pr: 4 }}>
          <WarningAmberIcon
            sx={{
              fontSize: { xs: "28px", sm: "32px" },
              color: "#fff",
              mt: 0.2,
              animation: "pulse 2s infinite ease-in-out",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
          <Box flex={1}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: "700",
                letterSpacing: "0.5px",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: { xs: "12px", sm: "13.5px" },
                fontWeight: "500",
                opacity: 0.95,
                lineHeight: 1.4,
              }}
            >
              {message}
            </Typography>
          </Box>
        </Box>

        {/* Dismiss Button */}
        <IconButton
          onClick={handleDismiss}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Card>
    </Collapse>
  );
};

export default EmergencyBanner;
