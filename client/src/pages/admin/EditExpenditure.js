import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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

const EditExpenditure = ({ open, onClose, expenditure, onSuccess }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expenditure) {
      setCategory(expenditure.category || "");
      setAmount(expenditure.amount || "");
      setDate(expenditure.date ? dayjs(expenditure.date) : dayjs());
      setDescription(expenditure.description || "");
    }
  }, [expenditure]);

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
        description
      };

      await axios.put(`http://localhost:3001/expenditures/${expenditure.id}`, payload);
      toast.success("Expenditure updated successfully!");

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err) {
      console.error("Failed to update expenditure:", err);
      toast.error(err.response?.data?.message || "Failed to update expenditure. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        PaperProps={{
          style: { borderRadius: "5px", width: "400px" }
        }}
      >
        <DialogTitle>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography style={{ fontSize: "18px", fontWeight: "700", fontFamily: "Poppins", color: "#240F4F" }}>
              Edit Expenditure
            </Typography>
            <CloseRoundedIcon
              onClick={onClose}
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
                    background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                    textTransform: "none",
                    fontFamily: "Poppins",
                    fontSize: "15px",
                    fontWeight: "700",
                    borderRadius: "5px",
                    padding: "8px 0"
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
    </div>
  );
};

export default EditExpenditure;
