import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// React Toastify is used to show the alert
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Loader

import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

//Firebase

import { getTaskById, updateTask } from "../../../config/firebase";

// Slide
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Button from "@mui/material/Button";

import Slide from "@mui/material/Slide";

// Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

// Slide
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddAmountForImam = () => {
  const params = useParams();

  const [date, setDate] = useState(null);

  const selectedDate = dayjs(date);

  const year = selectedDate.format("YYYY"); // Get the year
  const month = selectedDate.format("MM"); // Get the month (01 for January, 02 for February, etc.)
  const day = selectedDate.format("DD"); // Get the day of the month

  console.log("Year: ", year);
  console.log("Month: ", year);
  console.log("Day: ", day);

  const [filterYear, setFilterYear] = useState(""); // State for selected year filter

  // Logic to add amount
  const [newAmount, setNewAmount] = useState(); // State for the new amount to add

  // Firebase
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(true);

  // SLide
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDate = (newDate) => {
    setDate(newDate);
  };

  // Data fetching using firebase

  useEffect(() => {
    // Fetch the task by ID and update the state
    getTaskById(params.id)
      .then((taskData) => {
        setTask(taskData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
        setLoading(false);
      });
  }, [params.id]);

  // Converting months into string
  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1] || "";
  };
  // Extract unique.imam from tasks data
  // Extract unique.imam from tasks data and filter out empty strings
  const availableYears = Array.from(
    new Set(tasks?.imam?.map((year) => year.year).filter((year) => year !== ""))
  );

  console.log(availableYears);

  // Handle year filter change
  const handleFilterChange = (event) => {
    setFilterYear(event.target.value);
  };
  console.log("user", tasks);

  //Logic to add amount

  const updateTaskWithAmount = () => {
    // Check if the date is empty
    if (!date) {
      alert("Please select a date before adding an amount.");
      return;
    }

    // Get the current year and month
    const currentYear = year;
    const currentMonth = month;

    // Create a copy of the task data
    const updatedTaskData = { ...tasks };

    // Find the index of the year for the selected year in the database
    const yearIndex = updatedTaskData.imam.findIndex(
      (year) => year.year === currentYear
    );

    if (yearIndex !== -1) {
      // Year exists in the database, update the amount for the current month
      const yearData = updatedTaskData.imam[yearIndex];

      // Find the index of the current month and day in the year's data
      const monthIndex = yearData.months.findIndex(
        (m) => m.month === currentMonth && m.day === day
      );

      if (monthIndex !== -1) {
        // Month and day exist, update the amount
        yearData.months[monthIndex].amount += newAmount;
      } else {
        // Month doesn't exist, create a new month object
        yearData.months.push({
          day: day,
          month: month,
          amount: newAmount,
        });
      }
    } else {
      // Year doesn't exist, create a new year object
      updatedTaskData.imam.push({
        year: currentYear,
        months: [
          {
            day: day,
            month: currentMonth,
            amount: newAmount,
          },
        ],
      });
    }

    // Update the task data in Firebase Firestore
    updateTask(params.id, updatedTaskData)
      .then(() => {
        console.log("Task updated successfully");
        // Calling Toastify function inside the submit
        displayLoginNotification();
        setNewAmount("");
        setOpen(false);
        setDate(null);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const handleDeleteMonth = (targetYear, monthIndex) => {
    if (!window.confirm("Are you sure you want to delete this donation record?")) {
      return;
    }

    const updatedTaskData = { ...tasks };
    const yearIndex = updatedTaskData.imam.findIndex(
      (y) => y.year === targetYear
    );

    if (yearIndex !== -1) {
      const yearData = updatedTaskData.imam[yearIndex];
      yearData.months.splice(monthIndex, 1);

      // If no months are left in this year, remove the year object entirely
      if (yearData.months.length === 0) {
        updatedTaskData.imam.splice(yearIndex, 1);
      }

      updateTask(params.id, updatedTaskData)
        .then(() => {
          toast.success("Donation record deleted successfully!");
          setTask(updatedTaskData);
        })
        .catch((error) => {
          console.error("Error deleting donation record:", error);
          toast.error("Failed to delete donation record. Please try again.");
        });
    }
  };

  // Function for react toastify
  const displayLoginNotification = () => {
    toast.success(`${newAmount} Rupees Added`);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: "500",
                fontFamily: "Poppins",
              }}
            >
              Amount For Imam
            </Typography>

            <CloseRoundedIcon
              onClick={handleClose}
              style={{
                color: "gray",
                height: "30px",
                width: "30px",

                cursor: "pointer",
              }}
            />
          </div>
        </DialogTitle>

        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              style={{ marginBottom: "10px" }}
              variant="standard"
              size="small"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              color="secondary"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={handleDate}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
            <Button
              style={{
                textTransform: "none",
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "500",
                color: "white",
                background: `linear-gradient(135deg, gray 0%, black 100%)`,
                marginTop: "10px",
              }}
              onClick={updateTaskWithAmount}
            >
              Add Amount
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {loading ? (
        <div style={{ marginTop: "20px" }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  {/* User Profile Skeletons */}
                  <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="20%" height={20} />
                </Box>
                {/* Add Amount Button Skeleton */}
                <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: "8px" }} />
              </Box>

              <Box sx={{ mt: 4 }}>
                {/* Year Header Skeleton */}
                <Skeleton variant="text" width="15%" height={28} sx={{ mb: 2 }} />
                {/* Contribution list grid skeleton */}
                <Grid container spacing={2}>
                  {[1, 2, 3, 4].map((item) => (
                    <Grid item xs={12} md={3} key={item}>
                      <Skeleton variant="rectangular" height={45} sx={{ borderRadius: "5px" }} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Card>
            <CardContent>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Typography
                    style={{
                      fontSize: "18px",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                    }}
                  >
                    {tasks?.userName}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "14px",
                      fontFamily: "Poppins",
                      fontWeight: "500",
                      color: "#8789A3",
                    }}
                  >
                    {tasks?.fatherName}
                  </Typography>
                </div>
              </div>

              {/* Filter container */}
              <div
                style={{
                  position: "relative",
                }}
              >
                <FormControl
                  style={{
                    position: "absolute",
                    top: "-53px",
                    right: "10px",
                    zIndex: 1, // Ensure the filter is above content
                  }}
                >
                  <Select
                    value={filterYear}
                    onChange={handleFilterChange}
                    displayEmpty
                    variant="outlined"
                    style={{
                      height: "40px",
                      color: "#9055FF",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                    }}
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {availableYears?.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div style={{ marginTop: "10px" }}>
                  <Button
                    style={{
                      textTransform: "none",
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: "600",
                      background: `linear-gradient(135deg, gray 0%, black 100%)`,
                    }}
                    onClick={handleClickOpen}
                    variant="contained"
                  >
                    Add Amount
                  </Button>
                </div>
              </div>

              {tasks?.imam?.map(
                (yearData) =>
                  // Apply year filter if selected, or display all.imam
                  (!filterYear || filterYear === yearData?.year) && (
                    <div key={yearData?.year} style={{ marginTop: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", // Center vertically
                          fontSize: "18px",
                          fontFamily: "Poppins",
                          fontWeight: "600",
                          color: `#9055FF`,
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            marginRight: "8px",
                            color: "black",
                          }}
                        >
                          Year
                        </span>
                        <KeyboardArrowRightRoundedIcon
                          style={{
                            width: "20px",
                            height: "20px",
                            color: "#8789A3",
                          }}
                        />
                        {yearData?.year}
                      </div>
                      <Grid container>
                        {yearData?.months?.map((month, index) => (
                          <Grid item xs={12} md={3} key={index}>
                            <div>
                              <Typography
                                style={{
                                  fontSize: "15px",
                                  fontFamily: "Poppins",
                                  fontWeight: "600",
                                  backgroundColor: "#eaf9f6",
                                  color: "#19b89e",

                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between", // To space items horizontally
                                  marginLeft: "4px",
                                  marginTop: "5px",
                                  marginBottom: "5px",
                                  borderRadius: "5px",
                                }}
                              >
                                <div style={{ paddingLeft: "10px" }}>
                                  {month?.day}-{getMonthName(month.month)}
                                </div>
                                <div style={{ paddingRight: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span>{month?.amount} &#8377;</span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteMonth(yearData.year, index)}
                                    style={{ color: "#d32f2f", padding: 0 }}
                                  >
                                    <CloseRoundedIcon style={{ fontSize: "16px" }} />
                                  </IconButton>
                                </div>
                              </Typography>
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  )
              )}
            </CardContent>
          </Card>
          {/* Toastify */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      )}
    </>
  );
};

export default AddAmountForImam;
