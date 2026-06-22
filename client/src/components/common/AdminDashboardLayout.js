import React, { useState, useEffect, Suspense } from "react";
import { 
  Box, 
  Drawer, 
  IconButton, 
  Typography, 
  Tooltip, 
  Avatar, 
  Menu, 
  MenuItem, 
  ButtonBase,
  CircularProgress,
  Grid,
  Card,
  Skeleton
} from "@mui/material";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../../config/firebase";
import axios from "axios";

// Icons from @mui/icons-material
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

// Dialog Components
import AddUser from "../../pages/admin/AddUser";
import AddAdmin from "../../pages/admin/AddAdmin";
import AddExpenditure from "../../pages/admin/AddExpenditure";

// Brand Logo
import logo from "../../assets/icons/logo.svg";

const colors = {
  primary: "#003535",
  onPrimary: "#ffffff",
  primaryContainer: "#0d4d4d",
  onPrimaryContainer: "#85bdbc",
  primaryFixed: "#b4edec",
  primaryFixedDim: "#98d1d0",
  onPrimaryFixed: "#002020",
  onPrimaryFixedVariant: "#104f4f",
  
  secondary: "#006c49",
  onSecondary: "#ffffff",
  secondaryContainer: "#6cf8bb",
  onSecondaryContainer: "#00714d",
  secondaryFixed: "#6ffbbe",
  secondaryFixedDim: "#4edea3",
  onSecondaryFixed: "#002113",
  onSecondaryFixedVariant: "#005236",
  
  tertiary: "#26312c",
  onTertiary: "#ffffff",
  tertiaryContainer: "#3c4842",
  onTertiaryContainer: "#a9b6ae",
  tertiaryFixed: "#d9e6dd",
  tertiaryFixedDim: "#bdcac1",
  onTertiaryFixed: "#131e19",
  onTertiaryFixedVariant: "#3e4943",
  
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  
  background: "#f8f9ff",
  onBackground: "#0b1c30",
  
  surface: "#f8f9ff",
  onSurface: "#0b1c30",
  surfaceBright: "#f8f9ff",
  surfaceDim: "#cbdbf5",
  surfaceVariant: "#d3e4fe",
  onSurfaceVariant: "#404848",
  
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eff4ff",
  surfaceContainer: "#e5eeff",
  surfaceContainerHigh: "#dce9ff",
  surfaceContainerHighest: "#d3e4fe",
  
  outline: "#707978",
  outlineVariant: "#bfc8c8",
  inverseSurface: "#213145",
  inverseOnSurface: "#eaf1ff",
  inversePrimary: "#98d1d0",
};

const typography = {
  displayLg: {
    fontFamily: "Hanken Grotesk, sans-serif",
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: "56px",
    letterSpacing: "-0.02em"
  },
  headlineLg: {
    fontFamily: "Hanken Grotesk, sans-serif",
    fontSize: "32px",
    fontWeight: 600,
    lineHeight: "40px"
  },
  headlineMd: {
    fontFamily: "Hanken Grotesk, sans-serif",
    fontSize: "24px",
    fontWeight: 600,
    lineHeight: "32px"
  },
  bodyLg: {
    fontFamily: "Inter, sans-serif",
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "28px"
  },
  bodyMd: {
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px"
  },
  labelMd: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    letterSpacing: "0.01em"
  },
  labelSm: {
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "16px"
  }
};

const DashboardSkeleton = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Welcome Header Row Skeleton */}
      <Box sx={{ mb: 5, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 2.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%", maxWidth: 400 }}>
          <Skeleton variant="text" width="40%" height={20} sx={{ borderRadius: "4px" }} />
          <Skeleton variant="text" width="80%" height={48} sx={{ borderRadius: "8px" }} />
        </Box>
        <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" } }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: "8px" }} />
          <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: "8px" }} />
        </Box>
      </Box>

      {/* 4 Stat Summary Cards Grid Skeleton */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "12px", p: 3, position: "relative", overflow: "hidden" }}>
              <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: colors.outlineVariant }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="text" width="35%" height={20} />
              </Box>
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={40} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Columns Skeleton */}
      <Grid container spacing={4}>
        {/* Left Column Skeleton */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 5 }}>
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2, borderRadius: "4px" }} />
            <Box 
              sx={{ 
                display: "grid", 
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" }, 
                gap: "16px" 
              }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "12px", p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
                  <Skeleton variant="circular" width={28} height={28} sx={{ mb: 1.5 }} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Card>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right Column Skeleton */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Card sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "16px", p: 3, minHeight: 320 }}>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="45%" height={16} />
                  </Box>
                </Box>
              ))}
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const AdminDashboardLayout = () => {
  const [user, loading] = useAuthState(auth);
  const [mongoUser, setMongoUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  
  // Hoisted Dialog Open States
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [addExpenditureOpen, setAddExpenditureOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Listen to custom DOM events for opening dialogs globally
  useEffect(() => {
    const handleOpenAddUser = () => setAddUserOpen(true);
    const handleOpenAddAdmin = () => setAddAdminOpen(true);
    const handleOpenAddExpenditure = () => setAddExpenditureOpen(true);

    window.addEventListener("open-add-user", handleOpenAddUser);
    window.addEventListener("open-add-admin", handleOpenAddAdmin);
    window.addEventListener("open-add-expenditure", handleOpenAddExpenditure);

    return () => {
      window.removeEventListener("open-add-user", handleOpenAddUser);
      window.removeEventListener("open-add-admin", handleOpenAddAdmin);
      window.removeEventListener("open-add-expenditure", handleOpenAddExpenditure);
    };
  }, []);

  // Load custom fonts on mount
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hanken+Grotesk:wght@600;700;800&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    
    return () => {
      try {
        document.head.removeChild(fontLink);
      } catch (e) {}
    };
  }, []);

  // Sync mongoUser role info
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem("mongoUser");
      if (saved) {
        try {
          setMongoUser(JSON.parse(saved));
        } catch (e) {}
      }
      axios.get(`http://localhost:3001/books/uid/${user.uid}`)
        .then((res) => {
          setMongoUser(res.data);
          localStorage.setItem("mongoUser", JSON.stringify(res.data));
        })
        .catch((err) => console.error("Layout role check failed:", err));
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    logout();
    navigate("/login");
  };

  const handleNotImplemented = (featureName) => {
    alert(`${featureName} feature is coming soon!`);
  };

  const getHeaderTitle = (pathname) => {
    if (pathname === "/dashboard") return "Admin Portal";
    if (pathname === "/showUserForMosqueAdmin") return "Mosque Finance";
    if (pathname === "/showUserForImamAdmin") return "Imam Directory";
    if (pathname === "/showUser") return "Donors Directory";
    if (pathname.startsWith("/addAmountForImam")) return "Log Imam Payments";
    if (pathname.startsWith("/addAmount")) return "Log Mosque Donation";
    if (pathname === "/addUser") return "Register Donor";
    return "Admin Portal";
  };

  const getAdminInitial = () => {
    if (mongoUser && mongoUser.userName) {
      return mongoUser.userName.charAt(0).toUpperCase();
    }
    if (user) {
      if (user.email) {
        return user.email.charAt(0).toUpperCase();
      }
      if (user.phoneNumber) {
        return user.phoneNumber.charAt(0).toUpperCase();
      }
    }
    return "A";
  };

  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardRoundedIcon sx={{ fontSize: "20px" }} /> },
    { text: "Finance", path: "/showUserForMosqueAdmin", icon: <PaymentsRoundedIcon sx={{ fontSize: "20px" }} /> },
    { text: "Donors", path: "/showUser", icon: <GroupRoundedIcon sx={{ fontSize: "20px" }} /> },
    { text: "Imams", path: "/showUserForImamAdmin", icon: <ManageAccountsRoundedIcon sx={{ fontSize: "20px" }} /> },
    { text: "Prayer Times", path: "#prayer", icon: <ScheduleRoundedIcon sx={{ fontSize: "20px" }} />, notImpl: "Prayer Times" },
    { text: "Events", path: "#events", icon: <EventRoundedIcon sx={{ fontSize: "20px" }} />, notImpl: "Events" },
    { text: "Inventory", path: "#inventory", icon: <Inventory2RoundedIcon sx={{ fontSize: "20px" }} />, notImpl: "Inventory" },
  ];

  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", py: 3, px: 2 }}>
      {/* Brand Header */}
      <Box sx={{ mb: 5, px: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <ButtonBase onClick={() => navigate("/")} sx={{ display: "flex", alignItems: "center", gap: 1.5, textAlign: "left", borderRadius: 1 }}>
          <Avatar sx={{ bgcolor: colors.primary, width: 40, height: 40, borderRadius: "8px", p: 0.5 }}>
            <img src={logo} style={{ width: "24px", height: "24px", filter: "invert(1)" }} alt="Mosque Brand Logo" />
          </Avatar>
          <Box>
            <Typography sx={{ ...typography.headlineMd, color: colors.primary, lineHeight: 1.2 }}>
              Al-Noor Admin
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: colors.onSurfaceVariant }}>
              Mosque Management
            </Typography>
          </Box>
        </ButtonBase>
        <IconButton onClick={handleDrawerToggle} sx={{ display: { lg: "none" }, color: colors.primary }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Main Navigation Links */}
      <Box component="nav" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ButtonBase 
              key={item.text}
              onClick={() => {
                setMobileOpen(false);
                if (item.notImpl) {
                  handleNotImplemented(item.notImpl);
                } else {
                  navigate(item.path);
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                py: 1.5,
                px: 2,
                borderRadius: "8px",
                bgcolor: isActive ? colors.secondaryContainer : "transparent",
                color: isActive ? colors.onSecondaryContainer : colors.onSurfaceVariant,
                justifyContent: "flex-start",
                transition: "all 0.2s ease-in-out",
                "&:hover": { bgcolor: isActive ? colors.secondaryContainer : colors.surfaceContainerHigh }
              }}
            >
              {item.icon}
              <Typography sx={{ ...typography.bodyMd, fontWeight: isActive ? 600 : 500 }}>{item.text}</Typography>
            </ButtonBase>
          );
        })}
      </Box>

      {/* Footer Navigation Links */}
      <Box sx={{ pt: 3, borderTop: `1px solid ${colors.outlineVariant}`, display: "flex", flexDirection: "column", gap: 1 }}>
        <ButtonBase 
          onClick={() => { setMobileOpen(false); handleNotImplemented("Settings"); }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            py: 1.5,
            px: 2,
            borderRadius: "8px",
            color: colors.onSurfaceVariant,
            justifyContent: "flex-start",
            transition: "all 0.2s ease-in-out",
            "&:hover": { bgcolor: colors.surfaceContainerHigh }
          }}
        >
          <SettingsRoundedIcon sx={{ fontSize: "20px" }} />
          <Typography sx={{ ...typography.bodyMd, fontWeight: 500 }}>Settings</Typography>
        </ButtonBase>

        <ButtonBase 
          onClick={() => { setMobileOpen(false); handleNotImplemented("Support"); }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            py: 1.5,
            px: 2,
            borderRadius: "8px",
            color: colors.onSurfaceVariant,
            justifyContent: "flex-start",
            transition: "all 0.2s ease-in-out",
            "&:hover": { bgcolor: colors.surfaceContainerHigh }
          }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: "20px" }} />
          <Typography sx={{ ...typography.bodyMd, fontWeight: 500 }}>Support</Typography>
        </ButtonBase>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.background }}>
        {/* Sidebar Navigation Outline */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: 256,
            flexShrink: 0,
            position: "fixed",
            height: "100vh",
            bgcolor: colors.surfaceContainerLowest,
            borderRight: `1px solid ${colors.outlineVariant}`,
            zIndex: 1000
          }}
        >
          {sidebarContent}
        </Box>

        {/* Content Container Wrapper */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, pl: { xs: 0, lg: "256px" } }}>
          {/* Top Header Outline */}
          <Box
            component="header"
            sx={{
              position: "fixed",
              top: 0,
              right: 0,
              left: { xs: 0, lg: "256px" },
              height: 64,
              bgcolor: "rgba(248, 249, 255, 0.8)",
              backdropFilter: "blur(12px)",
              borderBottom: `1px solid ${colors.outlineVariant}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: { xs: 2, md: 3 },
              zIndex: 900
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ ...typography.headlineLg, color: colors.primary, fontSize: { xs: "20px", md: "32px" } }}>
                Admin Portal
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              pt: "84px", 
              pb: 5, 
              px: { xs: 2, md: 4 }, 
              minWidth: 0 
            }}
          >
            <DashboardSkeleton />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.background }}>
      {/* 1. Sidebar Navigation (Responsive) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 256, bgcolor: colors.surfaceContainerLowest, borderRight: `1px solid ${colors.outlineVariant}` },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: 256,
          flexShrink: 0,
          position: "fixed",
          height: "100vh",
          bgcolor: colors.surfaceContainerLowest,
          borderRight: `1px solid ${colors.outlineVariant}`,
          zIndex: 1000
        }}
      >
        {sidebarContent}
      </Box>

      {/* 2. Responsive Content Container Wrapper */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, pl: { xs: 0, lg: "256px" } }}>
        {/* Top Header Navigation */}
        <Box
          component="header"
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            left: { xs: 0, lg: "256px" },
            height: 64,
            bgcolor: "rgba(248, 249, 255, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${colors.outlineVariant}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, md: 3 },
            zIndex: 900
          }}
        >
          {/* Left header portion */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 }, minWidth: 0 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ display: { lg: "none" }, color: colors.primary, p: 1, mr: 0.5 }}>
              <MenuRoundedIcon />
            </IconButton>
            <Typography noWrap sx={{ ...typography.headlineLg, color: colors.primary, fontSize: { xs: "20px", md: "32px" } }}>
              {getHeaderTitle(location.pathname)}
            </Typography>
          </Box>

          {/* Right header portion */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 3 } }}>
            {/* Sub menu links */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: { sm: 2, lg: 3 }, mr: { sm: 1, lg: 3 } }}>
              <ButtonBase sx={{ color: colors.secondary, borderBottom: `2px solid ${colors.secondary}`, pb: 0.5, fontWeight: "700", fontFamily: "Inter", fontSize: "14px" }}>
                Analytics
              </ButtonBase>
            </Box>

            {/* Admin Profile Dropdown trigger */}
            <Tooltip title="Account settings">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, border: `2px solid ${colors.secondary}`, flexShrink: 0 }}>
                <Avatar 
                  alt="Admin Profile" 
                  sx={{ 
                    width: { xs: 32, md: 40 }, 
                    height: { xs: 32, md: 40 },
                    bgcolor: colors.secondary,
                    color: "white",
                    fontFamily: "Inter",
                    fontSize: { xs: "14px", md: "18px" },
                    fontWeight: "700"
                  }}
                >
                  {getAdminInitial()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Admin Profile Context Menu */}
        <Menu
          anchorEl={anchorElProfile}
          open={Boolean(anchorElProfile)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `1px solid ${colors.outlineVariant}`,
              p: 0.5
            }
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate("/"); }} sx={{ fontFamily: "Inter", fontSize: "14px", py: 1, px: 2, borderRadius: "6px" }}>
            View Public Site
          </MenuItem>
          <MenuItem onClick={handleLogoutClick} sx={{ fontFamily: "Inter", fontSize: "14px", py: 1, px: 2, color: colors.error, borderRadius: "6px", display: "flex", alignItems: "center", gap: 1 }}>
            <ExitToAppRoundedIcon sx={{ fontSize: "18px" }} /> Sign Out
          </MenuItem>
        </Menu>

        {/* Main Content Area */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            pt: "84px", 
            pb: 5, 
            px: { xs: 2, md: 4 }, 
            minWidth: 0 
          }}
        >
          <Suspense fallback={<DashboardSkeleton />}>
            <Outlet />
          </Suspense>
        </Box>

        {/* Hoisted dialog instances */}
        <AddUser 
          open={addUserOpen} 
          onClose={() => { 
            setAddUserOpen(false); 
            window.dispatchEvent(new CustomEvent("admin-data-changed"));
          }} 
        />
        
        <AddAdmin 
          open={addAdminOpen} 
          onClose={() => {
            setAddAdminOpen(false);
            window.dispatchEvent(new CustomEvent("admin-data-changed"));
          }} 
        />
        
        <AddExpenditure 
          open={addExpenditureOpen} 
          onClose={() => { 
            setAddExpenditureOpen(false); 
            window.dispatchEvent(new CustomEvent("admin-data-changed"));
          }} 
          onAddSuccess={() => {
            window.dispatchEvent(new CustomEvent("admin-data-changed"));
          }} 
        />
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;
