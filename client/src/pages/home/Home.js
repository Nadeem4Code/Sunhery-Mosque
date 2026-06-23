import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import UserContext from "../../context/BooksContext";
import axios from "axios";

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
import Brightness3Icon from "@mui/icons-material/Brightness3";
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
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";

// Dialog & Table Imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
        minHeight: { xs: "auto", md: "205px" },
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

const IslamicDateCard = () => {
  const [hijriDate, setHijriDate] = useState("");
  const [hijriDateAr, setHijriDateAr] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");

  React.useEffect(() => {
    const today = new Date();
    
    // Configurable offset in days (for moonsighting adjustments)
    const hijriOffset = -1; 
    const adjustedDate = new Date(today);
    adjustedDate.setDate(today.getDate() + hijriOffset);

    // Format English Hijri
    try {
      const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).formatToParts(adjustedDate);
      
      let day = '';
      let month = '';
      let year = '';
      parts.forEach(p => {
        if (p.type === 'day') day = p.value;
        if (p.type === 'month') month = p.value;
        if (p.type === 'year') year = p.value;
      });
      setHijriDate(`${day} ${month} ${year} AH`);
    } catch (e) {
      setHijriDate("Islamic Calendar");
    }

    // Format Arabic Hijri
    try {
      const formattedAr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(adjustedDate);
      setHijriDateAr(formattedAr);
    } catch (e) {
      setHijriDateAr("");
    }

    // Format Gregorian
    const gregOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setGregorianDate(new Intl.DateTimeFormat('en-US', gregOptions).format(today));
  }, []);

  return (
    <Card
      sx={{
        bgcolor: "#ffffff", // Pure white like admin dashboard
        border: "1px solid rgba(0, 0, 0, 0.08)", // Muted border
        borderRadius: "12px", // Matching 12px border radius
        boxShadow: "0 15px 20px -15px rgba(103, 44, 188, 0.06)", // Soft purple shadow
        position: "relative",
        overflow: "hidden",
        p: 3,
        minHeight: { xs: "auto", md: "205px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 25px -15px rgba(103, 44, 188, 0.12)",
        }
      }}
    >
      {/* Accent left border strip */}
      <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: "#672CBC" }} />
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography
            sx={{
              fontFamily: "Inter, Poppins, sans-serif",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#8789A3", // Muted label
            }}
          >
            Islamic Calendar
          </Typography>
          <Typography
            sx={{
              fontFamily: "Hanken Grotesk, Poppins, sans-serif",
              fontSize: "22px",
              fontWeight: "700",
              color: "#240F4F", // Deep color like total donors value
              mt: 1.5,
              lineHeight: 1.2,
            }}
          >
            {hijriDate}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            bgcolor: "rgba(103, 44, 188, 0.1)", 
            width: 36, 
            height: 36, 
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Brightness3Icon sx={{ color: "#672CBC", fontSize: "20px", transform: "rotate(-15deg)" }} />
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Typography
          sx={{
            fontFamily: "Inter, Poppins, sans-serif",
            fontSize: "12.5px",
            fontWeight: "500",
            color: "#8789A3",
          }}
        >
          {gregorianDate}
        </Typography>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "700",
            fontFamily: "Poppins, sans-serif",
            color: "#672CBC", // Distinct purple for Arabic text
            lineHeight: 1,
          }}
        >
          {hijriDateAr}
        </Typography>
      </Box>
    </Card>
  );
};

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { books } = useContext(UserContext);
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expenditures, setExpenditures] = useState([]);

  React.useEffect(() => {
    axios.get("http://localhost:3001/expenditures")
      .then((res) => {
        setExpenditures(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load expenditures for home page:", err);
      });
  }, []);

  // Detailed lists of expenses for transparency dynamically mapped
  const mosqueExpenses = expenditures
    .filter((exp) => exp.category !== "Imam")
    .map((exp) => {
      let icon = "🪙";
      if (exp.category === "Construction") icon = "🏗️";
      else if (exp.category === "Maintenance & Repair") icon = "🔧";
      else if (exp.category === "Utilities & Bills") icon = "💡";
      
      return {
        icon,
        item: exp.description || exp.category,
        category: exp.category,
        cost: exp.amount
      };
    });

  const imamExpenses = expenditures
    .filter((exp) => exp.category === "Imam")
    .map((exp) => ({
      icon: "👳",
      item: exp.description || exp.category,
      category: exp.category,
      cost: exp.amount
    }));

  // Calculate total mosque and imam donations dynamically
  let totalMosqueReceived = 0;
  let totalImamReceived = 0;

  if (books && Array.isArray(books)) {
    books.forEach((book) => {
      // 1. Check mosque contributions
      if (book.mosque && Array.isArray(book.mosque)) {
        book.mosque.forEach((yearItem) => {
          if (yearItem.months && Array.isArray(yearItem.months)) {
            yearItem.months.forEach((monthItem) => {
              if (monthItem.amount) {
                totalMosqueReceived += Number(monthItem.amount);
              }
            });
          }
        });
      }

      // 2. Check imam contributions
      if (book.imam && Array.isArray(book.imam)) {
        book.imam.forEach((yearItem) => {
          if (yearItem.months && Array.isArray(yearItem.months)) {
            yearItem.months.forEach((monthItem) => {
              if (monthItem.amount) {
                totalImamReceived += Number(monthItem.amount);
              }
            });
          }
        });
      }

      // 3. Fallback for legacy years/months format
      if (book.years && Array.isArray(book.years)) {
        book.years.forEach((yearItem) => {
          if (yearItem.months && Array.isArray(yearItem.months)) {
            yearItem.months.forEach((monthItem) => {
              if (monthItem.amount) {
                totalMosqueReceived += Number(monthItem.amount);
              }
            });
          }
        });
      }
    });
  }

  // Dynamic spent amounts from fetched expenditures
  const MOSQUE_SPENT = expenditures
    .filter((exp) => exp.category !== "Imam")
    .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const IMAM_SPENT = expenditures
    .filter((exp) => exp.category === "Imam")
    .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  // Calculate percentages (safety limit to max 100%)
  const mosquePercent = totalMosqueReceived > 0 
    ? Math.min(Math.round((MOSQUE_SPENT / totalMosqueReceived) * 100), 100) 
    : 0;

  const imamPercent = totalImamReceived > 0 
    ? Math.min(Math.round((IMAM_SPENT / totalImamReceived) * 100), 100) 
    : 0;

  return (
    <>
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: "24px" }}>
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
                      <Grid item xs={12} sm={6}>
                        <NextPrayerCard />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <IslamicDateCard />
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

                  {/* Hadith Card (Left Column) */}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        background: "linear-gradient(135deg, #863ED5 0%, #240F4F 100%)", // Deep purple gradient
                        color: "#fff",
                        borderRadius: "5px",
                        boxShadow: "0 8px 32px 0 rgba(134, 62, 213, 0.2)",
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minHeight: "260px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 40px 0 rgba(134, 62, 213, 0.35)",
                        }
                      }}
                    >
                      <Box textAlign="center">
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            opacity: 0.8,
                            mb: 2,
                          }}
                        >
                          Hadith of the Day
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "20px", sm: "24px" },
                            fontWeight: "600",
                            mb: 2,
                            color: "#DF98FA", // Highlight color
                            lineHeight: 1.4,
                          }}
                        >
                          «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ»
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: { xs: "13px", sm: "14.5px" },
                            fontStyle: "italic",
                            fontWeight: "400",
                            lineHeight: 1.6,
                            opacity: 0.9,
                            mb: 1.5,
                          }}
                        >
                          "Actions are judged by their intentions, and every person will get what they intended."
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: "600",
                            opacity: 0.7,
                          }}
                        >
                          — Sahih al-Bukhari 1
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>

                  {/* Charity Progress & Spent Card (Right Column) */}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        backgroundColor: "#fff",
                        color: "#240F4F",
                        borderRadius: "5px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        p: 3,
                        height: "100%",
                        minHeight: "260px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        border: "1px solid rgba(187, 196, 206, 0.35)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                        }
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#672CBC",
                            mb: 2,
                          }}
                        >
                          Financial Transparency
                        </Typography>

                        {/* Mosque Fund Meter */}
                        <Box sx={{ mb: 2.5 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", fontWeight: "600", color: "#240F4F" }}>
                              Mosque Fund (Renovations & Bills)
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", fontWeight: "700", color: "#863ED5" }}>
                              {mosquePercent}% Spent
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={mosquePercent}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "rgba(144, 85, 255, 0.12)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                background: "linear-gradient(90deg, #DF98FA 0%, #9055FF 100%)",
                              },
                              my: 0.8,
                            }}
                          />
                          <Box display="flex" justifyContent="space-between" opacity={0.8}>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "500" }}>
                              Collected: ₹{totalMosqueReceived.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "500" }}>
                              Spent: ₹{MOSQUE_SPENT.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", color: "#672CBC" }}>
                              Balance: ₹{(totalMosqueReceived - MOSQUE_SPENT).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Imam Fund Meter */}
                        <Box sx={{ mb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", fontWeight: "600", color: "#240F4F" }}>
                              Imam & Staff Fund (Salaries & Care)
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "12px", fontWeight: "700", color: "#863ED5" }}>
                              {imamPercent}% Spent
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={imamPercent}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "rgba(144, 85, 255, 0.12)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                background: "linear-gradient(90deg, #DF98FA 0%, #9055FF 100%)",
                              },
                              my: 0.8,
                            }}
                          />
                          <Box display="flex" justifyContent="space-between" opacity={0.8}>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "500" }}>
                              Collected: ₹{totalImamReceived.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "500" }}>
                              Spent: ₹{IMAM_SPENT.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", fontWeight: "600", color: "#672CBC" }}>
                              Balance: ₹{(totalImamReceived - IMAM_SPENT).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        onClick={() => setDetailsOpen(true)}
                        variant="contained"
                        fullWidth
                        sx={{
                          background: "linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)",
                          color: "#fff",
                          fontFamily: "Poppins",
                          fontWeight: "600",
                          textTransform: "none",
                          fontSize: "13px",
                          boxShadow: "none",
                          "&:hover": {
                            background: "linear-gradient(135deg, #9055FF 0%, #DF98FA 100%)",
                            boxShadow: "none",
                          }
                        }}
                      >
                        Show Details
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Outlet />

      {/* Financial Transparency Details Modal */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "8px",
            fontFamily: "Poppins",
          }
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #863ED5 0%, #240F4F 100%)",
            color: "#fff",
            fontFamily: "Poppins",
            fontWeight: "600",
            fontSize: "18px",
            pb: 2,
          }}
        >
          Financial Transparency Details
        </DialogTitle>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => setActiveTab(val)}
          variant="fullWidth"
          sx={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            "& .MuiTab-root": {
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "13px",
              color: "#240F4F",
            },
            "& .Mui-selected": {
              color: "#672CBC !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#672CBC",
            }
          }}
        >
          <Tab label="Mosque Fund" />
          <Tab label="Imam & Staff Fund" />
        </Tabs>
        
        <DialogContent sx={{ p: 2.5 }}>
          {activeTab === 0 ? (
            <Box>
              {/* Summary Block */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(144, 85, 255, 0.05)", 
                  borderRadius: "5px", 
                  border: "1px solid rgba(134, 62, 213, 0.15)" 
                }}
              >
                <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "600", color: "#240F4F", mb: 1 }}>
                  Summary Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3" }}>Total Collected</Typography>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#240F4F" }}>
                      ₹{totalMosqueReceived.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3" }}>Total Spent</Typography>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#E03131" }}>
                      ₹{MOSQUE_SPENT.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3" }}>Net Balance</Typography>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#0CA678" }}>
                      ₹{(totalMosqueReceived - MOSQUE_SPENT).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "600", color: "#240F4F", mb: 1.5 }}>
                Itemized Expenses
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px" }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "Poppins", fontWeight: "600" }}>Item</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins", fontWeight: "600" }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontFamily: "Poppins", fontWeight: "600" }}>Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mosqueExpenses.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontFamily: "Poppins", fontSize: "12.5px" }}>
                          <span style={{ marginRight: "8px" }}>{row.icon}</span>
                          {row.item}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Poppins", fontSize: "12.5px", color: "#8789A3" }}>{row.category}</TableCell>
                        <TableCell align="right" sx={{ fontFamily: "Poppins", fontSize: "12.5px", fontWeight: "600" }}>
                          ₹{row.cost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box>
              {/* Summary Block */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(144, 85, 255, 0.05)", 
                  borderRadius: "5px", 
                  border: "1px solid rgba(134, 62, 213, 0.15)" 
                }}
              >
                <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "600", color: "#240F4F", mb: 1 }}>
                  Summary Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3" }}>Total Collected</Typography>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#240F4F" }}>
                      ₹{totalImamReceived.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3" }}>Total Spent</Typography>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#E03131" }}>
                      ₹{IMAM_SPENT.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "11px", color: "#8789A3" }}>Net Balance</Typography>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "700", color: "#0CA678" }}>
                      ₹{(totalImamReceived - IMAM_SPENT).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography sx={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "600", color: "#240F4F", mb: 1.5 }}>
                Itemized Expenses
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px" }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "Poppins", fontWeight: "600" }}>Item</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins", fontWeight: "600" }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontFamily: "Poppins", fontWeight: "600" }}>Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {imamExpenses.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontFamily: "Poppins", fontSize: "12.5px" }}>
                          <span style={{ marginRight: "8px" }}>{row.icon}</span>
                          {row.item}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Poppins", fontSize: "12.5px", color: "#8789A3" }}>{row.category}</TableCell>
                        <TableCell align="right" sx={{ fontFamily: "Poppins", fontSize: "12.5px", fontWeight: "600" }}>
                          ₹{row.cost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 2.5, pb: 2.5 }}>
          <Button 
            onClick={() => setDetailsOpen(false)}
            sx={{
              color: "#672CBC",
              fontFamily: "Poppins",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(103, 44, 188, 0.05)",
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Home;
