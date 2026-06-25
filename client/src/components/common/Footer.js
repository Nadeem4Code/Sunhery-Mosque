import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import UserContext from "../../context/BooksContext";

// Icons from @mui/icons-material
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const colors = {
  primary: "#672CBC",
  onPrimary: "#ffffff",
  primaryContainer: "#240F4F",
  background: "#f8f9ff",
  onSurfaceVariant: "#8789A3",
  outlineVariant: "#e9ecef",
};

const typography = {
  labelSm: {
    fontFamily: "Inter, sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: "16px"
  }
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, mongoUser } = useContext(UserContext);

  let targetLink = "/login";
  if (user && mongoUser) {
    if (mongoUser.role === "admin") {
      targetLink = "/dashboard";
    } else {
      targetLink = `/user/${mongoUser.id}`;
    }
  }

  // Determine active states for the tabs
  const isHomeActive = location.pathname === "/";
  const isDonorsActive = location.pathname === "/showUserPublic";
  const isProfileActive = location.pathname === targetLink || location.pathname.startsWith("/user/");

  return (
    <Box sx={{ pb: { xs: 8, lg: 0 } }}>
      <CssBaseline />

      {/* Responsive Bottom Navigation Bar */}
      <Box
        component="nav"
        sx={{
          display: { xs: "flex", lg: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          bgcolor: "#ffffff",
          borderTop: `1px solid ${colors.outlineVariant}`,
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          zIndex: 1100,
          boxShadow: "0 -2px 10px rgba(103, 44, 188, 0.03)"
        }}
      >
        {/* Home Tab */}
        <ButtonBase
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            py: 0.5
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isHomeActive ? "rgba(103, 44, 188, 0.08)" : "transparent",
              borderRadius: "16px",
              width: "48px",
              height: "32px",
              mb: "4px",
              transition: "background-color 0.2s ease"
            }}
          >
            <DashboardRoundedIcon sx={{ fontSize: "22px", color: isHomeActive ? "#672CBC" : "#8789A3" }} />
          </Box>
          <Typography sx={{ ...typography.labelSm, fontSize: "8.5px", fontWeight: "700", textTransform: "uppercase", color: isHomeActive ? "#672CBC" : "#8789A3" }}>
            Home
          </Typography>
        </ButtonBase>

        {/* Donors Tab */}
        <ButtonBase
          onClick={() => navigate("/showUserPublic")}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            py: 0.5
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDonorsActive ? "rgba(103, 44, 188, 0.08)" : "transparent",
              borderRadius: "16px",
              width: "48px",
              height: "32px",
              mb: "4px",
              transition: "background-color 0.2s ease"
            }}
          >
            <PeopleRoundedIcon sx={{ fontSize: "22px", color: isDonorsActive ? "#672CBC" : "#8789A3" }} />
          </Box>
          <Typography sx={{ ...typography.labelSm, fontSize: "8.5px", fontWeight: "700", textTransform: "uppercase", color: isDonorsActive ? "#672CBC" : "#8789A3" }}>
            Donors
          </Typography>
        </ButtonBase>

        {/* Floating Center Action Button (quick shortcut to donate) */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 64, position: "relative", top: -16, p: "4px", bgcolor: colors.background, borderRadius: "50%" }}>
          <IconButton 
            onClick={() => navigate("/donation")}
            sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: colors.primary, 
              color: "white", 
              boxShadow: "0 4px 10px rgba(103, 44, 188, 0.2)",
              border: `4px solid ${colors.background}`,
              "&:hover": { bgcolor: colors.primaryContainer }
            }}
          >
            <AddRoundedIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>

        {/* Prayers Tab */}
        <ButtonBase
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            py: 0.5
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "transparent",
              borderRadius: "16px",
              width: "48px",
              height: "32px",
              mb: "4px",
            }}
          >
            <ScheduleRoundedIcon sx={{ fontSize: "22px", color: "#8789A3" }} />
          </Box>
          <Typography sx={{ ...typography.labelSm, fontSize: "8.5px", fontWeight: "700", textTransform: "uppercase", color: "#8789A3" }}>
            Prayers
          </Typography>
        </ButtonBase>

        {/* Profile Tab */}
        <ButtonBase
          onClick={() => navigate(targetLink)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            py: 0.5
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isProfileActive ? "rgba(103, 44, 188, 0.08)" : "transparent",
              borderRadius: "16px",
              width: "48px",
              height: "32px",
              mb: "4px",
              transition: "background-color 0.2s ease"
            }}
          >
            <PersonRoundedIcon sx={{ fontSize: "22px", color: isProfileActive ? "#672CBC" : "#8789A3" }} />
          </Box>
          <Typography sx={{ ...typography.labelSm, fontSize: "8.5px", fontWeight: "700", textTransform: "uppercase", color: isProfileActive ? "#672CBC" : "#8789A3" }}>
            Profile
          </Typography>
        </ButtonBase>
      </Box>

      {/* Desktop & Scrollable Footer Content */}
      <Box
        sx={{
          py: 4,
          px: 2,
          mt: 8,
          bgcolor: "#ffffff",
          borderTop: `1px solid ${colors.outlineVariant}`,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.8,
          mb: { xs: 8, lg: 0 } // Clear fixed bottom navigation on mobile
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12.5px",
            fontWeight: "500",
            color: "#8789A3",
            letterSpacing: "0.5px"
          }}
        >
          Created By
          <Box
            component="span"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "18px",
              fontWeight: "800",
              color: "black",
              ml: 0.5,
              verticalAlign: "middle"
            }}
          >
            Mohd. Nadeem
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
