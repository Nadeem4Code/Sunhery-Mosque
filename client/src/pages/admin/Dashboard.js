import React, { useState, useEffect } from "react";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  CircularProgress, 
  Box, 
  Container,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import axios from "axios";

// Icons
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import MoneyOffCsredRoundedIcon from "@mui/icons-material/MoneyOffCsredRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// Components
import AddUser from "./AddUser";
import AddAdmin from "./AddAdmin";
import AddExpenditure from "./AddExpenditure";
import EditExpenditure from "./EditExpenditure";

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [checkingRole, setCheckingRole] = useState(true);
  const [users, setUsers] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filterYear, setFilterYear] = useState("2026"); // Defaults to 2026
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedExpenditure, setSelectedExpenditure] = useState(null);
  const navigate = useNavigate();

  const fetchData = () => {
    setLoadingData(true);
    // Fetch users
    const usersReq = axios.get("http://localhost:3001/books");
    // Fetch expenditures
    const expReq = axios.get("http://localhost:3001/expenditures");

    Promise.all([usersReq, expReq])
      .then(([usersRes, expRes]) => {
        setUsers(usersRes.data);
        setExpenditures(expRes.data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setLoadingData(false);
      });
  };

  const handleDeleteExpenditure = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expenditure record?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/expenditures/${id}`);
      fetchData(); // Refresh metrics and lists
    } catch (err) {
      console.error("Failed to delete expenditure:", err);
      alert("Failed to delete expenditure record. Please try again.");
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

    axios.get(`http://localhost:3001/books/uid/${user.uid}`)
      .then((res) => {
        if (res.data.role !== "admin") {
          navigate(`/user/${res.data.id}`);
        } else {
          setCheckingRole(false);
          fetchData();
        }
      })
      .catch((err) => {
        console.error("Dashboard auth check failed:", err);
        navigate("/login");
      });
  }, [user, loading, navigate]);

  // Extract all unique years present in donations and expenditures
  const availableYears = React.useMemo(() => {
    const years = new Set();
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
    
    // Always include at least 2025 and 2026 as fallbacks
    years.add("2025");
    years.add("2026");
    
    return Array.from(years).sort((a, b) => b - a);
  }, [users, expenditures]);

  // Calculate dynamic stats filtered by year
  const totalDonors = users.length;
  
  let donationsCollected = 0;
  users.forEach((u) => {
    if (u.mosque && Array.isArray(u.mosque)) {
      u.mosque.forEach((y) => {
        if (!filterYear || y.year === filterYear) {
          if (y.months && Array.isArray(y.months)) {
            y.months.forEach((m) => {
              donationsCollected += Number(m.amount) || 0;
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
              donationsCollected += Number(m.amount) || 0;
            });
          }
        }
      });
    }
  });

  let totalExpenditures = 0;
  expenditures.forEach((exp) => {
    if (!filterYear || exp.year === filterYear) {
      totalExpenditures += Number(exp.amount) || 0;
    }
  });

  const netBalance = donationsCollected - totalExpenditures;

  // Extract donations feed, filtered by year, sorted by date descending
  const recentDonations = React.useMemo(() => {
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
  const recentExpenditures = React.useMemo(() => {
    const filtered = expenditures.filter(exp => !filterYear || exp.year === filterYear);
    return filtered.slice(0, 5);
  }, [expenditures, filterYear]);

  if (loading || checkingRole || loadingData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: "100px", mb: 6 }}>
      {/* Welcome & Title Header */}
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: "Poppins", 
              fontWeight: "800", 
              color: "#240F4F",
              fontSize: { xs: "24px", md: "32px" }
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontFamily: "Poppins", 
              color: "#8789A3",
              fontWeight: "500",
              mt: 0.5
            }}
          >
            Welcome back, <span style={{ fontWeight: "700", color: "#672CBC" }}>Mohd Nadeem</span>
          </Typography>
        </Box>
        
        {/* Year Filter & Admin Badge container */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Year Filter Select Dropdown */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel style={{ fontFamily: "Poppins" }}>Year Filter</InputLabel>
            <Select
              value={filterYear}
              label="Year Filter"
              onChange={(e) => setFilterYear(e.target.value)}
              style={{ fontFamily: "Poppins", borderRadius: "5px" }}
            >
              <MenuItem value="" style={{ fontFamily: "Poppins" }}>All Years</MenuItem>
              {availableYears.map(year => (
                <MenuItem key={year} value={year} style={{ fontFamily: "Poppins" }}>
                  {year} Year
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box 
            sx={{ 
              backgroundColor: "rgba(103, 44, 188, 0.1)", 
              color: "#672CBC", 
              px: 2, 
              py: 1, 
              borderRadius: "5px",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "13px",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <CheckCircleRoundedIcon fontSize="small" /> System Administrator
          </Box>
        </Box>
      </Box>

      {/* Dynamic Summary Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* Total Donors */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)", 
              borderRadius: "5px",
              color: "white",
              boxShadow: "0 4px 12px rgba(103, 44, 188, 0.12)"
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
              <Avatar sx={{ width: 52, height: 52, borderRadius: "5px", background: "rgba(255,255,255,0.2)", mr: 2 }}>
                <GroupRoundedIcon sx={{ color: "white", fontSize: "28px" }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", opacity: 0.85, fontWeight: "500" }}>
                  Total Donors
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "26px", fontWeight: "800" }}>
                  {totalDonors}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Donations Collected */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: "linear-gradient(135deg, #00B09B 0%, #96C93D 100%)", 
              borderRadius: "5px",
              color: "white",
              boxShadow: "0 4px 12px rgba(0, 176, 155, 0.12)"
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
              <Avatar sx={{ width: 52, height: 52, borderRadius: "5px", background: "rgba(255,255,255,0.2)", mr: 2 }}>
                <PaymentRoundedIcon sx={{ color: "white", fontSize: "28px" }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", opacity: 0.85, fontWeight: "500" }}>
                  Donations Collected {filterYear && `(${filterYear})`}
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "26px", fontWeight: "800", display: "flex", alignItems: "center" }}>
                  ₹{donationsCollected.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Expenditures */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: "linear-gradient(135deg, #ff5252 0%, #ff1744 100%)", 
              borderRadius: "5px",
              color: "white",
              boxShadow: "0 4px 12px rgba(255, 23, 68, 0.12)"
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
              <Avatar sx={{ width: 52, height: 52, borderRadius: "5px", background: "rgba(255,255,255,0.2)", mr: 2 }}>
                <MoneyOffCsredRoundedIcon sx={{ color: "white", fontSize: "28px" }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", opacity: 0.85, fontWeight: "500" }}>
                  Total Expenditures {filterYear && `(${filterYear})`}
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "26px", fontWeight: "800", display: "flex", alignItems: "center" }}>
                  ₹{totalExpenditures.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Net Balance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: netBalance >= 0 
                ? "linear-gradient(135deg, #240F4F 0%, #4A154B 100%)" 
                : "linear-gradient(135deg, #37000A 0%, #5E0011 100%)", 
              borderRadius: "5px",
              color: "white",
              boxShadow: "0 4px 12px rgba(36, 15, 79, 0.15)"
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
              <Avatar sx={{ width: 52, height: 52, borderRadius: "5px", background: "rgba(255,255,255,0.2)", mr: 2 }}>
                <CurrencyRupeeRoundedIcon sx={{ color: "white", fontSize: "28px" }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", opacity: 0.85, fontWeight: "500" }}>
                  Net Balance {filterYear && `(${filterYear})`}
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "26px", fontWeight: "800", display: "flex", alignItems: "center" }}>
                  ₹{netBalance.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Sections */}
      <Grid container spacing={4}>
        {/* Quick Actions Panel */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: "700", color: "#240F4F", mb: 2.5 }}>
            Administrative Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {/* Register Donor Modal */}
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(103, 44, 188, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(103, 44, 188, 0.1)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center"
                }}
              >
                <AddUser />
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "16px", color: "#240F4F", mt: 2, mb: 0.5 }}>
                  Register Donor
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#8789A3" }}>
                  Create a new public donor profile in the database.
                </Typography>
              </Card>
            </Grid>

            {/* Add Administrator Modal */}
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(255, 94, 0, 0.15)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(255, 94, 0, 0.12)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center"
                }}
              >
                <AddAdmin />
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "16px", color: "#240F4F", mt: 2, mb: 0.5 }}>
                  Add Administrator
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#8789A3" }}>
                  Register another administrator with administrative access.
                </Typography>
              </Card>
            </Grid>

            {/* Add Expenditure Modal */}
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(255, 23, 68, 0.15)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(255, 23, 68, 0.12)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center"
                }}
              >
                <AddExpenditure onAddSuccess={fetchData} />
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "16px", color: "#240F4F", mt: 2, mb: 0.5 }}>
                  Add Expenditure
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#8789A3" }}>
                  Log a payout/expenditure (such as Imam pay, Mosque build-up).
                </Typography>
              </Card>
            </Grid>

            {/* Mosque Ledger Link */}
            <Grid item xs={12} sm={6}>
              <Card 
                onClick={() => navigate("/showUserForMosqueAdmin")}
                sx={{ 
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(103, 44, 188, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(103, 44, 188, 0.1)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer"
                }}
              >
                <Avatar sx={{ width: 48, height: 48, borderRadius: "5px", background: "rgba(103, 44, 188, 0.1)", mb: 1.5 }}>
                  <PeopleAltRoundedIcon sx={{ color: "#672CBC", fontSize: "24px" }} />
                </Avatar>
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "16px", color: "#240F4F", mb: 0.5 }}>
                  Mosque Users
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#8789A3" }}>
                  Record payments & manage Mosque Fund donors.
                </Typography>
              </Card>
            </Grid>

            {/* Imam Ledger Link */}
            <Grid item xs={12} sm={6}>
              <Card 
                onClick={() => navigate("/showUserForImamAdmin")}
                sx={{ 
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(103, 44, 188, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(103, 44, 188, 0.1)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer"
                }}
              >
                <Avatar sx={{ width: 48, height: 48, borderRadius: "5px", background: "rgba(0, 176, 155, 0.1)", mb: 1.5 }}>
                  <SupervisorAccountRoundedIcon sx={{ color: "#00B09B", fontSize: "24px" }} />
                </Avatar>
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "16px", color: "#240F4F", mb: 0.5 }}>
                  Imam Users
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#8789A3" }}>
                  Record payments & manage Imam & Staff donors.
                </Typography>
              </Card>
            </Grid>

            {/* Delete / Modify Users Link */}
            <Grid item xs={12} sm={6}>
              <Card 
                onClick={() => navigate("/showUser")}
                sx={{ 
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(103, 44, 188, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(103, 44, 188, 0.1)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer"
                }}
              >
                <Avatar sx={{ width: 48, height: 48, borderRadius: "5px", background: "rgba(255, 82, 82, 0.1)", mb: 1.5 }}>
                  <DeleteRoundedIcon sx={{ color: "#ff5252", fontSize: "24px" }} />
                </Avatar>
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "16px", color: "#240F4F", mb: 0.5 }}>
                  Modify / Delete
                </Typography>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#8789A3" }}>
                  Remove or edit existing records inside the system.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Ledgers Panel (Donations and Expenditures Side-by-Side) */}
        <Grid item xs={12} md={5}>
          {/* Recent Donations Ledger */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: "700", color: "#240F4F" }}>
                Recent Donations {filterYear && `(${filterYear})`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#8789A3" }}>
                <TrendingUpRoundedIcon fontSize="small" />
                <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600" }}>INCOME</Typography>
              </Box>
            </Box>
            <Paper 
              sx={{ 
                borderRadius: "5px", 
                p: 2.5, 
                boxShadow: "0 2px 10px rgba(103, 44, 188, 0.03)",
                border: "1px solid rgba(103, 44, 188, 0.08)",
                minHeight: "220px"
              }}
            >
              {recentDonations.length === 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", color: "#8789A3" }}>
                  <Avatar sx={{ width: 44, height: 44, borderRadius: "5px", background: "#f5f3ff", mb: 1.5 }}>
                    <PeopleAltRoundedIcon sx={{ color: "#672CBC", fontSize: "20px" }} />
                  </Avatar>
                  <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", fontWeight: "600" }}>No donations logged in {filterYear || 'All Years'}</Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {recentDonations.map((donation) => (
                    <Box 
                      key={donation.id} 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        p: 1.25,
                        borderRadius: "5px",
                        backgroundColor: "#fafafa",
                        borderLeft: `4px solid ${donation.type === "Mosque Fund" ? "#672CBC" : "#00B09B"}`,
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "#f5f3ff"
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: "5px",
                            fontSize: "12px", 
                            fontWeight: "700",
                            fontFamily: "Poppins",
                            background: donation.type === "Mosque Fund" ? "rgba(103, 44, 188, 0.1)" : "rgba(0, 176, 155, 0.1)",
                            color: donation.type === "Mosque Fund" ? "#672CBC" : "#00B09B"
                          }}
                        >
                          {donation.userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12.5px", fontWeight: "700", color: "#240F4F" }}>
                            {donation.userName}
                          </Typography>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "10.5px", color: "#8789A3" }}>
                            {donation.dateStr} • {donation.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        sx={{ 
                          fontFamily: "Poppins", 
                          fontSize: "13.5px", 
                          fontWeight: "800", 
                          color: donation.type === "Mosque Fund" ? "#672CBC" : "#00B09B" 
                        }}
                      >
                        + ₹{donation.amount}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          {/* Recent Expenditures Ledger */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: "700", color: "#240F4F" }}>
                Recent Expenditures {filterYear && `(${filterYear})`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#ff5252" }}>
                <MoneyOffCsredRoundedIcon fontSize="small" />
                <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600" }}>EXPENSE</Typography>
              </Box>
            </Box>
            <Paper 
              sx={{ 
                borderRadius: "5px", 
                p: 2.5, 
                boxShadow: "0 2px 10px rgba(103, 44, 188, 0.03)",
                border: "1px solid rgba(103, 44, 188, 0.08)",
                minHeight: "220px"
              }}
            >
              {recentExpenditures.length === 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", color: "#8789A3" }}>
                  <Avatar sx={{ width: 44, height: 44, borderRadius: "5px", background: "rgba(255, 23, 68, 0.05)", mb: 1.5 }}>
                    <MoneyOffCsredRoundedIcon sx={{ color: "#ff5252", fontSize: "20px" }} />
                  </Avatar>
                  <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", fontWeight: "600" }}>No expenditures logged in {filterYear || 'All Years'}</Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {recentExpenditures.map((exp) => (
                    <Box 
                      key={exp.id} 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        p: 1.25,
                        borderRadius: "5px",
                        backgroundColor: "#fafafa",
                        borderLeft: "4px solid #ff5252",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "#fff5f5"
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: "5px",
                            fontSize: "12px", 
                            fontWeight: "700",
                            fontFamily: "Poppins",
                            background: "rgba(255, 82, 82, 0.1)",
                            color: "#ff5252"
                          }}
                        >
                          {exp.category.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12.5px", fontWeight: "700", color: "#240F4F" }}>
                            {exp.category}
                          </Typography>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "10.5px", color: "#8789A3" }}>
                            {exp.day}/{exp.month}/{exp.year} {exp.description && `• ${exp.description}`}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography 
                          sx={{ 
                            fontFamily: "Poppins", 
                            fontSize: "13.5px", 
                            fontWeight: "800", 
                            color: "#ff5252",
                            mr: 1
                          }}
                        >
                          - ₹{exp.amount}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleEditExpenditureClick(exp)}
                          sx={{ 
                            color: "#8789A3",
                            "&:hover": { color: "#672CBC" }
                          }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteExpenditure(exp.id)}
                          sx={{ 
                            color: "#8789A3",
                            "&:hover": { color: "#ff5252" }
                          }}
                        >
                          <DeleteRoundedIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <EditExpenditure
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        expenditure={selectedExpenditure}
        onSuccess={fetchData}
      />
    </Container>
  );
};

export default Dashboard;
