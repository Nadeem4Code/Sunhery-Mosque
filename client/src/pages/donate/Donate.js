import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import dayjs from "dayjs";
import axios from "axios";
import { 
  createTask, 
  registerNormalUserWithDonation, 
  logInWithEmailAndPassword, 
  auth,
  registerUserBeforePayment,
  logDonationForLoggedInUser
} from "../../config/firebase";
import logo from "../../assets/icons/logo.svg";

const API_URL = "http://localhost:3001/books";

// Helper function to load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Donate = () => {
  // Wizard step state: 1 = Form Details, 2 = Account Setup, 3 = Receipt
  const [step, setStep] = useState(1);
  const [activeAuthTab, setActiveAuthTab] = useState(0); // 0 = Register, 1 = Login

  // Personal Info (Step 1)
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fatherName, setFatherName] = useState("");

  // Donation Details (Step 1)
  const [purpose, setPurpose] = useState("mosque"); // 'mosque' or 'imam'
  const [amount, setAmount] = useState("");

  // Account Creation / Login Info (Step 2)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Status states
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Helper validation
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Sync details from current user if logged in
  useEffect(() => {
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || "");
      setEmail(auth.currentUser.email || "");
    }
  }, []);

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (val.length > 10) val = val.slice(0, 10);
    setPhoneNumber(val);
    setPhoneError(val.length !== 10 && val.length > 0);
  };

  const handleQuickAmount = (val) => {
    setAmount(val);
  };

  // Step 1 Submit Handler (Checks login and routes to payment or Step 2)
  const handleStep1Next = (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      setPhoneError(true);
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    // If already logged in, go straight to payment gateway
    if (auth.currentUser) {
      handlePaymentFlow(false);
    } else {
      // Proceed to Step 2 (Register / Login / Guest choices)
      setStep(2);
    }
  };

  // Step 2 Login Handler
  const handleLoginNext = async (e) => {
    e.preventDefault();
    
    const cleanInput = email.trim();
    const isEmail = cleanInput.includes("@");
    const isPhone = /^\d{10}$/.test(cleanInput);

    if (!isEmail && !isPhone) {
      setEmailError(true);
      return;
    }

    setIsProcessing(true);
    try {
      const loginIdentifier = isEmail ? cleanInput : `${cleanInput}@jama-masjid.com`;
      await logInWithEmailAndPassword(loginIdentifier, password);
      // Login successful! Trigger payment
      await handlePaymentFlow(false);
    } catch (err) {
      console.error("Login failed", err);
      alert(err.message || "Failed to login. Please check your credentials.");
      setIsProcessing(false);
    }
  };

  // Step 2 Register Handler
  const handleRegisterNext = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number in Step 1.");
      setStep(1);
      return;
    }

    setIsProcessing(true);
    try {
      // Map phone number to email format under the hood
      const mappedEmail = `${phoneNumber}@jama-masjid.com`;
      // Create user auth and MongoDB profile before collecting payment
      await registerUserBeforePayment(userName, mappedEmail, password, phoneNumber, fatherName);
      // Trigger payment flow as logged in user
      await handlePaymentFlow(false);
    } catch (err) {
      console.error("Registration failed", err);
      alert(err.message || "Failed to register. Please check your credentials.");
      setIsProcessing(false);
    }
  };

  // Core Razorpay checkout integration
  const handlePaymentFlow = async (shouldCreateAccount = false, authEmail = "", authPassword = "") => {
    setIsProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setIsProcessing(false);
      alert("Failed to load payment gateway SDK. Please check your internet connection.");
      return;
    }

    const now = dayjs();
    const year = now.format("YYYY");
    const month = now.format("MM");
    const day = now.format("DD");

    try {
      // 1. Create order on the backend
      const orderRes = await axios.post(`${API_URL}/payment/order`, { amount: Number(amount) });
      const orderData = orderRes.data;

      // 2. Sandbox Mock Mode Fallback (no key configured)
      if (orderData.isSimulated) {
        console.log("Running in Sandbox Mock Mode");
        // Simulate a loader delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (shouldCreateAccount) {
          await registerNormalUserWithDonation(
            userName,
            authEmail,
            authPassword,
            phoneNumber,
            fatherName,
            purpose,
            amount,
            year,
            month,
            day
          );
        } else if (auth.currentUser) {
          await logDonationForLoggedInUser(
            auth.currentUser.uid,
            userName,
            phoneNumber,
            fatherName,
            purpose,
            amount,
            year,
            month,
            day
          );
        } else {
          await createTask(
            userName,
            phoneNumber,
            fatherName,
            year,
            month,
            day,
            Number(amount)
          );
        }

        setReceiptData({
          name: userName,
          phone: phoneNumber,
          amount: amount,
          purpose: purpose,
          date: now.format("DD MMM YYYY, hh:mm A"),
          transactionId: "MOCK_" + Math.floor(Math.random() * 90000000 + 10000000),
          accountCreated: shouldCreateAccount,
        });

        setStep(3); // Success Receipt
        setIsProcessing(false);
        return;
      }

      // 3. Real Checkout with Razorpay SDK
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Jama Masjid Donation",
        description: `Contribution for ${purpose === "mosque" ? "Masjid Maintenance" : "Imam Fund"}`,
        image: logo,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            setIsProcessing(true);
            // Verify payment signature on backend
            const verifyRes = await axios.post(`${API_URL}/payment/verify`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              if (shouldCreateAccount) {
                await registerNormalUserWithDonation(
                  userName,
                  authEmail,
                  authPassword,
                  phoneNumber,
                  fatherName,
                  purpose,
                  amount,
                  year,
                  month,
                  day
                );
              } else if (auth.currentUser) {
                await logDonationForLoggedInUser(
                  auth.currentUser.uid,
                  userName,
                  phoneNumber,
                  fatherName,
                  purpose,
                  amount,
                  year,
                  month,
                  day
                );
              } else {
                await createTask(
                  userName,
                  phoneNumber,
                  fatherName,
                  year,
                  month,
                  day,
                  Number(amount)
                );
              }

              setReceiptData({
                name: userName,
                phone: phoneNumber,
                amount: amount,
                purpose: purpose,
                date: now.format("DD MMM YYYY, hh:mm A"),
                transactionId: response.razorpay_payment_id,
                accountCreated: shouldCreateAccount,
              });

              setStep(3); // Success Receipt
            } else {
              alert("Payment verification failed. Please check with your bank or try again.");
            }
          } catch (error) {
            console.error("Donation recording/verification failed:", error);
            alert("Payment was processed, but we failed to verify or record your transaction. Please email support with Payment ID: " + response.razorpay_payment_id);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: userName,
          contact: phoneNumber,
          email: authEmail || (auth.currentUser ? auth.currentUser.email : ""),
        },
        notes: {
          fatherName: fatherName,
        },
        theme: {
          color: "#672CBC",
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Failed to initialize payment flow:", error);
      alert("Failed to connect to payment gateway. Please check if the backend is running.");
      setIsProcessing(false);
    }
  };

  // STEP 3: SUCCESS RECEIPT RENDER
  if (step === 3 && receiptData) {
    return (
      <Box
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Card
          style={{
            maxWidth: "500px",
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
            background: "#ffffff",
            textAlign: "center",
            padding: "24px",
            border: "1px solid rgba(187, 196, 206, 0.35)",
          }}
        >
          <CardContent>
            <CheckCircleOutlineIcon style={{ fontSize: "80px", color: "#4caf50" }} />
            <Typography
              style={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: "26px",
                color: "#1b5e20",
                marginTop: "10px",
              }}
            >
              Donation Successful!
            </Typography>
            <Typography
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                color: "#666",
                marginTop: "5px",
              }}
            >
              May Allah reward you for your generous contribution.
            </Typography>

            <Box
              style={{
                marginTop: "30px",
                backgroundColor: "#f9f9f9",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "left",
                border: "1px dashed #ccc",
              }}
            >
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#444" }}>
                <strong>Transaction ID:</strong> {receiptData.transactionId}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#444", marginTop: "8px" }}>
                <strong>Donor Name:</strong> {receiptData.name}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#444", marginTop: "8px" }}>
                <strong>Phone Number:</strong> {receiptData.phone}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#444", marginTop: "8px" }}>
                <strong>Amount:</strong> ₹{receiptData.amount}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#444", marginTop: "8px" }}>
                <strong>Purpose:</strong> For {receiptData.purpose === "mosque" ? "MOSQUE FUND" : "IMAM FUND"}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#444", marginTop: "8px" }}>
                <strong>Date & Time:</strong> {receiptData.date}
              </Typography>
              {receiptData.accountCreated && (
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "13px",
                    color: "#2e7d32",
                    backgroundColor: "#e8f5e9",
                    padding: "8px",
                    borderRadius: "5px",
                    marginTop: "15px",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  🎉 Account Created! You can now log in to track your donations.
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              onClick={() => {
                setStep(1);
                setReceiptData(null);
              }}
              style={{
                marginTop: "30px",
                background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)",
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: "600",
                padding: "10px 30px",
                boxShadow: "none",
              }}
              startIcon={<ArrowBackIcon />}
            >
              Donate Again
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      style={{
        marginTop: "24px",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        background: "linear-gradient(180deg, #F9F9FB 0%, #F1EEF6 100%)",
        minHeight: "85vh",
      }}
    >
      <Card
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "24px",
          boxShadow: "0 15px 35px rgba(103, 44, 188, 0.05)",
          overflow: "hidden",
          border: "1px solid rgba(187, 196, 206, 0.35)",
        }}
      >
        {/* Header Block */}
        <Box
          style={{
            background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)",
            color: "#ffffff",
            padding: "26px 20px",
            textAlign: "center",
          }}
        >
          <FavoriteIcon style={{ fontSize: "36px", marginBottom: "8px" }} />
          <Typography style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "22px" }}>
            Masjid Contribution Portal
          </Typography>
          <Typography style={{ fontFamily: "Poppins", fontSize: "13px", opacity: 0.9 }}>
            {step === 1 ? "Step 1: Fill Donation Details" : "Step 2: Choose Checkout Account"}
          </Typography>
        </Box>

        <CardContent style={{ padding: "28px" }}>
          {isProcessing ? (
            <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0" }}>
              <CircularProgress size={50} style={{ color: "#672CBC" }} />
              <Typography style={{ marginTop: "20px", fontFamily: "Poppins", fontWeight: "600", color: "#672CBC" }}>
                Connecting to Razorpay...
              </Typography>
              <Typography style={{ marginTop: "5px", fontFamily: "Poppins", fontSize: "13px", color: "#888" }}>
                Please do not refresh the page.
              </Typography>
            </Box>
          ) : (
            <>
              {/* STEP 1: FORM DETAILS */}
              {step === 1 && (
                <form onSubmit={handleStep1Next}>
                  {/* Purpose Selection Cards */}
                  <Box mb={3.5}>
                    <Typography
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#240F4F",
                        marginBottom: "12px",
                      }}
                    >
                      Select Donation Purpose
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card
                          onClick={() => setPurpose("mosque")}
                          sx={{
                            border: purpose === "mosque" ? "2px solid #863ED5" : "2px solid rgba(0,0,0,0.06)",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            transform: purpose === "mosque" ? "scale(1.02)" : "scale(1)",
                            backgroundColor: purpose === "mosque" ? "rgba(134, 62, 213, 0.04)" : "#fff",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#863ED5",
                            }
                          }}
                        >
                          <CardContent sx={{ textAlign: "center", p: 2, "&:last-child": { pb: 2 } }}>
                            <Typography sx={{ fontSize: "32px", mb: 0.5 }}>🕌</Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "13.5px", color: "#240F4F" }}>
                              Masjid Fund
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3", mt: 0.5 }}>
                              Maintenance & Bills
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={6}>
                        <Card
                          onClick={() => setPurpose("imam")}
                          sx={{
                            border: purpose === "imam" ? "2px solid #863ED5" : "2px solid rgba(0,0,0,0.06)",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            transform: purpose === "imam" ? "scale(1.02)" : "scale(1)",
                            backgroundColor: purpose === "imam" ? "rgba(134, 62, 213, 0.04)" : "#fff",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#863ED5",
                            }
                          }}
                        >
                          <CardContent sx={{ textAlign: "center", p: 2, "&:last-child": { pb: 2 } }}>
                            <Typography sx={{ fontSize: "32px", mb: 0.5 }}>👳</Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "13.5px", color: "#240F4F" }}>
                              Imam Fund
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3", mt: 0.5 }}>
                              Salaries & Welfare
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Personal Information */}
                  <Box mb={3.5}>
                    <Typography
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#672CBC",
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <AccountCircleIcon style={{ marginRight: "8px", fontSize: "20px" }} /> Personal Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Donor Name"
                          variant="outlined"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                          inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Father's Name"
                          variant="outlined"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                          inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          variant="outlined"
                          required
                          type="number"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          error={phoneError}
                          helperText={phoneError ? "Must be a 10-digit number" : ""}
                          InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                          inputProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Donation Amount */}
                  <Box mb={4}>
                    <Typography
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#672CBC",
                        marginBottom: "12px",
                      }}
                    >
                      Donation Amount (INR)
                    </Typography>
                    <TextField
                      fullWidth
                      label="Amount"
                      variant="outlined"
                      required
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                      inputProps={{ style: { fontFamily: "Poppins", fontSize: "15px", min: 1 } }}
                    />
                    <Box mt={1.5} style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {["500", "1000", "2000", "5000", "10000"].map((preset) => (
                        <Button
                          key={preset}
                          variant="outlined"
                          size="small"
                          onClick={() => handleQuickAmount(preset)}
                          sx={{
                            fontFamily: "Poppins",
                            color: "#672CBC",
                            borderColor: "rgba(103, 44, 188, 0.3)",
                            textTransform: "none",
                            borderRadius: "8px",
                            fontSize: "12px",
                            "&:hover": {
                              borderColor: "#672CBC",
                              backgroundColor: "#f1eef6",
                            },
                          }}
                        >
                          + ₹{Number(preset).toLocaleString()}
                        </Button>
                      ))}
                    </Box>
                  </Box>

                  {/* Proceed Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{
                      background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      fontSize: "16px",
                      padding: "12px",
                      borderRadius: "14px",
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Next: Proceed to Payment
                  </Button>
                </form>
              )}

              {/* STEP 2: AUTHENTICATION GATEWAY */}
              {step === 2 && (
                <Box>
                  <Button
                    onClick={() => setStep(1)}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      textTransform: "none",
                      color: "#672CBC",
                      fontFamily: "Poppins",
                      mb: 2,
                    }}
                  >
                    Back to details
                  </Button>

                  <Card 
                    sx={{ 
                      boxShadow: "none", 
                      border: "1px solid rgba(187, 196, 206, 0.35)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      mb: 3,
                    }}
                  >
                    <Tabs
                      value={activeAuthTab}
                      onChange={(e, val) => setActiveAuthTab(val)}
                      variant="fullWidth"
                      sx={{
                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                        "& .MuiTab-root": {
                          fontFamily: "Poppins",
                          fontWeight: "600",
                          fontSize: "13px",
                          color: "#240F4F",
                        },
                        "& .Mui-selected": {
                          color: "#672CBC !important",
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#672CBC",
                        }
                      }}
                    >
                      <Tab label="Create Account" />
                      <Tab label="Sign In" />
                    </Tabs>

                    <CardContent sx={{ p: 3 }}>
                      {activeAuthTab === 0 ? (
                        /* Register Panel */
                        <form onSubmit={handleRegisterNext}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12.5px", color: "#8789A3", mb: 2.5 }}>
                            Highly Recommended. Registering helps you view your overall payment history, download official tax receipts, and save your credentials for future prayers.
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Registering with Phone Number"
                                variant="outlined"
                                disabled
                                value={phoneNumber}
                                InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13px" } }}
                                inputProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Choose Password"
                                variant="outlined"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13px" } }}
                                inputProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px", minLength: 6 } }}
                              />
                            </Grid>
                          </Grid>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{
                              background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)",
                              fontFamily: "Poppins",
                              fontWeight: "600",
                              fontSize: "15px",
                              padding: "10px",
                              borderRadius: "10px",
                              textTransform: "none",
                              marginTop: "20px",
                              boxShadow: "none",
                            }}
                            startIcon={<LockIcon />}
                          >
                            Sign Up & Pay ₹{Number(amount).toLocaleString()}
                          </Button>
                        </form>
                      ) : (
                        /* Login Panel */
                        <form onSubmit={handleLoginNext}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12.5px", color: "#8789A3", mb: 2.5 }}>
                            Welcome back. Sign in to link this donation to your existing profile.
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Phone Number or Email"
                                variant="outlined"
                                required
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  setEmailError(false);
                                }}
                                error={emailError}
                                helperText={emailError ? "Please enter a valid 10-digit phone number or email" : ""}
                                InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13px" } }}
                                inputProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Password"
                                variant="outlined"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13px" } }}
                                inputProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                              />
                            </Grid>
                          </Grid>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{
                              background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)",
                              fontFamily: "Poppins",
                              fontWeight: "600",
                              fontSize: "15px",
                              padding: "10px",
                              borderRadius: "10px",
                              textTransform: "none",
                              marginTop: "20px",
                              boxShadow: "none",
                            }}
                            startIcon={<LockIcon />}
                          >
                            Sign In & Pay ₹{Number(amount).toLocaleString()}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>


                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Donate;
