import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const colors = {
  primary: "#240f4f",
  accent: "#ff9900",
  accentDark: "#ff5e00",
  textMuted: "#8789a3",
  border: "#f1f1f5",
  danger: "#e11d48",
};

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form states
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  // Retrieve current super admin credentials from env for safety exclusion
  const superAdminEmail = process.env.REACT_APP_SUPER_ADMIN_EMAIL;
  const superAdminPhone = process.env.REACT_APP_SUPER_ADMIN_PHONE;

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:3001/books");
      // Filter out only admins, and exclude the super admin
      const allUsers = res.data || [];
      const adminUsers = allUsers.filter(
        (u) =>
          u.role === "admin" &&
          u.email !== superAdminEmail &&
          u.phoneNumber !== superAdminPhone
      );
      setAdmins(adminUsers);
    } catch (err) {
      console.error("Failed to load administrators:", err);
      toast.error("Failed to load administrators list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenEdit = (admin) => {
    setSelectedAdmin(admin);
    setAdminName(admin.userName);
    setAdminPhone(admin.phoneNumber || "");
    setAdminPassword("");
    setPhoneError(false);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    if (submitting) return;
    setEditDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (val.length > 10) val = val.slice(0, 10);
    setAdminPhone(val);
    setPhoneError(val.length !== 10 && val.length > 0);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!adminName) {
      toast.error("Please enter a name");
      return;
    }
    if (adminPhone.length !== 10) {
      setPhoneError(true);
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setSubmitting(true);
    try {
      const updatePayload = {
        userName: adminName,
        phoneNumber: adminPhone,
      };
      
      // Only include password if a new one is typed
      if (adminPassword) {
        if (adminPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setSubmitting(false);
          return;
        }
        updatePayload.password = adminPassword;
      }

      await axios.put(`http://localhost:3001/books/${selectedAdmin.id}`, updatePayload);
      toast.success("Administrator updated successfully!");
      setEditDialogOpen(false);
      fetchAdmins();
    } catch (err) {
      console.error("Failed to update administrator:", err);
      const errMsg = err.response?.data?.message || "Failed to update administrator details";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this administrator? This will remove them from both Firebase and MongoDB.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/books/${adminId}`);
      toast.success("Administrator deleted successfully!");
      fetchAdmins();
    } catch (err) {
      console.error("Failed to delete administrator:", err);
      toast.error("Failed to delete administrator");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, px: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary, fontFamily: "Poppins" }}>
          Admin Management
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textMuted, fontFamily: "Poppins", mt: 0.5 }}>
          View, edit credentials, or remove secondary administrators of the mosque application.
        </Typography>
      </Box>

      {admins.length === 0 ? (
        <Card sx={{ boxShadow: "none", border: `1px solid ${colors.border}`, py: 5, textAlign: "center" }}>
          <CardContent>
            <SupervisorAccountRoundedIcon sx={{ fontSize: 48, color: colors.textMuted, mb: 1.5 }} />
            <Typography variant="body1" sx={{ fontFamily: "Poppins", fontWeight: 600, color: colors.primary }}>
              No Administrators Found
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Poppins", color: colors.textMuted, mt: 0.5 }}>
              Use the "New Entry" -> "Add Administrator" option from the main dashboard to add one.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {admins.map((admin) => (
            <Grid item xs={12} md={6} key={admin.id}>
              <Card
                sx={{
                  boxShadow: "none",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(36, 15, 79, 0.05)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                          fontSize: "18px",
                          fontFamily: "Poppins",
                          background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                          color: "#fff",
                        }}
                      >
                        {admin.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: colors.primary, fontFamily: "Poppins", fontSize: "16px" }}>
                          {admin.userName}
                        </Typography>
                        <Typography sx={{ color: colors.textMuted, fontFamily: "Poppins", fontSize: "13px", mt: 0.2 }}>
                          {admin.phoneNumber || "No Phone Number"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => handleOpenEdit(admin)}
                        sx={{
                          color: colors.primary,
                          bgcolor: "#f3f0ff",
                          "&:hover": { bgcolor: "#e5dbff" },
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteAdmin(admin.id)}
                        sx={{
                          color: colors.danger,
                          bgcolor: "#fff1f2",
                          "&:hover": { bgcolor: "#ffe4e6" },
                        }}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Admin Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        PaperProps={{
          style: { borderRadius: "10px", width: "400px" },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: "700", fontFamily: "Poppins", color: colors.primary }}>
              Edit Administrator
            </Typography>
            <IconButton onClick={handleCloseEdit} disabled={submitting} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ borderBottom: "none" }}>
          <form onSubmit={handleUpdateAdmin} style={{ marginTop: "8px" }}>
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
                  type="password"
                  label="New Password (Optional)"
                  helperText="Leave blank to keep existing password"
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
                    padding: "8px 0",
                  }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default ManageAdmins;
