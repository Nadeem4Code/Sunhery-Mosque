import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, CircularProgress, Box, Grid, TextField, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, logInWithEmailAndPassword, registerUserBeforePayment } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Login = () => {
  const [mode, setMode] = useState("register"); // "register" (default for public users) or "login"
  const [user, loading] = useAuthState(auth);
  const [checkingRole, setCheckingRole] = useState(false);

  // Register Fields
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regFatherName, setRegFatherName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  // Login Fields
  const [loginInput, setLoginInput] = useState(""); // Phone number or email
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    if (loading) return;
    if (user) {
      setCheckingRole(true);
      const isAdminPhone = user.email === "7457861116@jama-masjid.com" || user.phoneNumber === "+917457861116" || user.phoneNumber === "7457861116";
      axios.get(`http://localhost:3001/books/uid/${user.uid}`)
        .then((res) => {
          let mongoUser = res.data;
          if (isAdminPhone && (mongoUser.role !== "admin" || mongoUser.userName !== "Mohd Nadeem")) {
            // Force update user in MongoDB to reflect admin role and name
            axios.put(`http://localhost:3001/books/${mongoUser.id}`, {
              ...mongoUser,
              userName: "Mohd Nadeem",
              role: "admin",
              phoneNumber: "7457861116"
            })
            .then((updateRes) => {
              localStorage.setItem("mongoUser", JSON.stringify(updateRes.data));
              navigate("/dashboard");
            })
            .catch((updateErr) => {
              console.error("Failed to force update admin user details:", updateErr);
              localStorage.setItem("mongoUser", JSON.stringify(mongoUser));
              navigate("/dashboard");
            })
            .finally(() => {
              setCheckingRole(false);
            });
          } else {
            localStorage.setItem("mongoUser", JSON.stringify(mongoUser));
            if (mongoUser.role === "admin") {
              navigate("/dashboard");
            } else {
              navigate(`/user/${mongoUser.id}`);
            }
            setCheckingRole(false);
          }
        })
        .catch((err) => {
          console.error("Error checking role:", err);
          if (err.response && err.response.status === 404) {
            // Auto-register in MongoDB as admin or standard user
            axios.post("http://localhost:3001/books/register", {
              uid: user.uid,
              userName: isAdminPhone ? "Mohd Nadeem" : (user.displayName || (user.email ? user.email.split("@")[0] : "Standard User")),
              email: user.email || `${user.uid}@jama-masjid.com`,
              role: isAdminPhone ? "admin" : "user",
              phoneNumber: isAdminPhone ? "7457861116" : (user.phoneNumber || "0000000000"),
              fatherName: ""
            })
            .then((regRes) => {
              localStorage.setItem("mongoUser", JSON.stringify(regRes.data));
              if (isAdminPhone || regRes.data.role === "admin") {
                navigate("/dashboard");
              } else {
                navigate(`/user/${regRes.data.id}`);
              }
            })
            .catch((regErr) => {
              console.error("Auto-registration failed:", regErr);
              alert("Account error: Could not sync user profile. Please contact admin.");
            })
            .finally(() => {
              setCheckingRole(false);
            });
          } else {
            alert("Account error: Could not verify role. Please contact admin.");
            setCheckingRole(false);
          }
        });
    }
  }, [user, loading, navigate]);

  // Handle phone changes and truncate to 10 digits
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (val.length > 10) val = val.slice(0, 10);
    setRegPhone(val);
    setPhoneError(val.length !== 10 && val.length > 0);
  };

  // Register public user submit
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName) {
      alert("Please enter your name");
      return;
    }
    if (regPhone.length !== 10) {
      setPhoneError(true);
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setCheckingRole(true);
    try {
      const mappedEmail = `${regPhone}@jama-masjid.com`;
      await registerUserBeforePayment(regName, mappedEmail, regPassword, regPhone, regFatherName);
      // Success will trigger useAuthState redirection above
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.message || "Failed to register. Phone number or email may already be in use.");
      setCheckingRole(false);
    }
  };

  // Login submit (handles standard login and hardcoded admin credential interception)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginInput) {
      alert("Please enter Phone Number or Email");
      return;
    }
    if (!loginPassword) {
      alert("Please enter password");
      return;
    }

    const cleanInput = loginInput.trim();
    const isEmail = cleanInput.includes("@");
    const isPhone = /^\d{10}$/.test(cleanInput);

    if (!isEmail && !isPhone) {
      alert("Please enter a valid email or 10-digit phone number");
      return;
    }

    const loginIdentifier = isEmail ? cleanInput : `${cleanInput}@jama-masjid.com`;
    setCheckingRole(true);

    // 1. Intercept hardcoded Admin credentials (7457861116 / Nadeem333)
    if ((cleanInput === "7457861116" || cleanInput === "7457861116@jama-masjid.com") && loginPassword === "Nadeem333") {
      try {
        await logInWithEmailAndPassword(loginIdentifier, loginPassword);
        // Success redirects via useAuthState hook above
      } catch (err) {
        // If login failed because user doesn't exist, auto-create this admin
        if (err.code === "auth/user-not-found" || (err.message && err.message.toLowerCase().includes("user-not-found"))) {
          try {
            console.log("Admin account not found in Firebase. Auto-initializing...");
            const { createUserWithEmailAndPassword } = await import("firebase/auth");
            const res = await createUserWithEmailAndPassword(auth, loginIdentifier, loginPassword);
            const adminUser = res.user;

            // Create in MongoDB as admin
            const regRes = await axios.post("http://localhost:3001/books/register", {
              uid: adminUser.uid,
              userName: "Mohd Nadeem",
              email: loginIdentifier,
              role: "admin",
              phoneNumber: "7457861116",
              fatherName: ""
            });
            localStorage.setItem("mongoUser", JSON.stringify(regRes.data));
            navigate("/dashboard");
          } catch (createErr) {
            console.error("Failed to auto-create admin account:", createErr);
            alert("Admin initialization failed. Please contact support.");
          } finally {
            setCheckingRole(false);
          }
        } else {
          alert("Login failed: " + err.message);
          setCheckingRole(false);
        }
      }
      return;
    }

    // 2. Standard user login flow
    try {
      await logInWithEmailAndPassword(loginIdentifier, loginPassword);
    } catch (err) {
      console.error("Login failed:", err);
      setCheckingRole(false);
    }
  };

  if (loading || checkingRole) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
          background: "linear-gradient(180deg, #F9F9FB 0%, #F1EEF6 100%)",
          minHeight: "85vh",
        }}
      >
        <Card
          sx={{
            maxWidth: "480px",
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(103, 44, 188, 0.08)",
            overflow: "hidden",
            border: "1px solid rgba(187, 196, 206, 0.35)",
          }}
        >
          {/* Header Block matching Home Page Theme */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #863ED5 0%, #240F4F 100%)",
              color: "#ffffff",
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 1 }} />
            <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 1.2 }} />
            <Skeleton variant="text" width="85%" height={20} sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: "4px" }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: "4px" }} />
              <Skeleton variant="rectangular" height={45} sx={{ borderRadius: "12px", mt: 1 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #F9F9FB 0%, #F1EEF6 100%)",
        minHeight: "85vh",
      }}
    >
      <Card
        sx={{
          maxWidth: "480px",
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(103, 44, 188, 0.08)",
          overflow: "hidden",
          border: "1px solid rgba(187, 196, 206, 0.35)",
        }}
      >
        {/* Header Block matching Home Page Theme */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #863ED5 0%, #240F4F 100%)",
            color: "#ffffff",
            p: 4,
            textAlign: "center",
          }}
        >
          {mode === "register" ? (
            <AccountCircleIcon sx={{ fontSize: "40px", mb: 1 }} />
          ) : (
            <LockIcon sx={{ fontSize: "40px", mb: 1 }} />
          )}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "24px",
              lineHeight: 1.2,
            }}
          >
            {mode === "register" ? "Donor Registration" : "Portal Sign In"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "13px",
              opacity: 0.85,
              mt: 1.2,
              lineHeight: 1.4,
            }}
          >
            {mode === "register"
              ? "Create a public account to track your donations and download official tax receipts."
              : "Sign in to access your donation history or admin dashboard."}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Register Mode Form */}
          {mode === "register" ? (
            <form onSubmit={handleRegister}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                    inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    required
                    type="number"
                    value={regPhone}
                    onChange={handlePhoneChange}
                    error={phoneError}
                    helperText={phoneError ? "Must be a 10-digit number" : ""}
                    InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                    inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Father's Name (Optional)"
                    variant="outlined"
                    value={regFatherName}
                    onChange={(e) => setRegFatherName(e.target.value)}
                    InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                    inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Choose Password"
                    variant="outlined"
                    required
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                    inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px", minLength: 6 } }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: "15px",
                  padding: "12px",
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "none",
                  mt: 3.5,
                  "&:hover": {
                    background: "linear-gradient(135deg, #9055FF 0%, #DF98FA 100%)",
                    boxShadow: "none",
                  },
                }}
              >
                Register Account
              </Button>
            </form>
          ) : (
            /* Login Mode Form */
            <form onSubmit={handleLoginSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number or Email"
                    variant="outlined"
                    required
                    placeholder="e.g. 7457861116"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                    inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    required
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                    inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  fontSize: "15px",
                  padding: "12px",
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "none",
                  mt: 3.5,
                  "&:hover": {
                    background: "linear-gradient(135deg, #9055FF 0%, #DF98FA 100%)",
                    boxShadow: "none",
                  },
                }}
              >
                Sign In
              </Button>
            </form>
          )}

          {/* Toggle Option Link */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "13.5px",
              color: "#8789A3",
              textAlign: "center",
              mt: 3.5,
            }}
          >
            {mode === "register" ? "Already have an account?" : "Need a public donor account?"}{" "}
            <span
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
              }}
              style={{
                color: "#9055FF",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {mode === "register" ? "Sign In" : "Register Now"}
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
