import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//Firebase
import { getTaskById } from "../../config/firebase";

// Loader

import CircularProgress from "@mui/material/CircularProgress";

// Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

const UserDetails = () => {
  const params = useParams();

  const [filterYear, setFilterYear] = useState(""); // State for selected year filter

  // Firebase
  const [tasks, setTask] = useState([]);
  const [loading, setLoading] = useState(true);

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
  // Extract unique years from tasks data
  const availableYears = Array.from(
    new Set(tasks?.mosque?.map((year) => year.year))
  );

  // Handle year filter change
  const handleFilterChange = (event) => {
    setFilterYear(event.target.value);
  };
  console.log("user", tasks);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress color="success" />
        </div>
      ) : (
        <div style={{ marginTop: "100px" }}>
          <Card>
            <CardContent>
              <Typography
                style={{
                  fontSize: "18px",
                  fontFamily: "Poppins",
                  fontWeight: "600",
                }}
              >
                {tasks.userName}
              </Typography>
              <Typography
                style={{
                  fontSize: "14px",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  color: "#8789A3",
                }}
              >
                {tasks.fatherName}
              </Typography>

              {/* Filter container */}
              <div
                style={{
                  position: "relative",
                }}
              >
                <FormControl
                  style={{
                    position: "absolute",
                    top: "-40px",
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
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {tasks?.mosque?.map(
                (yearData) =>
                  // Apply year filter if selected, or display all years
                  (!filterYear || filterYear === yearData.year) && (
                    <div key={yearData.year} style={{ marginTop: "20px" }}>
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
                        {yearData.year}
                      </div>
                      <Grid container>
                        {yearData?.months?.map((month, index) => (
                          <Grid item xs={12} md={3} key={month.month}>
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
                                  {month.day}-{getMonthName(month.month)}
                                </div>
                                <div style={{ paddingRight: "10px" }}>
                                  {month.amount} &#8377;
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
        </div>
      )}
    </>
  );
};

export default UserDetails;
