import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  CircularProgress, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  IconButton,
  Button,
  ButtonBase,
  Menu,
  Snackbar,
  Alert,
  Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import axios from "axios";

// Icons from @mui/icons-material
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";

// Dialog Components
import EditExpenditure from "./EditExpenditure";

// Custom Mockup Theme Colors matching Dahsboard.html
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

// Typography Tokens matching Dahsboard.html Tailwind config
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

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [checkingRole, setCheckingRole] = useState(true);
  const [users, setUsers] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filterYear, setFilterYear] = useState("2026"); // Defaults to 2026
  
  // Dialog Open States (Controlled)
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedExpenditure, setSelectedExpenditure] = useState(null);

  // Layout UI States
  const [anchorElNewEntry, setAnchorElNewEntry] = useState(null);

  // Toast / Feedback States
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");



  const navigate = useNavigate();

  const showToast = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchData = useCallback(() => {
    setLoadingData(true);
    const usersReq = axios.get("http://localhost:3001/books");
    const expReq = axios.get("http://localhost:3001/expenditures");

    Promise.all([usersReq, expReq])
      .then(([usersRes, expRes]) => {
        setUsers(usersRes.data);
        setExpenditures(expRes.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        showToast("Failed to reload dashboard statistics.", "error");
        setLoadingData(false);
      });
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

  // Listen for global data changed events to trigger feed reloads
  useEffect(() => {
    const handleDataChanged = () => {
      fetchData();
    };
    window.addEventListener("admin-data-changed", handleDataChanged);
    return () => {
      window.removeEventListener("admin-data-changed", handleDataChanged);
    };
  }, [fetchData]);

  const handleDeleteExpenditure = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expenditure record?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/expenditures/${id}`);
      showToast("Expenditure deleted successfully.", "success");
      fetchData();
    } catch (err) {
      console.error("Failed to delete expenditure:", err);
      showToast("Failed to delete expenditure. Please try again.", "error");
    }
  };

  const handleEditExpenditureClick = (exp) => {
    setSelectedExpenditure(exp);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    // Performance optimization: check local storage cache for quick role validation
    const saved = localStorage.getItem("mongoUser");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.uid === user.uid && u.role === "admin") {
          setCheckingRole(false);
          fetchData();
          return;
        }
      } catch (e) {
        // Fall back to API validation
      }
    }

    axios.get(`http://localhost:3001/books/uid/${user.uid}`)
      .then((res) => {
        if (res.data.role !== "admin") {
          navigate(`/user/${res.data.id}`);
        } else {
          localStorage.setItem("mongoUser", JSON.stringify(res.data));
          setCheckingRole(false);
          fetchData();
        }
      })
      .catch((err) => {
        console.error("Dashboard auth check failed:", err);
        navigate("/login");
      });
  }, [user, loading, navigate, fetchData]);

  // Extract all unique years present in donations and expenditures
  const availableYears = useMemo(() => {
    const years = new Set();
    years.add("2026");
    years.add("2025");
    users.forEach((u) => {
      if (u.mosque && Array.isArray(u.mosque)) {
        u.mosque.forEach(y => { if (y.year) years.add(y.year); });
      }
      if (u.imam && Array.isArray(u.imam)) {
        u.imam.forEach(y => { if (y.year) years.add(y.year); });
      }
    });
    expenditures.forEach((exp) => {
      if (exp.year) years.add(exp.year);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [users, expenditures]);

  // Calculate dynamic stats filtered by year
  const totalDonors = users.length;
  
  const donationsCollected = useMemo(() => {
    let sum = 0;
    users.forEach((u) => {
      if (u.mosque && Array.isArray(u.mosque)) {
        u.mosque.forEach((y) => {
          if (!filterYear || y.year === filterYear) {
            if (y.months && Array.isArray(y.months)) {
              y.months.forEach((m) => {
                sum += Number(m.amount) || 0;
              });
            }
          }
        });
      }

      if (u.imam && Array.isArray(u.imam)) {
        u.imam.forEach((y) => {
          if (!filterYear || y.year === filterYear) {
            if (y.months && Array.isArray(y.months)) {
              y.months.forEach((m) => {
                sum += Number(m.amount) || 0;
              });
            }
          }
        });
      }
    });
    return sum;
  }, [users, filterYear]);

  const totalExpenditures = useMemo(() => {
    let sum = 0;
    expenditures.forEach((exp) => {
      if (!filterYear || exp.year === filterYear) {
        sum += Number(exp.amount) || 0;
      }
    });
    return sum;
  }, [expenditures, filterYear]);

  const netBalance = donationsCollected - totalExpenditures;

  // Extract donations feed, filtered by year, sorted by date descending
  const recentDonations = useMemo(() => {
    const all = [];
    users.forEach((u) => {
      if (u.mosque && Array.isArray(u.mosque)) {
        u.mosque.forEach((y) => {
          if (!filterYear || y.year === filterYear) {
            if (y.months && Array.isArray(y.months)) {
              y.months.forEach((m) => {
                all.push({
                  id: `${u.id}-mosque-${y.year}-${m.month}-${m.day}`,
                  userName: u.userName,
                  type: "Mosque Fund",
                  amount: Number(m.amount) || 0,
                  dateStr: `${m.day || "01"}/${m.month}/${y.year}`,
                  dateObj: new Date(Number(y.year), Number(m.month) - 1, Number(m.day || 1))
                });
              });
            }
          }
        });
      }
      if (u.imam && Array.isArray(u.imam)) {
        u.imam.forEach((y) => {
          if (!filterYear || y.year === filterYear) {
            if (y.months && Array.isArray(y.months)) {
              y.months.forEach((m) => {
                all.push({
                  id: `${u.id}-imam-${y.year}-${m.month}-${m.day}`,
                  userName: u.userName,
                  type: "Imam Fund",
                  amount: Number(m.amount) || 0,
                  dateStr: `${m.day || "01"}/${m.month}/${y.year}`,
                  dateObj: new Date(Number(y.year), Number(m.month) - 1, Number(m.day || 1))
                });
              });
            }
          }
        });
      }
    });

    return all.sort((a, b) => b.dateObj - a.dateObj).slice(0, 5);
  }, [users, filterYear]);

  // Extract expenditures feed, filtered by year, sorted by date descending
  const recentExpenditures = useMemo(() => {
    const filtered = expenditures.filter(exp => !filterYear || exp.year === filterYear);
    return filtered.slice(0, 5);
  }, [expenditures, filterYear]);



  const handleNewEntryMenuOpen = (event) => {
    setAnchorElNewEntry(event.currentTarget);
  };

  const handleNewEntryMenuClose = () => {
    setAnchorElNewEntry(null);
  };









  if (loading || checkingRole) {
    return (
      <Box sx={{ p: 4, bgcolor: colors.background, minHeight: "100vh" }}>
        {/* Welcome Section Skeleton */}
        <Box sx={{ mb: 5 }}>
          <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={48} />
        </Box>

        {/* Stats Grid Skeleton */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card sx={{ bgcolor: "#ffffff", borderRadius: "12px", border: `1px solid ${colors.outlineVariant}`, p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="text" width="30%" height={20} />
                </Box>
                <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={36} />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Content Columns Skeleton */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" }, gap: "16px" }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} variant="rectangular" height={120} sx={{ borderRadius: "12px" }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ bgcolor: "#ffffff", borderRadius: "16px", p: 3, border: `1px solid ${colors.outlineVariant}` }}>
              <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Box key={item} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="70%" height={20} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                    <Skeleton variant="text" width="60px" height={20} />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <>
          {/* Hero Welcome Row */}
          <Box sx={{ mb: 5, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 2.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.secondary }} />
                <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant }}>
                  Welcome back, Mohd Nadeem
                </Typography>
              </Box>
              <Typography sx={{ ...typography.displayLg, color: colors.primary, fontSize: { xs: "32px", md: "48px" } }}>
                Admin Dashboard
              </Typography>
            </Box>
            
            {/* Year Filter Select Dropdown & New Entry trigger */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", md: "auto" } }}>
              <Box sx={{ display: "flex", flex: 1, alignItems: "center", bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, px: 2, py: 1, borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                <CalendarTodayRoundedIcon sx={{ fontSize: "18px", color: colors.outline, mr: 1 }} />
                <FormControl variant="standard" sx={{ minWidth: 60 }}>
                  <Select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    disableUnderline
                    IconComponent={ExpandMoreRoundedIcon}
                    sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: "700", color: colors.onSurface }}
                  >
                    <MenuItem value="" sx={{ fontFamily: "Inter" }}>All</MenuItem>
                    {availableYears.map(year => (
                      <MenuItem key={year} value={year} sx={{ fontFamily: "Inter" }}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* New Entry Action Button */}
              <Button
                variant="contained"
                onClick={handleNewEntryMenuOpen}
                startIcon={<AddRoundedIcon />}
                sx={{
                  bgcolor: colors.primary,
                  color: colors.onPrimary,
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: "700",
                  fontSize: "14px",
                  px: 3,
                  py: 1.25,
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": { bgcolor: colors.primaryContainer, boxShadow: "none" }
                }}
              >
                New Entry
              </Button>
              
              {/* New Entry Dropdown Options */}
              <Menu
                anchorEl={anchorElNewEntry}
                open={Boolean(anchorElNewEntry)}
                onClose={handleNewEntryMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: `1px solid ${colors.outlineVariant}`,
                    p: 0.5
                  }
                }}
              >
                <MenuItem onClick={() => { handleNewEntryMenuClose(); window.dispatchEvent(new CustomEvent("open-add-user")); }} sx={{ fontFamily: "Inter", fontSize: "13.5px", py: 1, borderRadius: "6px" }}>
                  Register Donor
                </MenuItem>
                <MenuItem onClick={() => { handleNewEntryMenuClose(); window.dispatchEvent(new CustomEvent("open-add-admin")); }} sx={{ fontFamily: "Inter", fontSize: "13.5px", py: 1, borderRadius: "6px" }}>
                  Add Administrator
                </MenuItem>
                <MenuItem onClick={() => { handleNewEntryMenuClose(); window.dispatchEvent(new CustomEvent("open-add-expenditure")); }} sx={{ fontFamily: "Inter", fontSize: "13.5px", py: 1, borderRadius: "6px" }}>
                  Log Expenditure
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* 4. Stat Summary Cards Grid */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* Card: Total Donors */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "12px", boxShadow: "0 15px 20px -15px rgba(0,108,73,0.06)", position: "relative", overflow: "hidden", transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", "&:hover": { transform: "translateY(-4px)" } }}>
                <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: colors.secondary }} />
                <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Avatar sx={{ bgcolor: "rgba(108, 248, 187, 0.2)", width: 36, height: 36, borderRadius: "8px" }}>
                      <GroupRoundedIcon sx={{ color: colors.secondary, fontSize: "20px" }} />
                    </Avatar>
                    <Typography variant="caption" sx={{ color: colors.secondaryFixedDim, fontWeight: "700", fontFamily: "Inter", fontSize: "12px" }}>
                      +2 this month
                    </Typography>
                  </Box>
                  <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant, mb: 0.5 }}>
                    Total Donors
                  </Typography>
                  <Typography sx={{ ...typography.headlineLg, color: colors.onSurface, fontSize: "32px", fontWeight: "700", lineHeight: 1.1 }}>
                    {loadingData ? <Skeleton variant="text" width="60%" /> : totalDonors}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card: Donations Collected */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "12px", boxShadow: "0 15px 20px -15px rgba(0,108,73,0.06)", position: "relative", overflow: "hidden", transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", "&:hover": { transform: "translateY(-4px)" } }}>
                <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: colors.secondaryFixedDim }} />
                <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Avatar sx={{ bgcolor: "rgba(108, 248, 187, 0.2)", width: 36, height: 36, borderRadius: "8px" }}>
                      <VolunteerActivismRoundedIcon sx={{ color: colors.secondary, fontSize: "20px" }} />
                    </Avatar>
                    <Typography variant="caption" sx={{ color: colors.secondary, fontWeight: "700", fontFamily: "Inter", fontSize: "12px" }}>
                      Healthy
                    </Typography>
                  </Box>
                  <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant, mb: 0.5 }}>
                    Donations Collected
                  </Typography>
                  <Typography sx={{ ...typography.headlineLg, color: colors.onSurface, fontSize: "32px", fontWeight: "700", lineHeight: 1.1 }}>
                    {loadingData ? <Skeleton variant="text" width="80%" /> : `₹${donationsCollected.toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card: Total Expenditures */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "12px", boxShadow: "0 15px 20px -15px rgba(186,26,26,0.06)", position: "relative", overflow: "hidden", transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", "&:hover": { transform: "translateY(-4px)" } }}>
                <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: colors.error }} />
                <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Avatar sx={{ bgcolor: "rgba(255, 218, 214, 0.3)", width: 36, height: 36, borderRadius: "8px" }}>
                      <PaymentsRoundedIcon sx={{ color: colors.error, fontSize: "20px" }} />
                    </Avatar>
                    <Typography variant="caption" sx={{ color: colors.error, fontWeight: "700", fontFamily: "Inter", fontSize: "12px" }}>
                      High
                    </Typography>
                  </Box>
                  <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant, mb: 0.5 }}>
                    Total Expenditures
                  </Typography>
                  <Typography sx={{ ...typography.headlineLg, color: colors.onSurface, fontSize: "32px", fontWeight: "700", lineHeight: 1.1 }}>
                    {loadingData ? <Skeleton variant="text" width="70%" /> : `₹${totalExpenditures.toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card: Net Balance (Exactly matches mockup layout) */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  bgcolor: netBalance >= 0 ? "rgba(108, 248, 187, 0.2)" : "rgba(255, 218, 214, 0.2)",
                  border: `1px solid ${netBalance >= 0 ? "rgba(0, 108, 73, 0.2)" : "rgba(186, 26, 26, 0.2)"}`,
                  borderRadius: "12px", 
                  position: "relative", 
                  overflow: "hidden",
                  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", 
                  "&:hover": { transform: "translateY(-4px)" }
                }}
              >
                {/* Overlay gradient */}
                <Box sx={{ position: "absolute", inset: 0, bg: `linear-gradient(135deg, ${netBalance >= 0 ? "rgba(0, 108, 73, 0.05)" : "rgba(186, 26, 26, 0.05)"} 0%, transparent 100%)`, zIndex: 1 }} />
                <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: netBalance >= 0 ? colors.secondary : colors.error, zIndex: 2 }} />
                <CardContent sx={{ p: 3, position: "relative", zIndex: 5, "&:last-child": { pb: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Avatar sx={{ bgcolor: "#ffffff", width: 36, height: 36, borderRadius: "8px", border: `1px solid ${netBalance >= 0 ? "rgba(0, 108, 73, 0.1)" : "rgba(186, 26, 26, 0.1)"}` }}>
                      <AccountBalanceWalletRoundedIcon sx={{ color: netBalance >= 0 ? colors.secondary : colors.error, fontSize: "20px" }} />
                    </Avatar>
                    <Typography variant="caption" sx={{ color: netBalance >= 0 ? colors.secondary : colors.error, fontWeight: "800", letterSpacing: "1.5px", fontFamily: "Inter", textTransform: "uppercase", fontSize: "10px" }}>
                      {netBalance >= 0 ? "SURPLUS" : "DEFICIT"}
                    </Typography>
                  </Box>
                  <Typography sx={{ ...typography.labelMd, color: colors.onSurfaceVariant, mb: 0.5 }}>
                    Net Balance
                  </Typography>
                  <Typography sx={{ ...typography.headlineLg, color: netBalance >= 0 ? colors.secondary : colors.error, fontSize: "32px", fontWeight: "700", lineHeight: 1.1 }}>
                    {loadingData ? <Skeleton variant="text" width="75%" /> : `${netBalance < 0 ? "-" : ""}₹${Math.abs(netBalance).toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 5. Main Content Columns */}
          <Grid container spacing={4}>
            
            {/* LEFT COLUMN: Quick Actions & Notifications */}
            <Grid item xs={12} lg={8}>
              {/* Quick Actions Panel */}
              <Box sx={{ mb: 5 }}>
                <Typography sx={{ ...typography.headlineMd, color: colors.primary, mb: 2 }}>
                  Quick Actions
                </Typography>
                
                {/* CSS Grid layout for Quick Actions mapping directly to Tailwind class grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 */}
                <Box 
                  sx={{ 
                    display: "grid", 
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" }, 
                    gap: "16px" 
                  }}
                >
                  {/* Action Card: Add Donation (Register Donor) */}
                  <ButtonBase 
                    onClick={() => window.dispatchEvent(new CustomEvent("open-add-user"))}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: { xs: 2, md: 3 },
                      bgcolor: colors.surfaceContainerLowest,
                      border: `1px solid ${colors.outlineVariant}`,
                      borderRadius: "12px",
                      width: "100%",
                      minHeight: 120,
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: colors.secondary,
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                        "& .action-icon": { transform: "scale(1.1)" }
                      }
                    }}
                  >
                    <AddCircleRoundedIcon className="action-icon" sx={{ color: colors.secondary, fontSize: "28px", transition: "transform 0.2s" }} />
                    <Typography sx={{ ...typography.labelMd, color: colors.onSurface, textAlign: "center" }}>
                      Add Donation
                    </Typography>
                  </ButtonBase>

                  {/* Action Card: Mosque Users */}
                  <ButtonBase 
                    onClick={() => navigate("/showUserForMosqueAdmin")}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: { xs: 2, md: 3 },
                      bgcolor: colors.surfaceContainerLowest,
                      border: `1px solid ${colors.outlineVariant}`,
                      borderRadius: "12px",
                      width: "100%",
                      minHeight: 120,
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: colors.secondary,
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                        "& .action-icon": { transform: "scale(1.1)" }
                      }
                    }}
                  >
                    <PersonSearchRoundedIcon className="action-icon" sx={{ color: colors.secondary, fontSize: "28px", transition: "transform 0.2s" }} />
                    <Typography sx={{ ...typography.labelMd, color: colors.onSurface, textAlign: "center" }}>
                      Mosque Users
                    </Typography>
                  </ButtonBase>

                  {/* Action Card: Add Expense */}
                  <ButtonBase 
                    onClick={() => window.dispatchEvent(new CustomEvent("open-add-expenditure"))}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: { xs: 2, md: 3 },
                      bgcolor: colors.surfaceContainerLowest,
                      border: `1px solid ${colors.outlineVariant}`,
                      borderRadius: "12px",
                      width: "100%",
                      minHeight: 120,
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: colors.secondary,
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                        "& .action-icon": { transform: "scale(1.1)" }
                      }
                    }}
                  >
                    <RemoveCircleRoundedIcon className="action-icon" sx={{ color: colors.error, fontSize: "28px", transition: "transform 0.2s" }} />
                    <Typography sx={{ ...typography.labelMd, color: colors.onSurface, textAlign: "center" }}>
                      Add Expense
                    </Typography>
                  </ButtonBase>

                  {/* Action Card: Imam Users */}
                  <ButtonBase 
                    onClick={() => navigate("/showUserForImamAdmin")}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: { xs: 2, md: 3 },
                      bgcolor: colors.surfaceContainerLowest,
                      border: `1px solid ${colors.outlineVariant}`,
                      borderRadius: "12px",
                      width: "100%",
                      minHeight: 120,
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: colors.secondary,
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                        "& .action-icon": { transform: "scale(1.1)" }
                      }
                    }}
                  >
                    <ManageAccountsRoundedIcon className="action-icon" sx={{ color: colors.secondary, fontSize: "28px", transition: "transform 0.2s" }} />
                    <Typography sx={{ ...typography.labelMd, color: colors.onSurface, textAlign: "center" }}>
                      Imam Users
                    </Typography>
                  </ButtonBase>

                  {/* Action Card: Modify / Delete */}
                  <ButtonBase 
                    onClick={() => navigate("/showUser")}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: { xs: 2, md: 3 },
                      bgcolor: colors.surfaceContainerLowest,
                      border: `1px solid ${colors.outlineVariant}`,
                      borderRadius: "12px",
                      width: "100%",
                      minHeight: 120,
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: colors.error,
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                        "& .action-icon": { transform: "scale(1.1)" }
                      }
                    }}
                  >
                    <DeleteSweepRoundedIcon className="action-icon" sx={{ color: colors.onSurfaceVariant, fontSize: "28px", transition: "transform 0.2s" }} />
                    <Typography sx={{ ...typography.labelMd, color: colors.onSurface, textAlign: "center" }}>
                      Modify / Delete
                    </Typography>
                  </ButtonBase>
                </Box>
              </Box>


            </Grid>

            {/* RIGHT COLUMN: Feeds (Donations & Expenditures) */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                
                {/* Recent Donations Ledger */}
                <Box>
                  <Card sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: colors.surfaceContainerLow, borderBottom: `1px solid ${colors.outlineVariant}`, px: 3, py: 2 }}>
                      <Typography sx={{ ...typography.headlineMd, color: colors.primary, fontSize: "18px", display: "flex", alignItems: "center", gap: 1 }}>
                        <TrendingUpRoundedIcon sx={{ color: colors.secondary, fontSize: "22px" }} /> Recent Donations
                      </Typography>
                      <ButtonBase 
                        onClick={() => navigate("/showUserForMosqueAdmin")} 
                        sx={{ color: colors.secondary, fontWeight: "700", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "Inter" }}
                      >
                        View All
                      </ButtonBase>
                    </Box>
                    
                    <Box sx={{ p: 1.5 }}>
                      {loadingData ? (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          {[1, 2, 3, 4, 5].map((item, idx) => (
                            <Box 
                              key={item} 
                              sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                px: 2.5,
                                py: 2,
                                borderBottom: idx < 4 ? `1px solid ${colors.outlineVariant}` : "none"
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Box>
                                  <Skeleton variant="text" width={100} height={20} />
                                  <Skeleton variant="text" width={70} height={14} />
                                </Box>
                              </Box>
                              <Skeleton variant="text" width={50} height={24} />
                            </Box>
                          ))}
                        </Box>
                      ) : recentDonations.length === 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, gap: 1.5, color: colors.outline }}>
                          <Avatar sx={{ bgcolor: "rgba(108, 248, 187, 0.1)", width: 44, height: 44 }}>
                            <GroupRoundedIcon sx={{ color: colors.secondary }} />
                          </Avatar>
                          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: "600" }}>No donations logged in {filterYear || 'All'}</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          {recentDonations.map((donation, index) => (
                            <Box 
                              key={`${donation.id}-${index}`} 
                              sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                px: 2.5,
                                py: 2,
                                borderBottom: index < recentDonations.length - 1 ? `1px solid ${colors.outlineVariant}` : "none",
                                transition: "background-color 0.2s",
                                "&:hover": { bgcolor: "rgba(0, 108, 73, 0.05)" }
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar sx={{ 
                                  bgcolor: donation.type === "Mosque Fund" ? "rgba(108, 248, 187, 0.2)" : colors.surfaceContainerHigh,
                                  color: donation.type === "Mosque Fund" ? colors.secondary : colors.onSurfaceVariant,
                                  width: 40, 
                                  height: 40,
                                  fontSize: "16px",
                                  fontWeight: "700",
                                  fontFamily: "Inter"
                                }}>
                                  {donation.userName.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ ...typography.bodyMd, fontWeight: "600", color: colors.onSurface }}>
                                    {donation.userName}
                                  </Typography>
                                  <Typography sx={{ ...typography.labelSm, color: colors.onSurfaceVariant, fontWeight: "500" }}>
                                    {donation.type} • {donation.dateStr}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography sx={{ ...typography.headlineMd, fontSize: "16px", color: colors.secondary }}>
                                + ₹{donation.amount}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Box>

                {/* Recent Expenditures Ledger */}
                <Box>
                  <Card sx={{ bgcolor: colors.surfaceContainerLowest, border: `1px solid ${colors.outlineVariant}`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: colors.surfaceContainerLow, borderBottom: `1px solid ${colors.outlineVariant}`, px: 3, py: 2 }}>
                      <Typography sx={{ ...typography.headlineMd, color: colors.error, fontSize: "18px", display: "flex", alignItems: "center", gap: 1 }}>
                        <TrendingDownRoundedIcon sx={{ color: colors.error, fontSize: "22px" }} /> Expenditures
                      </Typography>
                    </Box>
                    
                    <Box sx={{ p: 1.5 }}>
                      {loadingData ? (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          {[1, 2, 3, 4, 5].map((item, idx) => (
                            <Box 
                              key={item} 
                              sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                px: 2.5,
                                py: 2,
                                borderBottom: idx < 4 ? `1px solid ${colors.outlineVariant}` : "none"
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Box>
                                  <Skeleton variant="text" width={100} height={20} />
                                  <Skeleton variant="text" width={70} height={14} />
                                </Box>
                              </Box>
                              <Skeleton variant="text" width={50} height={24} />
                            </Box>
                          ))}
                        </Box>
                      ) : recentExpenditures.length === 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, gap: 1.5, color: colors.outline }}>
                          <Avatar sx={{ bgcolor: "rgba(255, 218, 214, 0.3)", width: 44, height: 44 }}>
                            <PaymentsRoundedIcon sx={{ color: colors.error }} />
                          </Avatar>
                          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: "600" }}>No expenditures logged in {filterYear || 'All'}</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          {recentExpenditures.map((exp, index) => (
                            <Box 
                              key={exp.id} 
                              sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                px: 2.5,
                                py: 2,
                                borderBottom: index < recentExpenditures.length - 1 ? `1px solid ${colors.outlineVariant}` : "none",
                                transition: "background-color 0.2s",
                                "&:hover": { 
                                  bgcolor: "rgba(186, 26, 26, 0.05)",
                                  "& .action-buttons": { opacity: 1, width: 60 }
                                }
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar sx={{ 
                                  bgcolor: "rgba(255, 218, 214, 0.3)",
                                  color: colors.error,
                                  width: 40, 
                                  height: 40,
                                  borderRadius: "8px"
                                }}>
                                  <ConstructionRoundedIcon sx={{ fontSize: "20px" }} />
                                </Avatar>
                                <Box>
                                  <Typography sx={{ ...typography.bodyMd, fontWeight: "600", color: colors.onSurface }}>
                                    {exp.category}
                                  </Typography>
                                  <Typography sx={{ ...typography.labelSm, color: colors.onSurfaceVariant, fontWeight: "500" }}>
                                    {exp.day}/{exp.month}/{exp.year} {exp.description && `• ${exp.description}`}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography sx={{ ...typography.headlineMd, fontSize: "16px", color: colors.error, mr: 0.5 }}>
                                  - ₹{exp.amount}
                                </Typography>
                                
                                {/* Sliding Fade-in Action Buttons on Hover */}
                                <Box 
                                  className="action-buttons" 
                                  sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 0.5, 
                                    opacity: 0, 
                                    width: 0,
                                    overflow: "hidden",
                                    transition: "opacity 0.2s ease, width 0.2s ease" 
                                  }}
                                >
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditExpenditureClick(exp)}
                                    sx={{ color: colors.outline, p: 0.5, "&:hover": { color: colors.secondary } }}
                                  >
                                    <EditOutlinedIcon sx={{ fontSize: "18px" }} />
                                  </IconButton>
                                  
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteExpenditure(exp.id)}
                                    sx={{ color: colors.outline, p: 0.5, "&:hover": { color: colors.error } }}
                                  >
                                    <DeleteRoundedIcon sx={{ fontSize: "18px" }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Box>

              </Box>
            </Grid>

          </Grid>


      {/* 4. MODALS AND DIALOGS (CONTROLLED STATE) */}
      <EditExpenditure
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        expenditure={selectedExpenditure}
        onSuccess={fetchData}
      />

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%", fontFamily: "Inter" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </>
  );
};

export default Dashboard;
