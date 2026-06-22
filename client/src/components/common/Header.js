import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../../config/firebase";
import axios from "axios";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import menu from "../../assets/icons/menu.svg";
import logo from "../../assets/icons/logo.svg";

const Header = () => {
  const location = useLocation();
  const [user] = useAuthState(auth);
  const [mongoUser, setMongoUser] = React.useState(() => {
    const saved = localStorage.getItem("mongoUser");
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  React.useEffect(() => {
    if (user) {
      const isAdminEmail = user.email === "7457861116@jama-masjid.com";
      axios
        .get(`http://localhost:3001/books/uid/${user.uid}`)
        .then((res) => {
          let data = res.data;
          // Force update in case role or userName is incorrect for admin
          if (isAdminEmail && (data.role !== "admin" || data.userName !== "Mohd Nadeem")) {
            axios.put(`http://localhost:3001/books/${data.id}`, {
              ...data,
              userName: "Mohd Nadeem",
              role: "admin",
              phoneNumber: "7457861116"
            })
            .then((updateRes) => {
              setMongoUser(updateRes.data);
              localStorage.setItem("mongoUser", JSON.stringify(updateRes.data));
            })
            .catch((updateErr) => {
              console.error("Failed to update admin details in Header:", updateErr);
              setMongoUser(data);
              localStorage.setItem("mongoUser", JSON.stringify(data));
            });
          } else {
            setMongoUser(data);
            localStorage.setItem("mongoUser", JSON.stringify(data));
          }
        })
        .catch((err) => {
          console.error("Header check failed:", err);
          if (err.response && err.response.status === 404) {
            // Auto-register in MongoDB as admin or standard user
            const regData = {
              uid: user.uid,
              userName: isAdminEmail ? "Mohd Nadeem" : (user.displayName || (user.email ? user.email.split("@")[0] : "Standard User")),
              email: user.email || `${user.uid}@jama-masjid.com`,
              role: isAdminEmail ? "admin" : "user",
              phoneNumber: isAdminEmail ? "7457861116" : (user.phoneNumber || "0000000000"),
              fatherName: ""
            };
            axios.post("http://localhost:3001/books/register", regData)
              .then((regRes) => {
                setMongoUser(regRes.data);
                localStorage.setItem("mongoUser", JSON.stringify(regRes.data));
              })
              .catch((regErr) => {
                console.error("Header auto-registration failed:", regErr);
              });
          }
        });
    } else {
      setMongoUser(null);
      localStorage.removeItem("mongoUser");
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isDashboard = location.pathname === "/dashboard";

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
                color: "#240F4F",
                textDecoration: "none",
                gap: 1
              }}
            >
              <img
                src={logo}
                style={{ width: "30px", height: "30px" }}
                alt="Logo"
              />
              Sunheri Mosque
            </Typography>

            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ p: 1 }}
              >
                <img
                  src={menu}
                  alt="menu"
                  style={{ width: "24px", height: "24px" }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/"); }}>
                  <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "500" }}>Home</Typography>
                </MenuItem>

                <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/donation"); }}>
                  <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "500" }}>Donate</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/showUserPublic"); }}>
                  <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "500" }}>Donors</Typography>
                </MenuItem>
                {user && mongoUser && mongoUser.role === "admin" && (
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/dashboard"); }}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#672CBC" }}>Dashboard</Typography>
                  </MenuItem>
                )}
                {user && mongoUser && mongoUser.role === "user" && (
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate(`/user/${mongoUser.id}`); }}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#672CBC" }}>My Profile</Typography>
                  </MenuItem>
                )}
              </Menu>
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
                color: "#672CBC",
                textDecoration: "none",
                alignItems: "center",
                gap: 1
              }}
            >
              <img
                src={logo}
                style={{ width: "24px", height: "24px" }}
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
