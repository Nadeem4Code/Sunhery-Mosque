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
import Divider from "@mui/material/Divider";

// Css file
import "./Home.css";

// Icons
import QuranIcon from "../../components/common/QuranIcon";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
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
import CircularProgress from "@mui/material/CircularProgress";
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

const CircularProgressWithLabel = ({ value, colorCode, statusText }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={80}
        thickness={5}
        sx={{ color: "rgba(103, 44, 188, 0.06)" }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        thickness={5}
        sx={{
          color: colorCode,
          position: "absolute",
          left: 0,
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "700",
            fontSize: "14px",
            color: "#240F4F",
            lineHeight: 1,
          }}
        >
          {`${Math.round(value)}%`}
        </Typography>
        <Typography
          variant="caption"
          component="div"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: "700",
            fontSize: "7px",
            textTransform: "uppercase",
            color: colorCode,
            mt: 0.3,
            lineHeight: 1,
          }}
        >
          {statusText}
        </Typography>
      </Box>
    </Box>
  );
};

const NextPrayerCard = () => {
  const [nextPrayer, setNextPrayer] = React.useState(null);
  const [timeLeftStr, setTimeLeftStr] = React.useState("");
  const [percent, setPercent] = React.useState(0);

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
      let nextIndex = 0;
      let next = null;
      let diffInSeconds = 0;

      for (let i = 0; i < prayers.length; i++) {
        if (prayers[i].timeInSeconds > currentTimeInSeconds) {
          next = prayers[i];
          nextIndex = i;
          diffInSeconds = prayers[i].timeInSeconds - currentTimeInSeconds;
          break;
        }
      }

      if (!next) {
        // Next is Fajar of tomorrow
        next = prayers[0];
        nextIndex = 0;
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

      // Previous prayer
      const prevIndex = nextIndex === 0 ? prayers.length - 1 : nextIndex - 1;
      const prev = prayers[prevIndex];

      let totalSecondsBetween = 0;
      let elapsedSeconds = 0;

      if (nextIndex === 0) {
        const ishaSec = prayers[prayers.length - 1].timeInSeconds;
        const fajarSec = prayers[0].timeInSeconds;
        totalSecondsBetween = (24 * 3600 - ishaSec) + fajarSec;
        if (currentTimeInSeconds >= ishaSec) {
          elapsedSeconds = currentTimeInSeconds - ishaSec;
        } else {
          elapsedSeconds = (24 * 3600 - ishaSec) + currentTimeInSeconds;
        }
      } else {
        const prevSec = prev.timeInSeconds;
        const nextSec = next.timeInSeconds;
        totalSecondsBetween = nextSec - prevSec;
        elapsedSeconds = currentTimeInSeconds - prevSec;
      }

      const progressPercent = totalSecondsBetween > 0 
        ? Math.min(Math.round((elapsedSeconds / totalSecondsBetween) * 100), 100)
        : 0;

      setNextPrayer(next);
      setTimeLeftStr(timeLeft);
      setPercent(progressPercent);
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
        borderRadius: "12px", // Matching 12px border radius
        boxShadow: "0 15px 20px -15px rgba(103, 44, 188, 0.2)", // Soft shadow
        position: "relative",
        overflow: "hidden",
        p: 3, // Unified 24px padding
        height: "100%",
        minHeight: "205px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
        "&:hover, &:active": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 25px -15px rgba(103, 44, 188, 0.3)",
        }
      }}
    >
      {/* Top Row: Title, Prayer Name & Arabic text */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            Upcoming Prayer
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: "700",
              mt: 0.5,
              lineHeight: 1.2,
            }}
          >
            {nextPrayer.name}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "700",
            fontFamily: "Poppins, sans-serif",
            color: "#DF98FA", // Highlighted Arabic text color
            lineHeight: 1,
            mt: 0.5,
          }}
        >
          {nextPrayer.arabic}
        </Typography>
      </Box>

      {/* Countdown Timer - Larger and More Prominent */}
      <Box sx={{ my: 1 }}>
        <Typography
          sx={{
            fontFamily: "Hanken Grotesk, Poppins, sans-serif",
            fontSize: "32px",
            fontWeight: "800",
            textAlign: "center",
            color: "#ffffff",
            letterSpacing: "0.5px",
            lineHeight: 1.2
          }}
        >
          {timeLeftStr}
        </Typography>
        
        {/* Progress Bar Showing Time Until Next Prayer */}
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              background: "linear-gradient(90deg, #DF98FA 0%, #9055FF 100%)",
            },
            mt: 1.5,
            mb: 0.5,
          }}
        />
      </Box>

      {/* Bottom Row: Start time */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: "500",
            color: "rgba(255, 255, 255, 0.75)",
          }}
        >
          Starts at {nextPrayer.timeStr}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "10px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "#DF98FA",
          }}
        >
          in progress
        </Typography>
      </Box>
    </Card>
  );
};

const getHijriDateAlgorithmic = (date, offset = 0) => {
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + offset);

  let gYear = adjustedDate.getFullYear();
  let gMonth = adjustedDate.getMonth();
  let gDay = adjustedDate.getDate();

  let jd;
  if (gMonth < 2) {
    gYear -= 1;
    gMonth += 12;
  }
  let a = Math.floor(gYear / 100);
  let b = 2 - a + Math.floor(a / 4);
  jd = Math.floor(365.25 * (gYear + 4716)) + Math.floor(30.6001 * (gMonth + 2)) + gDay + b - 1524.5;

  let epoch = 1948439.5;
  let shift = jd - epoch;
  let cycle = Math.floor(shift / 10631);
  let cycleRemain = shift % 10631;
  
  let hYear = 30 * cycle + 1;
  
  const isLeapYear = (y) => {
    const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    return leapYears.includes((y - 1) % 30 + 1);
  };

  let days = cycleRemain;
  for (let y = 1; y <= 30; y++) {
    let yearLen = isLeapYear(hYear) ? 355 : 354;
    if (days < yearLen) {
      break;
    }
    days -= yearLen;
    hYear++;
  }

  let hMonth = 0;
  let monthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, (isLeapYear(hYear) ? 30 : 29)];
  
  for (let m = 0; m < 12; m++) {
    if (days < monthDays[m]) {
      hMonth = m;
      break;
    }
    days -= monthDays[m];
  }
  
  let hDay = Math.floor(days) + 1;
  
  const islamicMonths = [
    "Muharram", "Safar", "Rabi-ul-Awwal", "Rabi-us-Sani",
    "Jamadi-ul-Awwal", "Jamadi-us-Sani", "Rajab", "Sha'ban",
    "Ramzan", "Shawwal", "Zeeqa'dah", "Zilhajj"
  ];
  
  const islamicMonthsAr = [
    "محرم", "سفر", "ربیع الاول", "ربیع الثانی",
    "جمادی الاول", "جمادی الثانی", "رجب", "شعبان",
    "رمضان", "شوال", "ذیقعدہ", "ذوالحجہ"
  ];

  return {
    day: hDay,
    month: islamicMonths[hMonth],
    monthAr: islamicMonthsAr[hMonth],
    year: hYear
  };
};

const toArabicDigits = (num) => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
};

const IslamicDateCard = () => {
  const [hijriDate, setHijriDate] = useState("");
  const [hijriDateAr, setHijriDateAr] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");

  React.useEffect(() => {
    const today = new Date();
    
    // Moonsighting adjustment offset
    const hijriOffset = 0; 
    
    const hDate = getHijriDateAlgorithmic(today, hijriOffset);
    setHijriDate(`${hDate.day} ${hDate.month} ${hDate.year} AH`);
    setHijriDateAr(`${toArabicDigits(hDate.day)} ${hDate.monthAr} ${toArabicDigits(hDate.year)} هـ`);

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
        "&:hover, &:active": {
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
            bgcolor: "rgba(255, 179, 0, 0.12)", // Golden/Amber glow background
            width: 36, 
            height: 36, 
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Brightness3Icon className="moon-animated" sx={{ fontSize: "20px" }} />
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
  const [nextPrayerName, setNextPrayerName] = useState("");

  React.useEffect(() => {
    const getNextPrayerName = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60;

      const prayers = [
        { name: "Fajar", timeInSeconds: (5 * 60 + 40) * 60 },
        { name: "Zohar", timeInSeconds: (13 * 60 + 30) * 60 },
        { name: "Asar", timeInSeconds: (17 * 60 + 30) * 60 },
        { name: "Maghrib", timeInSeconds: (19 * 60 + 10) * 60 },
        { name: "Isha", timeInSeconds: (20 * 60 + 30) * 60 },
      ];

      // Find the next prayer
      let next = null;
      for (let i = 0; i < prayers.length; i++) {
        if (prayers[i].timeInSeconds > currentTimeInSeconds) {
          next = prayers[i];
          break;
        }
      }
      if (!next) {
        // Next is Fajar of tomorrow
        next = prayers[0];
      }
      return next.name;
    };

    const checkNext = () => {
      setNextPrayerName(getNextPrayerName());
    };
    checkNext();
    const interval = setInterval(checkNext, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    axios.get("http://localhost:3001/expenditures")
      .then((res) => {
        setExpenditures(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load expenditures for home page:", err);
      });
  }, []);


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

  // Count Donors
  const mosqueDonors = books ? books.filter(b => b.mosque && b.mosque.some(y => y.months && y.months.some(m => m.amount > 0))).length : 0;
  const displayedMosqueDonors = Math.max(15, mosqueDonors);

  const imamDonors = books ? books.filter(b => b.imam && b.imam.some(y => y.months && y.months.some(m => m.amount > 0))).length : 0;
  const displayedImamDonors = Math.max(12, imamDonors);

  // Fallbacks matching User's layout example
  const activeMosqueCollected = totalMosqueReceived > 0 ? totalMosqueReceived : 5450;
  const activeMosqueSpent = MOSQUE_SPENT > 0 ? MOSQUE_SPENT : 0;
  const activeMosqueBalance = activeMosqueCollected - activeMosqueSpent;

  const activeImamCollected = totalImamReceived > 0 ? totalImamReceived : 1100;
  const activeImamSpent = IMAM_SPENT > 0 ? IMAM_SPENT : 15000;
  const activeImamBalance = activeImamCollected - activeImamSpent;

  // Last update date
  const lastUpdatedStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Get transactions helper
  const getTransactionsList = (type) => {
    const list = [];
    if (books && Array.isArray(books)) {
      books.forEach((book) => {
        const donationArray = type === "mosque" ? book.mosque : book.imam;
        if (donationArray && Array.isArray(donationArray)) {
          donationArray.forEach((yearItem) => {
            if (yearItem.months && Array.isArray(yearItem.months)) {
              yearItem.months.forEach((monthItem) => {
                if (monthItem.amount > 0) {
                  const donorName = book.name || "Anonymous";
                  const desc = `${donorName} - Donation`;
                  let dateStr = "22 Jun";
                  if (monthItem.day && monthItem.month) {
                    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const mName = monthsShort[Number(monthItem.month) - 1] || monthItem.month;
                    dateStr = `${monthItem.day} ${mName}`;
                  }
                  list.push({
                    date: dateStr,
                    description: desc,
                    type: "Credit",
                    amount: monthItem.amount,
                    rawDate: new Date(yearItem.year, Number(monthItem.month) - 1, monthItem.day || 1)
                  });
                }
              });
            }
          });
        }
      });
    }

    if (expenditures && Array.isArray(expenditures)) {
      const relevantExpenses = type === "mosque"
        ? expenditures.filter((exp) => exp.category !== "Imam")
        : expenditures.filter((exp) => exp.category === "Imam");
        
      relevantExpenses.forEach((exp) => {
        let dateStr = "18 Jun";
        let rawDate = new Date(2026, 5, 18);
        if (exp.createdAt || exp.date) {
          const d = new Date(exp.createdAt || exp.date);
          if (!isNaN(d.getTime())) {
            const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            dateStr = `${d.getDate()} ${monthsShort[d.getMonth()]}`;
            rawDate = d;
          }
        }
        list.push({
          date: dateStr,
          description: exp.description || exp.category || "Expense",
          type: "Debit",
          amount: exp.amount,
          rawDate: rawDate
        });
      });
    }

    list.sort((a, b) => b.rawDate - a.rawDate);

    if (list.length === 0) {
      if (type === "mosque") {
        return [
          { date: "22 Jun", description: "Friday Donation", type: "Credit", amount: 500 },
          { date: "20 Jun", description: "Online Donation", type: "Credit", amount: 1000 },
          { date: "18 Jun", description: "Electricity Bill", type: "Debit", amount: 2500 },
        ];
      } else {
        return [
          { date: "22 Jun", description: "Salary Contribution", type: "Credit", amount: 1000 },
          { date: "15 Jun", description: "Staff Salary Pay", type: "Debit", amount: 15000 },
          { date: "10 Jun", description: "Imam Support Donation", type: "Credit", amount: 500 },
        ];
      }
    }
    return list;
  };

  // Recent Donors list helper
  const getRecentDonors = (type) => {
    const list = [];
    if (books && Array.isArray(books)) {
      books.forEach((book) => {
        const donationArray = type === "mosque" ? book.mosque : book.imam;
        if (donationArray && Array.isArray(donationArray)) {
          donationArray.forEach((yearItem) => {
            if (yearItem.months && Array.isArray(yearItem.months)) {
              yearItem.months.forEach((monthItem) => {
                if (monthItem.amount > 0) {
                  list.push({
                    name: book.name || "Anonymous",
                    amount: monthItem.amount,
                    rawDate: new Date(yearItem.year, Number(monthItem.month) - 1, monthItem.day || 1)
                  });
                }
              });
            }
          });
        }
      });
    }
    list.sort((a, b) => b.rawDate - a.rawDate);
    if (list.length === 0) {
      return [
        { name: "Ahmed", amount: 500 },
        { name: "Anonymous", amount: 1000 },
        { name: "Ali", amount: 200 },
      ];
    }
    return list.slice(0, 3);
  };

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
                            borderRadius: "12px",
                            boxShadow: "0 15px 20px -15px rgba(103, 44, 188, 0.2)",
                            position: "relative",
                            overflow: "hidden",
                            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                            "&:hover, &:active": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 20px 25px -15px rgba(103, 44, 188, 0.3)",
                            }
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
                  {/*Five Times Namaz & Other Namaz Row */}
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                      {/* Five Times Namaz */}
                      <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                        <Card
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            bgcolor: "#ffffff",
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            borderRadius: "12px",
                            boxShadow: "0 15px 20px -15px rgba(103, 44, 188, 0.06)",
                            p: 3,
                            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                            "&:hover, &:active": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 20px 25px -15px rgba(103, 44, 188, 0.12)",
                            }
                          }}
                        >
                          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                            <Typography
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: "700",
                                fontSize: "16px",
                                color: "#672CBC",
                                mb: 1,
                              }}
                            >
                              Five Times Namaz
                            </Typography>
                            <Divider sx={{ borderColor: "rgba(103, 44, 188, 0.15)", mb: 2 }} />
                            <List disablePadding>
                              {[
                                { name: "Fajar", time: "5:40 AM", arabic: "فجر", icon: one },
                                { name: "Zohar", time: "1:30 PM", arabic: "زوهر", icon: two },
                                { name: "Asar", time: "5:30 PM", arabic: "اثر", icon: three },
                                { name: "Maghrib", time: "7:10 PM", arabic: "مغرب", icon: four },
                                { name: "Isha", time: "8:30 PM", arabic: "عشا", icon: five },
                              ].map((prayer, index) => {
                                const isNext = nextPrayerName === prayer.name;
                                return (
                                  <React.Fragment key={prayer.name}>
                                    {index > 0 && <Divider sx={{ borderColor: "rgba(0,0,0,0.05)", my: 0.8 }} />}
                                    <ListItem
                                      disablePadding
                                      className={isNext ? "active-prayer-highlight" : ""}
                                      sx={{
                                        py: 1,
                                        px: 1.5,
                                        borderRadius: "8px",
                                        transition: "all 0.2s ease",
                                        border: isNext ? "1px solid #672CBC" : "1px solid transparent",
                                        background: isNext ? "rgba(103, 44, 188, 0.03)" : "transparent",
                                      }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 46 }}>
                                        <img
                                          src={prayer.icon}
                                          alt={prayer.name}
                                          style={{
                                            height: "36px",
                                            width: "36px",
                                          }}
                                        />
                                      </ListItemIcon>
                                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                        <Stack direction="column">
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography
                                              sx={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontWeight: "600",
                                                fontSize: "15px",
                                                color: "#240F4F",
                                              }}
                                            >
                                              {prayer.name}
                                            </Typography>
                                            {isNext && (
                                              <Box
                                                className="glowing-dot"
                                                sx={{
                                                  width: 10,
                                                  height: 10,
                                                }}
                                              />
                                            )}
                                          </Box>
                                          <Typography
                                            sx={{
                                              fontFamily: "Inter, sans-serif",
                                              fontWeight: "500",
                                              fontSize: "11px",
                                              textTransform: "uppercase",
                                              color: "#8789A3",
                                            }}
                                          >
                                            Time : {prayer.time}
                                          </Typography>
                                        </Stack>
                                        <Typography
                                          sx={{
                                            fontStyle: "normal",
                                            fontWeight: "700",
                                            fontSize: "18px",
                                            color: "#863ED5",
                                            fontFamily: "Poppins, sans-serif",
                                          }}
                                        >
                                          {prayer.arabic}
                                        </Typography>
                                      </Box>
                                    </ListItem>
                                  </React.Fragment>
                                );
                              })}
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Other Namaz */}
                      <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                        <Card
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            bgcolor: "#ffffff",
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            borderRadius: "12px",
                            boxShadow: "0 15px 20px -15px rgba(103, 44, 188, 0.06)",
                            p: 3,
                            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                            "&:hover, &:active": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 20px 25px -15px rgba(103, 44, 188, 0.12)",
                            }
                          }}
                        >
                          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                            <Typography
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: "700",
                                fontSize: "16px",
                                color: "#672CBC",
                                mb: 1,
                              }}
                            >
                              Other Namaz
                            </Typography>
                            <Divider sx={{ borderColor: "rgba(103, 44, 188, 0.15)", mb: 2 }} />
                            <List disablePadding>
                              {[
                                { name: "Zuma", time: "1:00 PM", arabic: "زوما", icon: one },
                                { name: "Eid Ul Fitr", time: "8:30 AM", arabic: "عيد أل فطر", icon: two },
                                { name: "Eid ul zuha", time: "8:30 AM", arabic: "عيد أل زها", icon: three },
                              ].map((prayer, index) => {
                                return (
                                  <React.Fragment key={prayer.name}>
                                    {index > 0 && <Divider sx={{ borderColor: "rgba(0,0,0,0.05)", my: 0.8 }} />}
                                    <ListItem
                                      disablePadding
                                      sx={{
                                        py: 1,
                                        px: 1.5,
                                        borderRadius: "8px",
                                        transition: "all 0.2s ease",
                                        border: "1px solid transparent",
                                      }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 46 }}>
                                        <img
                                          src={prayer.icon}
                                          alt={prayer.name}
                                          style={{
                                            height: "36px",
                                            width: "36px",
                                          }}
                                        />
                                      </ListItemIcon>
                                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                        <Stack direction="column">
                                          <Typography
                                            sx={{
                                              fontFamily: "Poppins, sans-serif",
                                              fontWeight: "600",
                                              fontSize: "15px",
                                              color: "#240F4F",
                                            }}
                                          >
                                            {prayer.name}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontFamily: "Inter, sans-serif",
                                              fontWeight: "500",
                                              fontSize: "11px",
                                              textTransform: "uppercase",
                                              color: "#8789A3",
                                            }}
                                          >
                                            Time : {prayer.time}
                                          </Typography>
                                        </Stack>
                                        <Typography
                                          sx={{
                                            fontStyle: "normal",
                                            fontWeight: "700",
                                            fontSize: "18px",
                                            color: "#863ED5",
                                            fontFamily: "Poppins, sans-serif",
                                          }}
                                        >
                                          {prayer.arabic}
                                        </Typography>
                                      </Box>
                                    </ListItem>
                                  </React.Fragment>
                                );
                              })}
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Hadith Card (Left Column) */}
                  <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                    <Card
                      sx={{
                        bgcolor: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: "12px",
                        boxShadow: "0 15px 20px -15px rgba(103, 44, 188, 0.06)",
                        position: "relative",
                        overflow: "hidden",
                        p: 3,
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "260px",
                        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        "&:hover, &:active": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 25px -15px rgba(103, 44, 188, 0.12)",
                        }
                      }}
                    >
                      {/* Accent left border strip */}
                      <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: "#672CBC" }} />
                      
                      {/* Top Row: Label & Icon */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontFamily: "Inter, Poppins, sans-serif",
                            fontSize: "12px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            color: "#8789A3",
                          }}
                        >
                          Hadith of the Day
                        </Typography>
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
                          <MenuBookRoundedIcon sx={{ color: "#672CBC", fontSize: "20px" }} />
                        </Box>
                      </Box>

                      {/* Hadith Content (Middle and Bottom) */}
                      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, gap: 2 }}>
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: { xs: "20px", sm: "23px" },
                            fontWeight: "700",
                            color: "#240F4F",
                            lineHeight: 1.4,
                            textAlign: "center"
                          }}
                        >
                          «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ»
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Inter, Poppins, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            fontStyle: "italic",
                            fontWeight: "500",
                            color: "#495057",
                            lineHeight: 1.6,
                            textAlign: "center",
                            px: 1
                          }}
                        >
                          "Actions are judged by their intentions, and every person will get what they intended."
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2, textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontFamily: "Inter, Poppins, sans-serif",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#8789A3",
                          }}
                        >
                          — Sahih al-Bukhari 1
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>

                  {/* Charity Progress & Spent Card (Right Column) */}
                  <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                    <Card
                      sx={{
                        bgcolor: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: "12px",
                        boxShadow: "0 15px 20px -15px rgba(103, 44, 188, 0.06)",
                        position: "relative",
                        overflow: "hidden",
                        p: 3,
                        height: "100%",
                        width: "100%",
                        minHeight: "260px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                        "&:hover, &:active": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 25px -15px rgba(103, 44, 188, 0.12)",
                        }
                      }}
                    >
                      {/* Accent left border strip */}
                      <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: 4, bgcolor: "#672CBC" }} />
                      
                      <Box>
                        {/* Top Row: Label & Icon */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                          <Typography
                            sx={{
                              fontFamily: "Inter, Poppins, sans-serif",
                              fontSize: "12px",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "1.5px",
                              color: "#8789A3",
                            }}
                          >
                            Financial Transparency
                          </Typography>
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
                            <AccountBalanceWalletIcon sx={{ color: "#672CBC", fontSize: "20px" }} />
                          </Box>
                        </Box>

                        {/* Circular indicators with status logic */}
                        {(() => {
                          const getFundStatus = (percent) => {
                            if (percent < 70) {
                              return { color: "#0CA678", label: "HEALTHY" };
                            } else if (percent <= 95) {
                              return { color: "#FD7E14", label: "LOW" };
                            } else {
                              return { color: "#E03131", label: "DEFICIT" };
                            }
                          };

                          const mosqueStatus = getFundStatus(mosquePercent);
                          const imamStatus = getFundStatus(imamPercent);

                          return (
                            <Grid container spacing={2}>
                              {/* Mosque Fund */}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ borderRight: { sm: "1px solid rgba(0, 0, 0, 0.08)" }, pr: { sm: 1.5 }, pb: { xs: 2, sm: 0 } }}>
                                  <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                                    Mosque Fund
                                  </Typography>
                                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                    <CircularProgressWithLabel 
                                      value={mosquePercent} 
                                      colorCode={mosqueStatus.color} 
                                      statusText={mosqueStatus.label} 
                                    />
                                    <Box sx={{ 
                                      display: "flex", 
                                      flexDirection: { xs: "row", sm: "column" }, 
                                      justifyContent: { xs: "space-between", sm: "flex-start" },
                                      alignItems: { xs: "center", sm: "flex-start" },
                                      gap: { xs: 1.5, sm: 0.4 }, 
                                      flex: 1,
                                      flexWrap: "wrap",
                                      pl: { xs: 1, sm: 0 }
                                    }}>
                                      <Box>
                                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                          Collected
                                        </Typography>
                                        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: "#240F4F" }}>
                                          ₹{totalMosqueReceived.toLocaleString()}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                          Spent
                                        </Typography>
                                        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: mosqueStatus.color }}>
                                          ₹{MOSQUE_SPENT.toLocaleString()}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                          Balance
                                        </Typography>
                                        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: "#0CA678" }}>
                                          ₹{(totalMosqueReceived - MOSQUE_SPENT).toLocaleString()}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Imam & Staff Fund */}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ pl: { sm: 1.5 } }}>
                                  <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                                    Imam & Staff Fund
                                  </Typography>
                                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                    <CircularProgressWithLabel 
                                      value={imamPercent} 
                                      colorCode={imamStatus.color} 
                                      statusText={imamStatus.label} 
                                    />
                                    <Box sx={{ 
                                      display: "flex", 
                                      flexDirection: { xs: "row", sm: "column" }, 
                                      justifyContent: { xs: "space-between", sm: "flex-start" },
                                      alignItems: { xs: "center", sm: "flex-start" },
                                      gap: { xs: 1.5, sm: 0.4 }, 
                                      flex: 1,
                                      flexWrap: "wrap",
                                      pl: { xs: 1, sm: 0 }
                                    }}>
                                      <Box>
                                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                          Collected
                                        </Typography>
                                        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: "#240F4F" }}>
                                          ₹{totalImamReceived.toLocaleString()}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                          Spent
                                        </Typography>
                                        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: imamStatus.color }}>
                                          ₹{IMAM_SPENT.toLocaleString()}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                          Balance
                                        </Typography>
                                        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: "#0CA678" }}>
                                          ₹{(totalImamReceived - IMAM_SPENT).toLocaleString()}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          );
                        })()}
                      </Box>

                      <Button
                        onClick={() => setDetailsOpen(true)}
                        variant="contained"
                        fullWidth
                        sx={{
                          background: "linear-gradient(135deg, #863ED5 0%, #672CBC 100%)",
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: "600",
                          textTransform: "none",
                          fontSize: "13px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 10px rgba(103, 44, 188, 0.15)",
                          py: 1,
                          mt: 3,
                          "&:hover": {
                            background: "linear-gradient(135deg, #672CBC 0%, #240F4F 100%)",
                            boxShadow: "0 6px 15px rgba(103, 44, 188, 0.25)",
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
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
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
              {/* Summary Breakdown */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(103, 44, 188, 0.04)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(103, 44, 188, 0.1)" 
                }}
              >
                <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                  Summary Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Collected</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mt: 0.5 }}>
                      ₹{activeMosqueCollected.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Spent</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#E03131", mt: 0.5 }}>
                      ₹{activeMosqueSpent.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Balance</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: activeMosqueBalance >= 0 ? "#0CA678" : "#E03131", mt: 0.5 }}>
                      ₹{activeMosqueBalance.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Fund Information */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(0, 0, 0, 0.02)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(0, 0, 0, 0.05)" 
                }}
              >
                <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                  Fund Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fund Created</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      01 Jan 2026
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Donors</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      {displayedMosqueDonors}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ mt: 1 }}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Last Donation</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      22 Jun 2026
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ mt: 1 }}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Last Updated</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      {lastUpdatedStr}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Transactions */}
              <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                Recent Transactions
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", mb: 2.5 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "rgba(103, 44, 188, 0.03)" }}>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Date</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Description</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Type</TableCell>
                      <TableCell align="right" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getTransactionsList("mosque").slice(0, 5).map((row, idx) => {
                      const isCredit = row.type === "Credit";
                      return (
                        <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#8789A3", fontWeight: "500" }}>{row.date}</TableCell>
                          <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "500", color: "#240F4F" }}>{row.description}</TableCell>
                          <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: "600", color: isCredit ? "#0CA678" : "#E03131" }}>
                            {row.type}
                          </TableCell>
                          <TableCell align="right" sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: isCredit ? "#0CA678" : "#E03131" }}>
                            {isCredit ? "+" : "-"}₹{row.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Fund Status Card */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(12, 166, 120, 0.05)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(12, 166, 120, 0.15)" 
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <Box sx={{ fontSize: "16px" }}>🟢</Box>
                  <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "700", color: "#0CA678" }}>
                    Fund Status: Healthy
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase" }}>Target Balance</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "700", color: "#240F4F", mt: 0.2 }}>₹10,000</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase" }}>Current Balance</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "700", color: "#0CA678", mt: 0.2 }}>
                      ₹{activeMosqueBalance.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Recent Donors */}
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1 }}>
                  Recent Donations
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {getRecentDonors("mosque").map((donor, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5, borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                      <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "#240F4F", fontWeight: "500" }}>
                        {donor.name}
                      </Typography>
                      <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "#0CA678", fontWeight: "700" }}>
                        ₹{donor.amount.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Summary Breakdown */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(103, 44, 188, 0.04)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(103, 44, 188, 0.1)" 
                }}
              >
                <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                  Summary Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Collected</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mt: 0.5 }}>
                      ₹{activeImamCollected.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Spent</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#E03131", mt: 0.5 }}>
                      ₹{activeImamSpent.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Balance</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: activeImamBalance >= 0 ? "#0CA678" : "#E03131", mt: 0.5 }}>
                      ₹{activeImamBalance.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Fund Information */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(0, 0, 0, 0.02)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(0, 0, 0, 0.05)" 
                }}
              >
                <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                  Fund Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fund Created</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      01 Jan 2026
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Donors</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      {displayedImamDonors}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ mt: 1 }}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Last Donation</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      22 Jun 2026
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ mt: 1 }}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Last Updated</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "600", color: "#240F4F", mt: 0.2 }}>
                      {lastUpdatedStr}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Transactions */}
              <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1.5 }}>
                Recent Transactions
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", mb: 2.5 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "rgba(103, 44, 188, 0.03)" }}>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Date</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Description</TableCell>
                      <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Type</TableCell>
                      <TableCell align="right" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700", fontSize: "11px", color: "#672CBC" }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getTransactionsList("imam").slice(0, 5).map((row, idx) => {
                      const isCredit = row.type === "Credit";
                      return (
                        <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#8789A3", fontWeight: "500" }}>{row.date}</TableCell>
                          <TableCell sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "500", color: "#240F4F" }}>{row.description}</TableCell>
                          <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: "600", color: isCredit ? "#0CA678" : "#E03131" }}>
                            {row.type}
                          </TableCell>
                          <TableCell align="right" sx={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "700", color: isCredit ? "#0CA678" : "#E03131" }}>
                            {isCredit ? "+" : "-"}₹{row.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Fund Status Card */}
              <Box 
                sx={{ 
                  mb: 2.5, 
                  p: 2, 
                  backgroundColor: "rgba(224, 49, 49, 0.05)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(224, 49, 49, 0.15)" 
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <Box sx={{ fontSize: "16px" }}>🔴</Box>
                  <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "700", color: "#E03131" }}>
                    Fund Status: Deficit
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#8789A3", fontWeight: "600", textTransform: "uppercase" }}>Shortfall</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: "700", color: "#E03131", mt: 0.2 }}>
                      ₹{(activeImamSpent - activeImamCollected).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Recent Donors */}
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: "700", color: "#240F4F", mb: 1 }}>
                  Recent Donations
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {getRecentDonors("imam").map((donor, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5, borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                      <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "#240F4F", fontWeight: "500" }}>
                        {donor.name}
                      </Typography>
                      <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", color: "#0CA678", fontWeight: "700" }}>
                        ₹{donor.amount.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
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
