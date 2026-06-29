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
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { 
  Building2, 
  HeartHandshake, 
  ContactRound, 
  Phone, 
  IndianRupee, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Receipt,
  Heart,
  ArrowLeft,
  ArrowRight,
  Lock,
  Coins,
  Wallet
} from "lucide-react";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
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
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.getElementById("razorpay-sdk");
    if (existingScript) {
      existingScript.onload = () => resolve(true);
      existingScript.onerror = () => resolve(false);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-sdk";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Donate = () => {
  // Wizard step state: 1 = Form Details, 2 = Account Setup, 3 = Receipt
  const [step, setStep] = useState(1);
  const [activeAuthTab, setActiveAuthTab] = useState(0); // 0 = Register, 1 = Login, 2 = Guest

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

  // Snackbar Toast states
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const triggerError = (msg) => {
    setErrorMessage(msg || "An unexpected error occurred. Please try again.");
    setShowError(true);
  };

  const pdfDownloadedRef = React.useRef("");

  const downloadPDFReceipt = (data) => {
    if (!data) return;
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
      });

      // Set border
      doc.setDrawColor(103, 44, 188); // Purple
      doc.setLineWidth(1);
      doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);

      // Inner double border
      doc.setLineWidth(0.3);
      doc.rect(7, 7, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 14);

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(36, 15, 79); // Dark purple
      doc.text("JAMA MASJID", doc.internal.pageSize.width / 2, 20, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Sunheri Mosque, Contribution Portal", doc.internal.pageSize.width / 2, 25, { align: "center" });

      // Separator
      doc.setDrawColor(220, 220, 220);
      doc.line(15, 30, doc.internal.pageSize.width - 15, 30);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(103, 44, 188);
      doc.text("DONATION RECEIPT", doc.internal.pageSize.width / 2, 40, { align: "center" });

      // Content
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      
      const startY = 52;
      const spacing = 8;

      doc.setFont("helvetica", "bold");
      doc.text("Transaction ID:", 15, startY);
      doc.setFont("helvetica", "normal");
      doc.text(data.transactionId, 50, startY);

      doc.setFont("helvetica", "bold");
      doc.text("Date & Time:", 15, startY + spacing);
      doc.setFont("helvetica", "normal");
      doc.text(data.date, 50, startY + spacing);

      doc.setFont("helvetica", "bold");
      doc.text("Donor Name:", 15, startY + spacing * 2);
      doc.setFont("helvetica", "normal");
      doc.text(data.name, 50, startY + spacing * 2);

      let adjustedY = startY + spacing * 3;
      if (data.fatherName) {
        doc.setFont("helvetica", "bold");
        doc.text("Father's Name:", 15, adjustedY);
        doc.setFont("helvetica", "normal");
        doc.text(data.fatherName, 50, adjustedY);
        adjustedY += spacing;
      }

      doc.setFont("helvetica", "bold");
      doc.text("Phone Number:", 15, adjustedY);
      doc.setFont("helvetica", "normal");
      doc.text(data.phone, 50, adjustedY);
      adjustedY += spacing;

      doc.setFont("helvetica", "bold");
      doc.text("Purpose:", 15, adjustedY);
      doc.setFont("helvetica", "normal");
      doc.text(data.purpose === "mosque" ? "Mosque Maintenance & Fund" : "Imam Salary & Welfare Fund", 50, adjustedY);
      adjustedY += spacing * 2;

      // Amount Box
      doc.setFillColor(241, 238, 246);
      doc.rect(15, adjustedY - 6, doc.internal.pageSize.width - 30, 12, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(103, 44, 188);
      doc.text("Amount Contributed:", 20, adjustedY + 1);
      doc.text(`INR ${Number(data.amount).toLocaleString()}.00`, doc.internal.pageSize.width - 20, adjustedY + 1, { align: "right" });

      // Gratitude
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("May Allah reward you for your generous contribution.", doc.internal.pageSize.width / 2, adjustedY + 22, { align: "center" });
      doc.text("BarakAllahu Feekum", doc.internal.pageSize.width / 2, adjustedY + 27, { align: "center" });

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("This is an automatically generated receipt and does not require a signature.", doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 15, { align: "center" });

      doc.save(`jama_masjid_receipt_${data.transactionId}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF receipt", err);
    }
  };

  useEffect(() => {
    if (step === 3 && receiptData && pdfDownloadedRef.current !== receiptData.transactionId) {
      pdfDownloadedRef.current = receiptData.transactionId;
      downloadPDFReceipt(receiptData);
    }
  }, [step, receiptData]);

  // Sync details from current user if logged in
  useEffect(() => {
    let isMounted = true;
    if (auth.currentUser) {
      // 1. Try to load from localStorage first for instant display
      const savedUser = localStorage.getItem("mongoUser");
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.userName) setUserName(u.userName);
          if (u.phoneNumber && u.phoneNumber !== "0000000000") setPhoneNumber(u.phoneNumber);
          if (u.fatherName) setFatherName(u.fatherName);
          if (u.email) setEmail(u.email);
        } catch (e) {
          console.error("Error parsing saved mongoUser", e);
        }
      }

      // 2. Fetch fresh data from backend
      axios.get(`${API_URL}/uid/${auth.currentUser.uid}`)
        .then((res) => {
          if (!isMounted) return;
          const u = res.data;
          if (u.userName) setUserName(u.userName);
          if (u.phoneNumber && u.phoneNumber !== "0000000000") setPhoneNumber(u.phoneNumber);
          if (u.fatherName) setFatherName(u.fatherName);
          if (u.email) setEmail(u.email);
          
          // Save fresh data to local storage
          localStorage.setItem("mongoUser", JSON.stringify(u));
        })
        .catch((err) => {
          console.error("Donate: Failed to fetch fresh user details", err);
          if (!isMounted) return;
          if (!savedUser) {
            setUserName(auth.currentUser.displayName || "");
            setEmail(auth.currentUser.email || "");
          }
        });
    }
    return () => {
      isMounted = false;
    };
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
      triggerError("Please enter a valid donation amount.");
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
      triggerError(err.message || "Failed to login. Please check your credentials.");
      setIsProcessing(false);
    }
  };

  // Step 2 Register Handler
  const handleRegisterNext = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      triggerError("Please enter a valid 10-digit phone number in Step 1.");
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
      triggerError(err.message || "Failed to register. Please check your credentials.");
      setIsProcessing(false);
    }
  };

  // Core Razorpay checkout integration
  const handlePaymentFlow = async (shouldCreateAccount = false, authEmail = "", authPassword = "") => {
    setIsProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setIsProcessing(false);
      triggerError("Failed to load payment gateway SDK. Please check your internet connection.");
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
            Number(amount),
            purpose
          );
        }

        setReceiptData({
          name: userName,
          phone: phoneNumber,
          fatherName: fatherName,
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
        name: "Sunheri Mosque Donation",
        description: `Contribution for ${purpose === "mosque" ? "Mosque Maintenance" : "Imam Fund"}`,
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
                  Number(amount),
                  purpose
                );
              }

              setReceiptData({
                name: userName,
                phone: phoneNumber,
                fatherName: fatherName,
                amount: amount,
                purpose: purpose,
                date: now.format("DD MMM YYYY, hh:mm A"),
                transactionId: response.razorpay_payment_id,
                accountCreated: shouldCreateAccount,
              });

              setStep(3); // Success Receipt
            } else {
              triggerError("Payment verification failed. Please check with your bank or try again.");
            }
          } catch (error) {
            console.error("Donation recording/verification failed:", error);
            triggerError("Payment was processed, but we failed to verify or record your transaction. Please email support with Payment ID: " + response.razorpay_payment_id);
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
      triggerError("Failed to connect to payment gateway. Please check if the backend is running.");
      setIsProcessing(false);
    }
  };

  // STEP 3: SUCCESS RECEIPT RENDER
  if (step === 3 && receiptData) {
    return (
      <Box
        style={{
          marginTop: "32px",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          minHeight: "80vh",
        }}
      >
        <Card
          style={{
            maxWidth: "500px",
            width: "100%",
            borderRadius: "24px",
            boxShadow: "0 20px 50px rgba(91, 33, 182, 0.05)",
            background: "#ffffff",
            textAlign: "center",
            padding: "32px 24px",
            border: "1px solid #E2E8F0",
            height: "fit-content",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CheckCircle2 size={72} color="#16A34A" strokeWidth={1.5} />
            </Box>
            <Typography
              style={{
                fontFamily: "Poppins",
                fontWeight: "800",
                fontSize: "28px",
                color: "#16A34A",
                letterSpacing: "-0.5px"
              }}
            >
              JazakAllah Khair!
            </Typography>
            <Typography
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                color: "#64748B",
                marginTop: "6px",
              }}
            >
              Thank you for supporting Sunheri Mosque.
            </Typography>

            <Box
              style={{
                marginTop: "32px",
                backgroundColor: "#F8FAFC",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "left",
                border: "1px dashed #E2E8F0",
              }}
            >
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#1E293B" }}>
                <strong>Reference ID:</strong> {receiptData.transactionId}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#1E293B", marginTop: "10px" }}>
                <strong>Donor Name:</strong> {receiptData.name}
              </Typography>
              {receiptData.fatherName && (
                <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#1E293B", marginTop: "10px" }}>
                  <strong>Father's Name:</strong> {receiptData.fatherName}
                </Typography>
              )}
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#1E293B", marginTop: "10px" }}>
                <strong>Phone Number:</strong> {receiptData.phone}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "16px", color: "#5B21B6", marginTop: "12px", fontWeight: "700" }}>
                <strong>Amount:</strong> ₹{Number(receiptData.amount).toLocaleString()}.00
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#1E293B", marginTop: "10px" }}>
                <strong>Purpose:</strong> For {receiptData.purpose === "mosque" ? "MOSQUE MAINTENANCE" : "IMAM WELFARE"}
              </Typography>
              <Typography style={{ fontFamily: "Poppins", fontSize: "14px", color: "#1E293B", marginTop: "10px" }}>
                <strong>Date & Time:</strong> {receiptData.date}
              </Typography>
              {receiptData.accountCreated && (
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "13px",
                    color: "#16A34A",
                    backgroundColor: "#DCFCE7",
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "16px",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  🎉 Account Created! You can now log in to track your donations.
                </Typography>
              )}
            </Box>

            <Box style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "32px" }}>
              <Button
                variant="outlined"
                onClick={() => downloadPDFReceipt(receiptData)}
                sx={{
                  borderColor: "#5B21B6",
                  color: "#5B21B6",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  padding: "12px 24px",
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderColor: "#5B21B6",
                    borderWidth: "1.5px",
                    bgcolor: "rgba(91, 33, 182, 0.04)",
                  }
                }}
              >
                Download Receipt
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setStep(1);
                  setReceiptData(null);
                }}
                sx={{
                  background: "linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  padding: "12px 24px",
                  boxShadow: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
                  }
                }}
                startIcon={<ArrowLeft size={16} />}
              >
                Donate Again
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      style={{
        marginTop: "32px",
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
        background: "radial-gradient(circle at top, #FFFFFF 0%, #F1EEF6 100%)",
        minHeight: "90vh",
      }}
    >
      <Card
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "28px",
          boxShadow: "0 30px 60px rgba(91, 33, 182, 0.04), 0 2px 10px rgba(0, 0, 0, 0.01)",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          backgroundColor: "#ffffff",
          height: "fit-content",
        }}
      >
        {/* Welcoming Hero Section */}
        <Box
          style={{
            background: "linear-gradient(180deg, #5B21B6 0%, #7C3AED 60%, #F8FAFC 100%)",
            color: "#ffffff",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <Typography style={{ fontSize: "48px", marginBottom: "8px", lineHeight: 1 }}>🕌</Typography>
          <Typography style={{ fontFamily: "Poppins", fontWeight: "800", fontSize: "28px", color: "#ffffff", letterSpacing: "-0.5px" }}>
            Support Your Masjid
          </Typography>
          <Typography style={{ fontFamily: "Poppins", fontSize: "14px", opacity: 0.9, marginTop: "8px", maxWidth: "450px", marginLeft: "auto", marginRight: "auto" }}>
            Every contribution helps maintain the mosque and supports the Imam.
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ShieldCheck size={14} color="#16A34A" />
              <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", color: "#ffffff" }}>
                SECURE
              </Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>•</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Receipt size={14} color="#16A34A" />
              <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", color: "#ffffff" }}>
                TRANSPARENT
              </Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>•</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Heart size={14} color="#16A34A" />
              <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", color: "#ffffff" }}>
                TRUSTED
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent style={{ padding: "28px" }}>
          {/* Stepper Progress Indicator */}
          <Box mb={4}>
            <Stepper 
              activeStep={step - 1} 
              alternativeLabel
              sx={{
                "& .MuiStepIcon-root.Mui-active": { color: "#5B21B6" },
                "& .MuiStepIcon-root.Mui-completed": { color: "#16A34A" },
                "& .MuiStepLabel-label": { fontFamily: "Poppins", fontSize: "12px", fontWeight: "500" },
                "& .MuiStepLabel-label.Mui-active": { color: "#5B21B6", fontWeight: "600" }
              }}
            >
              {["Donation", "Payment", "Success"].map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

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
                  <Box mb={4}>
                    <Typography
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        fontSize: "15px",
                        color: "#1E293B",
                        marginBottom: "16px",
                      }}
                    >
                      Choose Fund
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card
                          onClick={() => setPurpose("mosque")}
                          sx={{
                            border: purpose === "mosque" ? "2px solid #5B21B6" : "2px solid #E2E8F0",
                            borderRadius: "16px",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            transform: purpose === "mosque" ? "scale(1.02)" : "scale(1)",
                            backgroundColor: purpose === "mosque" ? "#F5F3FF" : "#ffffff",
                            boxShadow: purpose === "mosque" ? "0 4px 20px rgba(91, 33, 182, 0.08)" : "none",
                            "&:hover": {
                              borderColor: "#5B21B6",
                              backgroundColor: "#F5F3FF",
                            }
                          }}
                        >
                          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3, "&:last-child": { pb: 3 } }}>
                            <Box sx={{ mb: 2, display: "flex", justifyContent: "center", alignItems: "center", width: 64, height: 64, borderRadius: "50%", bgcolor: purpose === "mosque" ? "#EDE9FE" : "#F8FAFC" }}>
                              <Building2 size={32} color={purpose === "mosque" ? "#5B21B6" : "#64748B"} />
                            </Box>
                            <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "15px", color: "#1E293B" }}>
                              Mosque Fund
                            </Typography>
                            
                            {purpose === "mosque" && (
                              <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.5, bgcolor: "#16A34A", color: "#ffffff", px: 1.5, py: 0.25, borderRadius: "50px" }}>
                                <CheckCircle2 size={10} color="#ffffff" />
                                <Typography sx={{ fontSize: "9px", fontWeight: "700", fontFamily: "Poppins" }}>Selected</Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={6}>
                        <Card
                          onClick={() => setPurpose("imam")}
                          sx={{
                            border: purpose === "imam" ? "2px solid #5B21B6" : "2px solid #E2E8F0",
                            borderRadius: "16px",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            transform: purpose === "imam" ? "scale(1.02)" : "scale(1)",
                            backgroundColor: purpose === "imam" ? "#F5F3FF" : "#ffffff",
                            boxShadow: purpose === "imam" ? "0 4px 20px rgba(91, 33, 182, 0.08)" : "none",
                            "&:hover": {
                              borderColor: "#5B21B6",
                              backgroundColor: "#F5F3FF",
                            }
                          }}
                        >
                          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3, "&:last-child": { pb: 3 } }}>
                            <Box sx={{ mb: 2, display: "flex", justifyContent: "center", alignItems: "center", width: 64, height: 64, borderRadius: "50%", bgcolor: purpose === "imam" ? "#EDE9FE" : "#F8FAFC" }}>
                              <HeartHandshake size={32} color={purpose === "imam" ? "#5B21B6" : "#64748B"} />
                            </Box>
                            <Typography sx={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "15px", color: "#1E293B" }}>
                              Imam Support
                            </Typography>
                           
                            {purpose === "imam" && (
                              <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.5, bgcolor: "#16A34A", color: "#ffffff", px: 1.5, py: 0.25, borderRadius: "50px" }}>
                                <CheckCircle2 size={10} color="#ffffff" />
                                <Typography sx={{ fontSize: "9px", fontWeight: "700", fontFamily: "Poppins" }}>Selected</Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Personal Information */}
                  <Box mb={4}>
                    <Typography
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        fontSize: "15px",
                        color: "#5B21B6",
                        marginBottom: "18px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ContactRound style={{ marginRight: "8px" }} size={20} /> Donor Information
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Donor Name"
                          variant="outlined"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ContactRound size={18} color="#64748B" />
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                          inputProps={{ style: { fontFamily: "Poppins", fontSize: "14.5px" } }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              "&.Mui-focused fieldset": { borderColor: "#5B21B6" }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Father's Name"
                          variant="outlined"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ContactRound size={18} color="#64748B" />
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                          inputProps={{ style: { fontFamily: "Poppins", fontSize: "14.5px" } }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              "&.Mui-focused fieldset": { borderColor: "#5B21B6" }
                            }
                          }}
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
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone size={18} color="#64748B" />
                                <Typography sx={{ ml: 1, mr: 0.5, fontSize: "14px", color: "#64748B", fontFamily: "Poppins", fontWeight: "600" }}>+91</Typography>
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                          inputProps={{ style: { fontFamily: "Poppins", fontSize: "14.5px" } }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              "&.Mui-focused fieldset": { borderColor: "#5B21B6" }
                            }
                          }}
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
                        fontSize: "15px",
                        color: "#5B21B6",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Coins style={{ marginRight: "8px" }} size={20} /> Donation Amount (INR)
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
                        startAdornment: (
                          <InputAdornment position="start">
                            <IndianRupee size={18} color="#64748B" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "13.5px" } }}
                      inputProps={{ style: { fontFamily: "Poppins", fontSize: "15px", min: 1 } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "&.Mui-focused fieldset": { borderColor: "#5B21B6" }
                        }
                      }}
                    />
                    
                    {/* Quick Amount Pill Buttons */}
                    <Box mt={2} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {["500", "1000", "2000", "5000", "10000"].map((preset) => {
                        const isSelected = amount === preset;
                        return (
                          <Button
                            key={preset}
                            variant={isSelected ? "contained" : "outlined"}
                            size="small"
                            onClick={() => handleQuickAmount(preset)}
                            sx={{
                              fontFamily: "Poppins",
                              fontWeight: "600",
                              textTransform: "none",
                              borderRadius: "50px",
                              fontSize: "13px",
                              px: 2.5,
                              py: 0.75,
                              borderColor: "#5B21B6",
                              color: isSelected ? "#ffffff" : "#5B21B6",
                              backgroundColor: isSelected ? "#5B21B6" : "transparent",
                              "&:hover": {
                                borderColor: "#5B21B6",
                                backgroundColor: isSelected ? "#4C1D95" : "rgba(91, 33, 182, 0.08)",
                              },
                            }}
                          >
                            ₹{Number(preset).toLocaleString()}
                          </Button>
                        );
                      })}
                    </Box>

                    {/* Donation Impact Guide */}
                    <Box sx={{ mt: 3, p: 2.5, bgcolor: "#F8FAFC", borderRadius: "16px", border: "1px dashed #E2E8F0" }}>
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "12.5px", fontWeight: "700", color: "#5B21B6", mb: 1, letterSpacing: "0.2px" }}>
                        DONATION IMPACT
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#64748B" }}><strong>₹500:</strong> Daily Cleaning & Maintenance</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#64748B" }}><strong>₹1,000:</strong> Mosque Utility Bills</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#64748B", mt: 0.5 }}><strong>₹5,000:</strong> Clean Water Supplies</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", color: "#64748B", mt: 0.5 }}><strong>₹10,000:</strong> Imam Salary Support</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Proceed Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      background: "linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)",
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: "16px",
                      padding: "14px",
                      borderRadius: "14px",
                      textTransform: "none",
                      boxShadow: "0 4px 14px rgba(91, 33, 182, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
                        boxShadow: "0 10px 30px rgba(91, 33, 182, 0.25)",
                        transform: "translateY(-1px)",
                      }
                    }}
                  >
                    Proceed Securely <ArrowRight size={18} />
                  </Button>

                  {/* Trust Signals Footer */}
                  <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around", borderTop: "1px solid #E2E8F0", pt: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ShieldCheck size={16} color="#16A34A" />
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", color: "#64748B" }}>
                        100% Secure Payments
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Receipt size={16} color="#16A34A" />
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", color: "#64748B" }}>
                        Transparent Records
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Heart size={16} color="#16A34A" />
                      <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", color: "#64748B" }}>
                        JazakAllah Khair
                      </Typography>
                    </Box>
                  </Box>
                </form>
              )}

              {/* STEP 2: AUTHENTICATION GATEWAY */}
              {step === 2 && (
                <Box>
                  <Button
                    onClick={() => setStep(1)}
                    startIcon={<ArrowLeft size={16} />}
                    sx={{
                      textTransform: "none",
                      color: "#5B21B6",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      mb: 2.5,
                      "&:hover": { bgcolor: "rgba(91, 33, 182, 0.04)" }
                    }}
                  >
                    Back to details
                  </Button>

                  <Card 
                    sx={{ 
                      boxShadow: "none", 
                      border: "1px solid #E2E8F0",
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
                          fontSize: "12px",
                          color: "#1E293B",
                          px: 1,
                        },
                        "& .Mui-selected": {
                          color: "#5B21B6 !important",
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#5B21B6",
                        }
                      }}
                    >
                      <Tab label="Create Account" />
                      <Tab label="Sign In" />
                      <Tab label="Donate as Guest" />
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
                            sx={{
                              background: "linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)",
                              fontFamily: "Poppins",
                              fontWeight: "600",
                              fontSize: "15px",
                              padding: "12px",
                              borderRadius: "12px",
                              textTransform: "none",
                              marginTop: "20px",
                              boxShadow: "none",
                              "&:hover": {
                                background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
                              }
                            }}
                            startIcon={<Lock size={16} />}
                          >
                            Sign Up & Pay ₹{Number(amount).toLocaleString()}
                          </Button>
                        </form>
                      ) : activeAuthTab === 1 ? (
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
                            sx={{
                              background: "linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)",
                              fontFamily: "Poppins",
                              fontWeight: "600",
                              fontSize: "15px",
                              padding: "12px",
                              borderRadius: "12px",
                              textTransform: "none",
                              marginTop: "20px",
                              boxShadow: "none",
                              "&:hover": {
                                background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
                              }
                            }}
                            startIcon={<Lock size={16} />}
                          >
                            Sign In & Pay ₹{Number(amount).toLocaleString()}
                          </Button>
                        </form>
                      ) : (
                        /* Guest Checkout Panel */
                        <Box sx={{ py: 1, textAlign: "center" }}>
                          <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", color: "#8789A3", mb: 3 }}>
                            No registration required. You can make a contribution directly. Please note that guest donations will not be linked to a persistent profile history.
                          </Typography>
                          
                          <Button
                            onClick={() => handlePaymentFlow(false)}
                            fullWidth
                            variant="contained"
                            sx={{
                              background: "linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)",
                              fontFamily: "Poppins",
                              fontWeight: "700",
                              fontSize: "15px",
                              padding: "14px",
                              borderRadius: "12px",
                              textTransform: "none",
                              boxShadow: "0 4px 14px rgba(91, 33, 182, 0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
                                boxShadow: "0 10px 30px rgba(91, 33, 182, 0.25)",
                                transform: "translateY(-1px)",
                              }
                            }}
                          >
                            Pay ₹{Number(amount).toLocaleString()} as Guest <ArrowRight size={18} />
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Custom Snackbar for inline notifications */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ 
            width: "100%", 
            fontFamily: "Poppins", 
            fontSize: "13.5px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Donate;
