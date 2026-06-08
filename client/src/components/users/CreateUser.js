import { useState } from "react";
import { createTask } from "../../config/firebase";

// Grid
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";

// Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// React Toastify is used to show the alert
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Date Picker

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function CreateUser() {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isError, setIsError] = useState(false);
  const [fatherName, setFatherName] = useState("");

  const [hasError, setHasError] = useState(false);

  // Date Picker
  const [date, setDate] = useState(null);
  const handleDate = (newDate) => {
    setDate(newDate);
    // Check for errors and set the error state accordingly
    setHasError(newDate === null);
  };
  const selectedDate = dayjs(date);

  const year = selectedDate.format("YYYY"); // Get the year
  const month = selectedDate.format("MM"); // Get the month (01 for January, 02 for February, etc.)
  const day = selectedDate.format("DD"); // Get the day of the month

  console.log("Years", year, month, day);

  const handleChange = (event) => {
    setUserName(event.target.value);
  };
  const handleFather = (event) => {
    setFatherName(event.target.value);
  };
  const handleNumber = (e) => {
    let inputValue = e.target.value;
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10); // Truncate the input value to 10 digits
    }
    setPhoneNumber(inputValue);
    setIsError(inputValue.length !== 10);
  };
  // Function for react toastify
  const displayLoginNotification = () => {
    toast.success("User Added Successfully !");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phoneNumber.length !== 10) {
      setIsError(true);
      return
    }
    if (date === null) {
      setHasError(true); // Set the date error flag
      return; // Return early without creating the user
    }

    createTask(userName, phoneNumber, fatherName, year, month, day, 0); // Replace 0 with the actual amount value
    setUserName("");
    setPhoneNumber("");
    setFatherName("");

    setDate(null);
    // Calling Toastify function inside the submit
    displayLoginNotification();
    console.log(userName, phoneNumber, fatherName, year, month, day);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              flex: 1,
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Card style={{ boxShadow: "none" }}>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    variant="standard"
                    size="small"
                    required
                    label="Name"
                    type="string"
                    value={userName}
                    onChange={handleChange}
                    component="div"
                    autoFocus={true}
                    color="secondary"
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <br />
                  <TextField
                    variant="standard"
                    size="small"
                    required
                    label="Father"
                    type="string"
                    value={fatherName}
                    onChange={handleFather}
                    component="div"
                    color="secondary"
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <br />
                  <TextField
                    variant="standard"
                    size="small"
                    helperText={isError ? "Number should be 10 digits" : ""}
                    label="Number"
                    required
                    value={phoneNumber}
                    onChange={handleNumber}
                    component="div"
                    error={isError}
                    type="number"
                    color="secondary"
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <br />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={date}
                      onChange={handleDate}
                      slotProps={{
                        textField: {
                          required: true,
                          size: "small",
                          error: hasError,
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <br />
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto",
                      background: `linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)`,
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 500,
                      marginTop: "10px",
                    }}
                  >
                    Add
                  </Button>
                </form>
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default CreateUser;
