import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import axios from "axios";

// Icons from @mui/icons-material
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const colors = {
  primary: "#003535",
  onPrimary: "#ffffff",
  primaryContainer: "#0d4d4d",
  background: "#f8f9ff",
  onSurfaceVariant: "#404848",
  outlineVariant: "#bfc8c8",
};

const typography = {
  labelSm: {
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "16px"
  }
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useAuthState(auth);
  const [mongoUser, setMongoUser] = useState(null);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3001/books/uid/${user.uid}`)
        .then((res) => {
          setMongoUser(res.data);
        })
        .catch((err) => {
          console.error("Footer check failed:", err);
        });
    } else {
      setMongoUser(null);
    }
  }, [user]);

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
  const isFinanceActive = location.pathname === "/showUserPublic";
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
          justifyContent: "space-around",
          px: 2,
          zIndex: 1100
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
            color: isHomeActive ? colors.primary : colors.onSurfaceVariant,
            width: 60,
            py: 0.5
          }}
        >
          <DashboardRoundedIcon sx={{ fontSize: "24px" }} />
          <Typography sx={{ ...typography.labelSm, fontSize: "8px", fontWeight: "700", textTransform: "uppercase", mt: 0.5 }}>
            Home
          </Typography>
        </ButtonBase>

        {/* Finance/Donors Tab */}
        <ButtonBase
          onClick={() => navigate("/showUserPublic")}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: isFinanceActive ? colors.primary : colors.onSurfaceVariant,
            width: 60,
            py: 0.5
          }}
        >
          <PaymentsRoundedIcon sx={{ fontSize: "24px" }} />
          <Typography sx={{ ...typography.labelSm, fontSize: "8px", fontWeight: "700", textTransform: "uppercase", mt: 0.5 }}>
            Finance
          </Typography>
        </ButtonBase>

        {/* Floating Center Action Button (quick shortcut to donate) */}
        <Box sx={{ position: "relative", top: -16, p: "4px", bgcolor: colors.background, borderRadius: "50%" }}>
          <IconButton 
            onClick={() => navigate("/donation")}
            sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: colors.primary, 
              color: "white", 
              boxShadow: "0 10px 15px -3px rgba(0, 53, 53, 0.3)",
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
            color: colors.onSurfaceVariant,
            width: 60,
            py: 0.5
          }}
        >
          <ScheduleRoundedIcon sx={{ fontSize: "24px" }} />
          <Typography sx={{ ...typography.labelSm, fontSize: "8px", fontWeight: "700", textTransform: "uppercase", mt: 0.5 }}>
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
            color: isProfileActive ? colors.primary : colors.onSurfaceVariant,
            width: 60,
            py: 0.5
          }}
        >
          <PersonRoundedIcon sx={{ fontSize: "24px" }} />
          <Typography sx={{ ...typography.labelSm, fontSize: "8px", fontWeight: "700", textTransform: "uppercase", mt: 0.5 }}>
            Profile
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
};

export default Footer;
