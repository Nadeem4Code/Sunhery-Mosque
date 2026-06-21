import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

// Importing from the firebase file

import { auth,registerWithEmailAndPassword,signInWithGoogleAsAdmin } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  const handleGoogleRegister = async () => {
    if (adminKey !== "ADMIN123") {
      alert("Invalid Admin Registration Key! Only administrators can register here. If you are a donor, please use the donation page.");
      return;
    }
    try {
      await signInWithGoogleAsAdmin();
    } catch (err) {
      console.error("Google Admin Register failed:", err);
    }
  };

  const register = () => {
    if (!name) {
      alert("Please enter name");
      return;
    }
    if (!email) {
      alert("Please enter email");
      return;
    }
    if (!password) {
      alert("Please enter password");
      return;
    }
    if (adminKey !== "ADMIN123") {
      alert("Invalid Admin Registration Key! Only administrators can register here. If you are a donor, please use the donation page.");
      return;
    }
    registerWithEmailAndPassword(name, email, password, "admin");
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ boxShadow: "none" }}>
        <CardContent>
          <div>
            <Typography
              style={{
                fontFamily: "Montserrat",
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "32px",
                lineHeight: "44px",
                color: "#672CBC",
              }}
            >
              Admin Register
            </Typography>
          </div>
          <Typography
            style={{
              marginTop: "5px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: "15px",
              color: "#d32f2f",
            }}
          >
            ⚠️ Authorized Administrators Only
          </Typography>
          <Typography
            style={{
              marginTop: "10px",
              maxWidth: "420px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "13px",
              color: "#666",
            }}
          >
            Standard user registration is disabled. Donors can create accounts only while making an online donation on the <Link to="/donation" style={{ color: "#672CBC", fontWeight: "600", textDecoration: "none" }}>Donation Page</Link>.
          </Typography>
          <div style={{ marginTop: "20px" }}>
            <Button
              onClick={handleGoogleRegister}
              variant="contained"
              style={{
                background: "#FFFFFF",
                borderRadius: "10px",
                fontFamily: "Montserrat",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "15px",
                width: "197.6px",
                height: "32.93px",
                /* Secondary Text */
                color: "#858585",
                textTransform: "none",
              }}
            >
              <img
                src="/icons/google.svg"
                alt="Google"
                style={{
                  width: "15.37px",
                  height: "15.37px",
                  marginRight: "10px",
                }}
              />
              Register With google
            </Button>
            <Button
              variant="contained"
              style={{
                background: "#FFFFFF",
                borderRadius: "10px",
                fontFamily: "Montserrat",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "15px",
                width: "197.6px",
                height: "32.93px",
                /* Secondary Text */
                color: "#858585",
                textTransform: "none",
                marginLeft: "28px",
              }}
            >
              <img
                src="/icons/apple.svg"
                alt="Apple"
                style={{
                  width: "15.37px",
                  height: "15.37px",
                  marginRight: "10px",
                }}
              />
              Register With Apple
            </Button>
          </div>
          <Card
            style={{
              width: "422.64px",

              background: "#FFFFFF",
              borderRadius: "20px",
              marginTop: "40px",
            }}
          >
            <CardContent style={{ margin: "auto", marginTop: "20px" }}>
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
                Full Name
              </Typography>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "356.77px",
                  height: "43.91px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "19px",
                  background: "#F5F5F5",
                  borderRadius: "10px",
                  border: "2px solid #F5F5F5",
                  paddingLeft: "20px",
                }}
                type="text"
                placeholder="Full Name"
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
                Email address
              </Typography>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "356.77px",
                  height: "43.91px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "19px",
                  background: "#F5F5F5",
                  borderRadius: "10px",
                  border: "2px solid #F5F5F5",
                  paddingLeft: "20px",
                }}
                type="value"
                placeholder="Email"
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
              <input
                style={{
                  width: "356.77px",
                  height: "43.91px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "19px",
                  background: "#F5F5F5",
                  borderRadius: "10px",
                  border: "2px solid #F5F5F5",
                  paddingLeft: "20px",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
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
                Admin Access Key
              </Typography>
              <input
                style={{
                  width: "356.77px",
                  height: "43.91px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "19px",
                  background: "#F5F5F5",
                  borderRadius: "10px",
                  border: "2px solid #F5F5F5",
                  paddingLeft: "20px",
                }}
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                type="password"
                placeholder="Admin Access Key"
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={register}
                  variant="contained"
                  style={{
                    textTransform: "none",
                    background: "#4285F4",
                    borderRadius: "10px",
                    width: "356.77px",
                    height: "43.91px",
                    marginTop: "20px",
                  }}
                >
                  Register
                </Button>
              </div>
              <Typography
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  height: "20.86px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "19px",
                  color: "#858585",
                }}
              >
                Already have an account
                <Link
                  to="/"
                  style={{
                    color: "#4285F4",
                    textDecoration: "none",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
