import React, { useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Drawer,
  Divider,
  Avatar,
  ButtonBase
} from "@mui/material";
import { logout } from "../../config/firebase";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/BooksContext";

// Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

import logo from "../../assets/icons/logo.svg";

const Header = () => {
  const location = useLocation();
  const { user, mongoUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isDashboard = location.pathname === "/dashboard";

  const navItems = [
    { text: "Home", path: "/", icon: <HomeRoundedIcon sx={{ color: "#672CBC" }} /> },
    { text: "Donate", path: "/donation", icon: <FavoriteIcon sx={{ color: "#672CBC" }} /> },
    { text: "Donors", path: "/showUserPublic", icon: <GroupRoundedIcon sx={{ color: "#672CBC" }} /> },
  ];

  if (isDashboard) {
    return <Outlet />;
  }

  return (
    <>
      <AppBar
        position="fixed"
        style={{ backgroundColor: "white", color: "black", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Desktop Brand Logo & Name */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: "22px",
                color: "#240F4F",
                textDecoration: "none",
                gap: 1.2
              }}
            >
              <img
                src={logo}
                style={{ width: "36px", height: "36px" }}
                alt="Logo"
              />
              Sunheri Mosque
            </Typography>

            {/* Mobile Menu Icon & Drawer */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  p: 1,
                  bgcolor: "rgba(0, 0, 0, 0.03)",
                  color: "black",
                  borderRadius: "8px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.08)",
                  }
                }}
              >
                <MenuRoundedIcon sx={{ fontSize: "24px" }} />
              </IconButton>
              
              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                  sx: {
                    width: 280,
                    bgcolor: "#ffffff",
                    boxShadow: "4px 0 24px rgba(36, 15, 79, 0.15)",
                    borderRight: "1px solid rgba(0, 0, 0, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    p: 2.5
                  }
                }}
              >
                {/* Drawer Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={logo}
                      style={{ width: "30px", height: "30px" }}
                      alt="Logo"
                    />
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "800",
                        fontSize: "17px",
                        color: "#240F4F",
                        letterSpacing: "0.2px"
                      }}
                    >
                      Sunheri Mosque
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={handleDrawerToggle}
                    sx={{ 
                      color: "#8789A3", 
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.08)" }
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 2.5, borderColor: "rgba(0, 0, 0, 0.06)" }} />

                {/* User Info inside Sidebar */}
                {user && mongoUser && (
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 1.5, 
                      mb: 3, 
                      p: 2, 
                      bgcolor: "rgba(103, 44, 188, 0.04)", 
                      borderRadius: "12px",
                      border: "1px solid rgba(103, 44, 188, 0.06)",
                      textAlign: "left"
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 42, 
                        height: 42, 
                        bgcolor: "#672CBC", 
                        fontFamily: "Poppins", 
                        fontWeight: "700", 
                        fontSize: "16px",
                        boxShadow: "0 4px 10px rgba(103, 44, 188, 0.2)"
                      }}
                    >
                      {mongoUser.userName ? mongoUser.userName.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography 
                        noWrap
                        sx={{ 
                          fontFamily: "Poppins", 
                          fontSize: "10px", 
                          fontWeight: "600", 
                          color: "#8789A3", 
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}
                      >
                        Assalamu Alaikum
                      </Typography>
                      <Typography 
                        noWrap
                        sx={{ 
                          fontFamily: "Poppins", 
                          fontSize: "15px", 
                          fontWeight: "700", 
                          color: "#240F4F" 
                        }}
                      >
                        {mongoUser.userName}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Navigation Items */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <ButtonBase
                        key={item.text}
                        onClick={() => {
                          handleDrawerToggle();
                          navigate(item.path);
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          width: "100%",
                          py: 1.5,
                          px: 2,
                          borderRadius: "10px",
                          bgcolor: isActive ? "rgba(103, 44, 188, 0.08)" : "transparent",
                          color: isActive ? "#672CBC" : "#240F4F",
                          justifyContent: "flex-start",
                          transition: "all 0.2s",
                          "&:hover": { 
                            bgcolor: isActive ? "rgba(103, 44, 188, 0.12)" : "rgba(103, 44, 188, 0.04)" 
                          }
                        }}
                      >
                        {item.icon}
                        <Typography 
                          sx={{ 
                            fontFamily: "Poppins", 
                            fontSize: "14.5px", 
                            fontWeight: isActive ? "700" : "600" 
                          }}
                        >
                          {item.text}
                        </Typography>
                      </ButtonBase>
                    );
                  })}

                  {/* Role-based Dashboard/Profile Links */}
                  {user && mongoUser && mongoUser.role === "admin" && (
                    <ButtonBase
                      onClick={() => {
                        handleDrawerToggle();
                        navigate("/dashboard");
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        py: 1.5,
                        px: 2,
                        borderRadius: "10px",
                        bgcolor: location.pathname === "/dashboard" ? "rgba(103, 44, 188, 0.08)" : "transparent",
                        color: "#672CBC",
                        justifyContent: "flex-start",
                        transition: "all 0.2s",
                        "&:hover": { 
                          bgcolor: "rgba(103, 44, 188, 0.04)" 
                        }
                      }}
                    >
                      <DashboardRoundedIcon sx={{ color: "#672CBC" }} />
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "14.5px", fontWeight: "700" }}>
                        Dashboard
                      </Typography>
                    </ButtonBase>
                  )}

                  {user && mongoUser && mongoUser.role === "user" && (
                    <ButtonBase
                      onClick={() => {
                        handleDrawerToggle();
                        navigate(`/user/${mongoUser.id}`);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        py: 1.5,
                        px: 2,
                        borderRadius: "10px",
                        bgcolor: location.pathname.startsWith("/user/") ? "rgba(103, 44, 188, 0.08)" : "transparent",
                        color: "#672CBC",
                        justifyContent: "flex-start",
                        transition: "all 0.2s",
                        "&:hover": { 
                          bgcolor: "rgba(103, 44, 188, 0.04)" 
                        }
                      }}
                    >
                      <PersonRoundedIcon sx={{ color: "#672CBC" }} />
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "14.5px", fontWeight: "700" }}>
                        My Profile
                      </Typography>
                    </ButtonBase>
                  )}
                </Box>

                <Divider sx={{ my: 2.5, borderColor: "rgba(0, 0, 0, 0.06)" }} />

                {/* Action Button */}
                <Box>
                  {user ? (
                    <Button
                      onClick={() => {
                        handleDrawerToggle();
                        handleLogout();
                      }}
                      variant="outlined"
                      fullWidth
                      startIcon={<ExitToAppRoundedIcon />}
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "700",
                        fontSize: "13.5px",
                        borderColor: "#ff5252",
                        color: "#ff5252",
                        textTransform: "none",
                        py: 1.2,
                        borderRadius: "10px",
                        "&:hover": {
                          borderColor: "#e04040",
                          color: "#e04040",
                          backgroundColor: "rgba(255, 82, 82, 0.04)"
                        }
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleDrawerToggle();
                        navigate("/login");
                      }}
                      variant="contained"
                      fullWidth
                      startIcon={<LoginRoundedIcon />}
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: "700",
                        fontSize: "13.5px",
                        background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                        color: "white",
                        textTransform: "none",
                        py: 1.2,
                        borderRadius: "10px",
                        boxShadow: "0 4px 14px rgba(144, 85, 255, 0.25)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #9055FF 0%, #DF98FA 100%)",
                          boxShadow: "none"
                        }
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                </Box>
              </Drawer>
            </Box>

            {/* Mobile Brand Name */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: "19px",
                color: "#240F4F",
                textDecoration: "none",
                alignItems: "center",
                gap: 1.2
              }}
            >
              <img
                src={logo}
                style={{ width: "30px", height: "30px" }}
                alt="Logo"
              />
              Sunheri Mosque
            </Typography>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1.5 }}>
              <Button onClick={() => navigate("/")} sx={{ fontFamily: "Poppins", color: "#240F4F", fontWeight: "600", fontSize: "13.5px", textTransform: "none", px: 1.5 }}>
                Home
              </Button>
              
              <Button onClick={() => navigate("/donation")} sx={{ fontFamily: "Poppins", color: "#240F4F", fontWeight: "600", fontSize: "13.5px", textTransform: "none", px: 1.5 }}>
                Donate
              </Button>
              <Button onClick={() => navigate("/showUserPublic")} sx={{ fontFamily: "Poppins", color: "#240F4F", fontWeight: "600", fontSize: "13.5px", textTransform: "none", px: 1.5 }}>
                Donors
              </Button>

              {user && mongoUser && mongoUser.role === "admin" && (
                <Button onClick={() => navigate("/dashboard")} sx={{ fontFamily: "Poppins", color: "#672CBC", fontWeight: "700", fontSize: "13.5px", textTransform: "none", px: 1.5 }}>
                  Dashboard
                </Button>
              )}

              {user && mongoUser && mongoUser.role === "user" && (
                <Button onClick={() => navigate(`/user/${mongoUser.id}`)} sx={{ fontFamily: "Poppins", color: "#672CBC", fontWeight: "700", fontSize: "13.5px", textTransform: "none", px: 1.5 }}>
                  My Profile
                </Button>
              )}
            </Box>

            {/* User Auth Control Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {user && mongoUser ? (
                <>
                  <Typography sx={{ display: { xs: "none", sm: "block" }, fontFamily: "Poppins", fontSize: "13px", fontWeight: "600", color: "#240F4F" }}>
                    Assalamu Alaikum, {mongoUser.userName}
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: "12px",
                      borderColor: "#ff5252",
                      color: "#ff5252",
                      textTransform: "none",
                      px: 2,
                      py: 0.5,
                      borderRadius: "6px",
                      "&:hover": {
                        borderColor: "#e04040",
                        color: "#e04040",
                        backgroundColor: "rgba(255, 82, 82, 0.04)"
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  variant="contained"
                  size="small"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "700",
                    fontSize: "12px",
                    background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                    color: "white",
                    textTransform: "none",
                    px: 2.5,
                    py: 0.75,
                    borderRadius: "6px",
                    boxShadow: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #9055FF 0%, #DF98FA 100%)",
                      boxShadow: "none"
                    }
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
      <Outlet />
    </>
  );
};

export default Header;
