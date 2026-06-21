import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Avatar from "@mui/material/Avatar";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Firebase Config for secondary instance
const firebaseConfig = {
  apiKey: "AIzaSyATn5viI7qe90zeaE3M6uVNH0nWzMfN4yM",
  authDomain: "mosque-74315.firebaseapp.com",
  projectId: "mosque-74315",
  storageBucket: "mosque-74315.appspot.com",
  messagingSenderId: "778550086987",
  appId: "1:778550086987:web:e5b5af826e2c6892332cce",
  measurementId: "G-DD05JQBHY6",
};

// Initialize secondary app safely
const getTempAuth = () => {
  let tempApp;
  if (getApps().some(app => app.name === "TempAdminApp")) {
    tempApp = getApp("TempAdminApp");
  } else {
    tempApp = initializeApp(firebaseConfig, "TempAdminApp");
  }
  return getAuth(tempApp);
};

const AddAdmin = () => {
  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAdminName("");
    setAdminPhone("");
    setAdminPassword("");
    setPhoneError(false);
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (val.length > 10) val = val.slice(0, 10);
    setAdminPhone(val);
    setPhoneError(val.length !== 10 && val.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminName) {
      toast.error("Please enter Admin Name");
      return;
    }
    if (adminPhone.length !== 10) {
      setPhoneError(true);
      toast.error("Phone number must be 10 digits");
      return;
    }
    if (!adminPassword || adminPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    try {
      const email = `${adminPhone}@jama-masjid.com`;
      const tempAuth = getTempAuth();

      // 1. Create in Firebase under secondary App (prevents signing out current admin)
      const credential = await createUserWithEmailAndPassword(tempAuth, email, adminPassword);
      const newFirebaseUser = credential.user;

      // Immediately sign out from secondary app state
      await signOut(tempAuth);

      // 2. Register in MongoDB as Admin
      await axios.post("http://localhost:3001/books/register", {
        uid: newFirebaseUser.uid,
        userName: adminName,
        email: email,
        role: "admin",
        phoneNumber: adminPhone,
        fatherName: ""
      });

      toast.success("Administrator registered successfully!");
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error("Failed to add admin:", err);
      let errMsg = "Registration failed. Phone number may already be in use.";
      if (err.code === "auth/email-already-in-use") {
        errMsg = "An administrator with this phone number is already registered.";
      } else if (err.message) {
        errMsg = err.message;
      }
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Avatar
        onClick={handleClickOpen}
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #FF9900 0%, #FF5E00 100%)",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        <SupervisorAccountRoundedIcon style={{ color: "white", fontSize: "24px" }} />
      </Avatar>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          style: { borderRadius: "5px", width: "400px" }
        }}
      >
        <DialogTitle>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography style={{ fontSize: "18px", fontWeight: "700", fontFamily: "Poppins", color: "#240F4F" }}>
              Add Administrator
            </Typography>
            <CloseRoundedIcon
              onClick={handleClose}
              style={{ color: "gray", height: "24px", width: "24px", cursor: "pointer" }}
            />
          </div>
        </DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  label="Name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  disabled={submitting}
                  InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                  inputProps={{ style: { fontFamily: "Poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  type="number"
                  label="Phone Number"
                  value={adminPhone}
                  onChange={handlePhoneChange}
                  error={phoneError}
                  helperText={phoneError ? "Phone number must be exactly 10 digits" : ""}
                  disabled={submitting}
                  InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                  inputProps={{ style: { fontFamily: "Poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  type="password"
                  label="Sign In Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  disabled={submitting}
                  InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                  inputProps={{ style: { fontFamily: "Poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  style={{
                    background: "linear-gradient(135deg, #FF9900 0%, #FF5E00 100%)",
                    textTransform: "none",
                    fontFamily: "Poppins",
                    fontSize: "15px",
                    fontWeight: "700",
                    borderRadius: "5px",
                    padding: "8px 0"
                  }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : "Register Admin"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default AddAdmin;
