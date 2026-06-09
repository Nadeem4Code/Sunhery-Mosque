import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import axios from "axios";

import { auth, logInWithEmailAndPassword } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [checkingRole, setCheckingRole] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      setCheckingRole(true);
      axios.get(`http://localhost:3001/books/uid/${user.uid}`)
        .then((res) => {
          const mongoUser = res.data;
          if (mongoUser.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate(`/user/${mongoUser.id}`);
          }
        })
        .catch((err) => {
          console.error("Error checking role:", err);
          alert("Account error: Could not verify role. Please contact admin.");
        })
        .finally(() => {
          setCheckingRole(false);
        });
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    if (!email) {
      alert("Please enter Phone Number or Email");
      return;
    }
    if (!password) {
      alert("Please enter password");
      return;
    }

    const cleanInput = email.trim();
    const isEmail = cleanInput.includes("@");
    const isPhone = /^\d{10}$/.test(cleanInput);

    if (!isEmail && !isPhone) {
      alert("Please enter a valid email or 10-digit phone number");
      return;
    }

    const loginIdentifier = isEmail ? cleanInput : `${cleanInput}@jama-masjid.com`;
    
    try {
      await logInWithEmailAndPassword(loginIdentifier, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  if (loading || checkingRole) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <Card
          style={{
            height: "450px",

            width: "300px",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography
              style={{
                height: "48.3px",

                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "36px",
                lineHeight: "44px",
                textAlign: "center",

                color: "#000000",
                marginTop: "40px",
                marginBottom: "20px",
              }}
            >
              Login
            </Typography>
            <Typography
              style={{
                height: "20.86px",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "16px",
                lineHeight: "19px",
                marginBottom: "10px",
              }}
            >
              Phone Number or Email
            </Typography>
            <TextField
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "250px",
                height: "43.91px",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "16px",
                lineHeight: "19px",
              }}
              type="text"
              placeholder="Phone or Email"
            />
            <Typography
              style={{
                height: "20.86px",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "16px",
                lineHeight: "19px",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              Password
            </Typography>
            <TextField
              variant="standard"
              style={{
                width: "250px",
                height: "43.91px",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "16px",
                lineHeight: "19px",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <Link
                to="/reset"
                style={{
                  width: "250px",
                  height: "20.86px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "19px",
                  /* Link */
                  color: "gray",
                  textDecoration: "none",
                  marginTop: "20px",
                }}
              >
                Forgot Password?
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={handleLogin}
                variant="contained"
                style={{
                  textTransform: "none",
                  width: "250px",
                  height: "43.91px",
                  background: "linear-gradient(45deg, #dd47f9, #6fc9e0)",
                  borderRadius: "10px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                LOGIN
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
