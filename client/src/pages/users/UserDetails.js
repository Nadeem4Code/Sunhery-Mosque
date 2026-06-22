import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//Firebase
import { getTaskById } from "../../config/firebase";

// Loader
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

// Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const UserDetails = () => {
  const params = useParams();

  const [filterYear, setFilterYear] = useState(""); // State for selected year filter
  const [activeTab, setActiveTab] = useState(0); // 0 = Mosque Fund, 1 = Imam Fund

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

  // Extract unique years from tasks data (both mosque and imam)
  const mosqueYears = tasks?.mosque?.map((year) => year.year) || [];
  const imamYears = tasks?.imam?.map((year) => year.year) || [];
  const availableYears = Array.from(
    new Set([...mosqueYears, ...imamYears].filter(Boolean))
  );

  // Handle year filter change
  const handleFilterChange = (event) => {
    setFilterYear(event.target.value);
  };
  console.log("user", tasks);

  return (
    <>
      {loading ? (
        <div style={{ marginTop: "100px" }}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                {/* Name Skeleton */}
                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
                {/* Father Name Skeleton */}
                <Skeleton variant="text" width="25%" height={20} />
              </Box>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3, mb: 2, display: "flex", gap: 2 }}>
                <Skeleton variant="rectangular" width={120} height={40} />
                <Skeleton variant="rectangular" width={160} height={40} />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Skeleton variant="text" width="15%" height={28} sx={{ mb: 2 }} />
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
        <div style={{ marginTop: "100px" }}>
          <Card>
            <CardContent>
              <Box>
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
              </Box>

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

              {/* TABS to switch between Mosque and Imam Funds */}
              <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3, mb: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, val) => setActiveTab(val)}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="donation fund tabs"
                >
                  <Tab label="Mosque Fund" style={{ fontFamily: "Poppins", fontWeight: "600", textTransform: "none" }} />
                  <Tab label="Imam & Staff Fund" style={{ fontFamily: "Poppins", fontWeight: "600", textTransform: "none" }} />
                </Tabs>
              </Box>

              {/* Render Mosque Fund Contributions */}
              {activeTab === 0 && (
                tasks?.mosque && tasks.mosque.length > 0 ? (
                  tasks.mosque.map(
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
                  )
                ) : (
                  <Typography style={{ fontFamily: "Poppins", padding: "20px", color: "#8789A3" }}>
                    No Mosque contributions found.
                  </Typography>
                )
              )}

              {/* Render Imam Fund Contributions */}
              {activeTab === 1 && (
                tasks?.imam && tasks.imam.length > 0 ? (
                  tasks.imam.map(
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
                  )
                ) : (
                  <Typography style={{ fontFamily: "Poppins", padding: "20px", color: "#8789A3" }}>
                    No Imam contributions found.
                  </Typography>
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
