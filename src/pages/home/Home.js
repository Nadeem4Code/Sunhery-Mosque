import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Components
import FivePillars from "../../components/mosque/FivePillars";

// Importing the react router
import { Outlet } from "react-router-dom";

// List

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";

// Css file
import "./Home.css";

// Icons
import QuranIcon from "../../components/common/QuranIcon";
import book from "../../assets/icons/book.svg";
import one from "../../assets/icons/one.svg";
import two from "../../assets/icons/two.svg";
import three from "../../assets/icons/three.svg";
import four from "../../assets/icons/four.svg";
import five from "../../assets/icons/five.svg";
import bismillah from "../../assets/icons/bismillah.svg";

// Progress bar
import Stack from "@mui/material/Stack";

// Importing Image

// Card Import
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const NextPrayerCard = () => {
  const [nextPrayer, setNextPrayer] = React.useState(null);
  const [timeLeftStr, setTimeLeftStr] = React.useState("");

  React.useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;

      const prayers = [
        { name: "Fajar", timeStr: "5:40 AM", timeInSeconds: (5 * 60 + 40) * 60, arabic: "فجر" },
        { name: "Zohar", timeStr: "1:30 PM", timeInSeconds: (13 * 60 + 30) * 60, arabic: "زوهر" },
        { name: "Asar", timeStr: "5:30 PM", timeInSeconds: (17 * 60 + 30) * 60, arabic: "اثر" },
        { name: "Maghrib", timeStr: "7:10 PM", timeInSeconds: (19 * 60 + 10) * 60, arabic: "مغرب" },
        { name: "Isha", timeStr: "8:30 PM", timeInSeconds: (20 * 60 + 30) * 60, arabic: "عشا" },
      ];

      // Find the next prayer
      let next = null;
      let diffInSeconds = 0;

      for (let i = 0; i < prayers.length; i++) {
        if (prayers[i].timeInSeconds > currentTimeInSeconds) {
          next = prayers[i];
          diffInSeconds = prayers[i].timeInSeconds - currentTimeInSeconds;
          break;
        }
      }

      if (!next) {
        // Next is Fajar of tomorrow
        next = prayers[0];
        // Time left = remaining seconds of today + Fajar time tomorrow
        diffInSeconds = (24 * 3600 - currentTimeInSeconds) + prayers[0].timeInSeconds;
      }

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      
      let timeLeft = "";
      if (hours > 0) {
        timeLeft += `${hours}h `;
      }
      if (hours > 0 || minutes > 0) {
        timeLeft += `${minutes}m `;
      }
      timeLeft += `${seconds}s`;

      setNextPrayer(next);
      setTimeLeftStr(timeLeft);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  if (!nextPrayer) return null;

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #863ED5 0%, #240F4F 100%)", // Premium deep purple gradient
        color: "#fff",
        borderRadius: "5px",
        boxShadow: "0 8px 32px 0 rgba(134, 62, 213, 0.2)",
        position: "relative",
        overflow: "hidden",
        p: 2.5,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px 0 rgba(134, 62, 213, 0.35)",
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.9,
            }}
          >
            Upcoming Prayer
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "24px",
              fontWeight: "700",
              mt: 0.5,
              lineHeight: 1.2,
            }}
          >
            {nextPrayer.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: "500",
              opacity: 0.85,
              mt: 0.5,
            }}
          >
            Starts at {nextPrayer.timeStr}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: "700",
              fontFamily: "Poppins",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {nextPrayer.arabic}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "12px",
              fontWeight: "600",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              px: 1.5,
              py: 0.5,
              mt: 1,
              display: "inline-block",
            }}
          >
            in {timeLeftStr}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: "100px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Card style={{ boxShadow: "none" }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                    
                      <Grid item xs={12} md={12}>
                        <Card
                          sx={{
                            minWidth: 275,
                            background: `linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)`,
                            color: "#fff",
                          }}
                        >
                          <div
                            style={{
                              position: "relative", // Added position relative
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              alignItems: "flex-start", // Changed alignItems to flex-start
                            }}
                          >
                            <img
                              src={book}
                              alt="donation"
                              style={{
                                position: "absolute",
                                top: 20,
                                left: 20,
                              }}
                            />
                            <Typography
                              style={{
                                position: "absolute",
                                top: 15,
                                left: 47,
                                fontStyle: "normal",
                                fontWeight: "500",
                                fontSize: "14px",
                                fontFamily: "Poppins",
                              }}
                            >
                              Donate Now
                            </Typography>

                            <Typography
                              style={{
                                position: "absolute",
                                top: isMobile ? 45 : 50,
                                left: 20,
                                fontStyle: "normal",
                                fontWeight: "400",
                                fontSize: isMobile ? "12px" : "13px",
                                fontFamily: "Poppins",
                              }}
                            >
                              The best among you are <br />
                              those who bring greatest <br />
                              benefits to many others
                            </Typography>
                            <Typography
                              style={{
                                position: "absolute",
                                top: isMobile ? 115 : 125,
                                left: 20,
                                fontStyle: "normal",
                                fontWeight: "600",
                                fontSize: isMobile ? "13px" : "16px",
                                fontFamily: "Poppins",
                              }}
                            >
                              –Muhammad S.A.W.
                            </Typography>
                          </div>
                          {/*Fit content in any screen size*/}
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              alignItems: "flex-start",
                            }}
                          >
                            <img
                              src={bismillah}
                              alt="bismillah"
                              style={{
                                position: "absolute",
                                top: 15,
                                right: 20, // Adjust the right position as needed
                                height: isMobile ? "30px" : "30px",
                                width: isMobile ? "120px" : "130px",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              height: isMobile ? "140px" : "170px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                          >
                            <QuranIcon width={isMobile ? "120" : "173"} height={isMobile ? "90" : "97"} />
                          </div>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <NextPrayerCard />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Card
                          style={{
                            height: "202px",
                          }}
                        >
                          <CardContent>
                            <FivePillars />
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/*Five Times Namaz*/}
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Box>
                              <nav>
                                <List
                                  subheader={
                                    <ListSubheader
                                      style={{
                                        fontFamily: "Poppins",
                                        fontStyle: "normal",
                                        fontWeight: "600",
                                        fontSize: "16px",
                                        lineHeight: "24px",
                                        color: " #672CBC",
                                      }}
                                      component="div"
                                    >
                                      Five Times Namaz
                                    </ListSubheader>
                                  }
                                >
                                  {/*Fajar*/}
                                  <Divider
                                    style={{
                                      width: "100%", // Set width to 100%
                                      border: "1px solid #672CBC",
                                      margin: "10px 0", // Adjust margin
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={one}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Fajar
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 5.40 AM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        فجر
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                  {/*Zohar*/}
                                  <Divider
                                    style={{
                                      width: "100%",
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                      border:
                                        "1px solid rgba(187, 196, 206, 0.35)",
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={two}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Zohar
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 1.30 PM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        زوہر
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                  {/*Asar*/}
                                  <Divider
                                    style={{
                                      width: "100%",
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                      border:
                                        "1px solid rgba(187, 196, 206, 0.35)",
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={three}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Asar
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 5.30 PM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        اثر
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                  {/*Maghrib*/}
                                  <Divider
                                    style={{
                                      width: "100%",
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                      border:
                                        "1px solid rgba(187, 196, 206, 0.35)",
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={four}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Maghrib
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 7.10 PM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        مغرب
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                  {/*Isha*/}
                                  <Divider
                                    style={{
                                      width: "100%",
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                      border:
                                        "1px solid rgba(187, 196, 206, 0.35)",
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={five}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Isha
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 8.30 PM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        عشا
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </nav>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      {/*Other Namaz*/}
                      <Grid item xs={12} md={6}>
                        <Card style={{ boxShadow: "none" }}>
                          <CardContent>
                            <Box>
                              <nav>
                                <List
                                  subheader={
                                    <ListSubheader
                                      style={{
                                        fontFamily: "Poppins",
                                        fontStyle: "normal",
                                        fontWeight: "600",
                                        fontSize: "16px",
                                        lineHeight: "24px",
                                        color: " #672CBC",
                                      }}
                                      component="div"
                                    >
                                      Other Namaz
                                    </ListSubheader>
                                  }
                                >
                                  {/*Juma Namaz*/}
                                  <Divider
                                    style={{
                                      width: "100%", // Set width to 100%
                                      border: "1px solid #672CBC",
                                      margin: "10px 0", // Adjust margin
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={one}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Zuma
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 1.00 PM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        زوما
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                  {/*Eid Ul Fitr*/}
                                  <Divider
                                    style={{
                                      width: "100%",
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                      border:
                                        "1px solid rgba(187, 196, 206, 0.35)",
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={two}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Eid Ul Fitr
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 8.30 AM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        عيد أل فطر
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                  {/*EID UL ZUHA*/}
                                  <Divider
                                    style={{
                                      width: "100%",
                                      marginTop: "5px",
                                      marginBottom: "5px",
                                      border:
                                        "1px solid rgba(187, 196, 206, 0.35)",
                                    }}
                                  />
                                  <ListItem disablePadding>
                                    <ListItemIcon
                                      style={{ marginLeft: "15px" }}
                                    >
                                      <img
                                        src={three}
                                        alt="one"
                                        style={{
                                          height: "36px",
                                          width: "36px",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText>
                                      <Stack direction="column">
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontweight: "500",
                                            fontSize: "16px",

                                            color: "#240F4F",
                                          }}
                                        >
                                          Eid ul zuha
                                        </Typography>
                                        <Typography
                                          style={{
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",

                                            /* identical to box height */
                                            textTransform: "uppercase",
                                            color: "#8789A3",
                                          }}
                                        >
                                          Time : 8.30 AM
                                        </Typography>
                                      </Stack>
                                      <Typography
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "700",
                                          fontSize: "20px",
                                          color: "#863ED5",
                                          position: "absolute",
                                          right: 14,
                                          top: 6,
                                        }}
                                      >
                                        عيد أل زها
                                      </Typography>
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </nav>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Outlet />
    </>
  );
};
export default Home;
