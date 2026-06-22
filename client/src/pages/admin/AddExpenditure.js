import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Avatar from "@mui/material/Avatar";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const categories = [
  "Imam",
  "Construction",
  "Maintenance & Repair",
  "Utilities & Bills"
];

const AddExpenditure = ({ onAddSuccess, open: propOpen, onClose: propOnClose }) => {
  const [localOpen, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isControlled = propOpen !== undefined;
  const open = isControlled ? propOpen : localOpen;

  const handleClickOpen = () => {
    if (!isControlled) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    if (isControlled) {
      if (propOnClose) propOnClose();
    } else {
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setCategory("");
    setAmount("");
    setDate(dayjs());
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        category,
        amount: Number(amount),
        date: date.toDate(),
        description,
        addedBy: "Admin"
      };

      await axios.post("http://localhost:3001/expenditures", payload);
      toast.success("Expenditure added successfully!");

      if (onAddSuccess) {
        onAddSuccess();
      }

      setTimeout(() => {
        if (isControlled) {
          if (propOnClose) propOnClose();
        } else {
          setOpen(false);
        }
        resetForm();
      }, 1500);

    } catch (err) {
      console.error("Failed to add expenditure:", err);
      toast.error(err.response?.data?.message || "Failed to log expenditure. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {!isControlled && (
        <Avatar
          onClick={handleClickOpen}
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #ff5252 0%, #ff1744 100%)",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          <AccountBalanceWalletRoundedIcon style={{ color: "white", fontSize: "24px" }} />
        </Avatar>
      )}

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
              Add Expenditure
            </Typography>
            <CloseRoundedIcon
              onClick={handleClose}
              style={{ color: "gray", height: "24px", width: "24px", cursor: "pointer" }}
            />
          </div>
        </DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" required>
                  <InputLabel style={{ fontFamily: "Poppins" }}>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={submitting}
                    style={{ fontFamily: "Poppins" }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat} style={{ fontFamily: "Poppins" }}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  type="number"
                  label="Amount (INR)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                  InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                  inputProps={{ style: { fontFamily: "Poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    disabled={submitting}
                    slotProps={{
                      textField: {
                        required: true,
                        size: "small",
                        fullWidth: true,
                        InputLabelProps: { style: { fontFamily: "Poppins" } },
                        inputProps: { style: { fontFamily: "Poppins" } }
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  label="Description / Purpose"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={submitting}
                  InputLabelProps={{ style: { fontFamily: "Poppins" } }}
                  inputProps={{ style: { fontFamily: "Poppins" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  disabled={submitting}
                  variant="contained"
                  style={{
                    background: "linear-gradient(135deg, #ff5252 0%, #ff1744 100%)",
                    textTransform: "none",
                    fontFamily: "Poppins",
                    fontSize: "15px",
                    fontWeight: "700",
                    borderRadius: "5px",
                    padding: "8px 0"
                  }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : "Log Expenditure"}
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

export default AddExpenditure;
