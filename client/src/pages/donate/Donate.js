import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Box,
  Switch,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { createTask, registerNormalUserWithDonation } from "../../config/firebase";

const Donate = () => {
  // Personal Info
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fatherName, setFatherName] = useState("");

  // Donation details
  const [purpose, setPurpose] = useState("mosque");
  const [amount, setAmount] = useState("");

  // Account creation info
  const [createAccount, setCreateAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Payment simulated state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Status states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Helper validation
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (val.length > 10) val = val.slice(0, 10);
    setPhoneNumber(val);
    setPhoneError(val.length !== 10 && val.length > 0);
  };

  const handleQuickAmount = (val) => {
    setAmount(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      setPhoneError(true);
      return;
    }

    if (createAccount && !email.includes("@")) {
      setEmailError(true);
      return;
    }

    setIsProcessing(true);

    // Get current date
    const now = dayjs();
    const year = now.format("YYYY");
    const month = now.format("MM");
    const day = now.format("DD");

    try {
      // Simulate network request/payment processor latency
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (createAccount) {
        // Create Firebase account + MongoDB registration + Donation record
        await registerNormalUserWithDonation(
          userName,
          email,
          password,
          phoneNumber,
          fatherName,
          purpose,
          amount,
          year,
          month,
          day
        );
      } else {
        // Create MongoDB-only donation record (manual/anonymous flow)
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
        transactionId: "TXN" + Math.floor(Math.random() * 90000000 + 10000000),
        accountCreated: createAccount,
      });

      setIsSuccess(true);
      // Reset form
      setUserName("");
      setPhoneNumber("");
      setFatherName("");
      setAmount("");
      setCreateAccount(false);
      setEmail("");
      setPassword("");
      setCardName("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
    } catch (error) {
      console.error("Donation / registration failed", error);
      alert(error.message || "Something went wrong during checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess && receiptData) {
    return (
      <Box
        style={{
          marginTop: "120px",
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
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            textAlign: "center",
            padding: "20px",
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
                <strong>Purpose:</strong> For {receiptData.purpose.toUpperCase()}
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
                  🎉 Account Created! You can now log in using your email to view your receipts.
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              onClick={() => setIsSuccess(false)}
              style={{
                marginTop: "30px",
                background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)",
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                padding: "10px 30px",
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
        marginTop: "120px",
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
          boxShadow: "0 15px 35px rgba(103, 44, 188, 0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            background: "linear-gradient(135deg, #672CBC 0%, #9055FF 100%)",
            color: "#ffffff",
            padding: "30px 20px",
            textAlign: "center",
          }}
        >
          <FavoriteIcon style={{ fontSize: "40px", marginBottom: "10px" }} />
          <Typography style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: "24px" }}>
            Online Masjid Contribution
          </Typography>
          <Typography style={{ fontFamily: "Poppins", fontSize: "14px", opacity: 0.9 }}>
            Make a secure donation and track your contributions online
          </Typography>
        </Box>

        <CardContent style={{ padding: "30px" }}>
          {isProcessing ? (
            <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0" }}>
              <CircularProgress size={60} style={{ color: "#672CBC" }} />
              <Typography style={{ marginTop: "20px", fontFamily: "Poppins", fontWeight: "600", color: "#672CBC" }}>
                Processing Simulated Checkout...
              </Typography>
              <Typography style={{ marginTop: "5px", fontFamily: "Poppins", fontSize: "13px", color: "#888" }}>
                Connecting to payment gateway and setting up account...
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Personal Details Section */}
              <Box mb={4}>
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#672CBC",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AccountCircleIcon style={{ marginRight: "8px" }} /> 1. Personal Information
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
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Father's Name"
                      variant="outlined"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
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
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Donation Details Section */}
              <Box mb={4}>
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#672CBC",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FavoriteIcon style={{ marginRight: "8px" }} /> 2. Donation Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: "14px" }}>
                        Select Purpose
                      </FormLabel>
                      <RadioGroup
                        row
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      >
                        <FormControlLabel
                          value="mosque"
                          control={<Radio style={{ color: "#672CBC" }} />}
                          label={<span style={{ fontFamily: "Poppins" }}>Masjid (Mosque) Maintenance</span>}
                        />
                        <FormControlLabel
                          value="imam"
                          control={<Radio style={{ color: "#672CBC" }} />}
                          label={<span style={{ fontFamily: "Poppins" }}>Imam / Moazzin Salary</span>}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Donation Amount"
                      variant="outlined"
                      required
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins", min: 1 } }}
                    />
                    <Box mt={1.5} style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {["100", "500", "1000", "2000", "5000"].map((preset) => (
                        <Button
                          key={preset}
                          variant="outlined"
                          size="small"
                          onClick={() => handleQuickAmount(preset)}
                          style={{
                            fontFamily: "Poppins",
                            color: "#672CBC",
                            borderColor: "#672CBC",
                            textTransform: "none",
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: "#f1eef6",
                            },
                          }}
                        >
                          + ₹{preset}
                        </Button>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Optional Registration Section */}
              <Box mb={4} p={2} style={{ backgroundColor: "#f8f6fc", borderRadius: "16px", border: "1px solid #e2dbf0" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: "15px", color: "#672CBC" }}>
                      Create Online Account?
                    </Typography>
                    <Typography style={{ fontFamily: "Poppins", fontSize: "12px", color: "#666" }}>
                      Track your donations and view contribution history online.
                    </Typography>
                  </Box>
                  <Switch
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    color="secondary"
                  />
                </Box>

                {createAccount && (
                  <Box mt={2.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          variant="outlined"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(false);
                          }}
                          error={emailError}
                          helperText={emailError ? "Please enter a valid email" : ""}
                          InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                          inputProps={{ style: { fontFamily: "Poppins" } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Choose Password"
                          variant="outlined"
                          required
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                          inputProps={{ style: { fontFamily: "Poppins", minLength: 6 } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>

              {/* Payment Simulated Section */}
              <Box mb={4}>
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#672CBC",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PaymentIcon style={{ marginRight: "8px" }} /> 3. Payment details (Simulated Gateway)
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      variant="outlined"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      variant="outlined"
                      required
                      placeholder="1234 5678 1234 5678"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiration Date"
                      placeholder="MM/YY"
                      variant="outlined"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      variant="outlined"
                      required
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                      inputProps={{ style: { fontFamily: "Poppins", maxLength: 3 } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Submit Button */}
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
                  boxShadow: "0 10px 20px rgba(103, 44, 188, 0.2)",
                  marginTop: "10px",
                }}
              >
                Pay & Contribute ₹{amount || "0"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Donate;
