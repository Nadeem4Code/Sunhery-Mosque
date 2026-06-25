import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

// Icons
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Loader

import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

// Firebase
import { getAllTasks } from "../../config/firebase";

function ShowUserPublic() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Simulate a loading delay with setTimeout
    setTimeout(() => {
      getAllTasks()
        .then((tasks) => {
          setBooks(tasks);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setLoading(false);
        });
    }, 0.5);
  }, []);

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 6 }}>
      {loading ? (
        <Box sx={{ p: 0 }}>
          {/* Glassmorphic Search Bar Skeleton */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "480px",
              height: "45px",
              borderRadius: "16px",
              padding: "6px 16px",
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(103, 44, 188, 0.15)",
              boxShadow: "0 8px 32px rgba(36, 15, 79, 0.03)",
              mx: "auto",
              mt: 1,
              mb: 4,
              boxSizing: "border-box"
            }}
          >
            <Skeleton variant="circular" width={22} height={22} sx={{ mr: 1.5, flexShrink: 0 }} />
            <Skeleton variant="text" width="50%" height={24} />
          </Box>
          <Card sx={{ borderRadius: "20px", boxShadow: "0 8px 32px rgba(36, 15, 79, 0.04)", border: "1px solid rgba(36, 15, 79, 0.06)" }}>
            <CardContent>
              <Skeleton variant="text" width="10%" height={24} sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid key={item} item xs={12} md={6} sm={12}>
                    <Box sx={{ width: "100%", display: "flex", alignItems: "center", py: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mr: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0, pr: 1.5 }}>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                      <Skeleton variant="text" width="75px" height={20} sx={{ mr: { xs: 1, sm: 5 }, flexShrink: 0 }} />
                      <Skeleton variant="circular" width={24} height={24} sx={{ flexShrink: 0 }} />
                    </Box>
                    <Divider style={{ width: "100%" }} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box sx={{ p: 0 }}>
          {/* Transparent Glassmorphic Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "480px",
              height: "45px",
              borderRadius: "16px",
              padding: "6px 16px",
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(103, 44, 188, 0.15)",
              boxShadow: "0 8px 32px rgba(36, 15, 79, 0.03)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              mx: "auto",
              mt: 1,
              mb: 4,
              boxSizing: "border-box",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.65)",
                borderColor: "rgba(103, 44, 188, 0.3)",
                boxShadow: "0 12px 32px rgba(103, 44, 188, 0.08)",
              },
              "&:focus-within": {
                background: "#ffffff",
                borderColor: "#672CBC",
                boxShadow: "0 12px 36px rgba(103, 44, 188, 0.14)",
                transform: "translateY(-1px)",
              }
            }}
          >
            <SearchRoundedIcon
              sx={{
                color: query ? "#672CBC" : "#8789A3",
                mr: 1.5,
                fontSize: "22px",
                transition: "color 0.2s ease"
              }}
            />
            <input
              type="text"
              value={query}
              onChange={handleQuery}
              placeholder="Search donors by name or phone..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#240F4F",
              }}
            />
            {query && (
              <IconButton
                onClick={() => setQuery("")}
                size="small"
                sx={{
                  p: 0.5,
                  color: "#8789A3",
                  transition: "all 0.2s",
                  "&:hover": {
                    color: "#ff5252",
                    bgcolor: "rgba(255, 82, 82, 0.05)"
                  }
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Card sx={{ borderRadius: "20px", boxShadow: "0 8px 32px rgba(36, 15, 79, 0.04)", border: "1px solid rgba(36, 15, 79, 0.06)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Typography
                style={{
                  color: "grey",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Donors
              </Typography>

              <Grid container spacing={2}>
                {books
                  .filter((post) => {
                    if (query === "") {
                      return true;
                    } else if (
                      post.userName.toLowerCase().includes(query.toLowerCase())
                    ) {
                      return true;
                    } else if (
                      (post.fatherName || "")
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    ) {
                      return true;
                    } else if (
                      post.phoneNumber
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    ) {
                      return true;
                    }
                    return false;
                  })
                  .map((book) => (
                    <Grid key={book.id} item xs={12} md={6} sm={12}>
                      <Box sx={{ width: "100%" }}>
                        <nav aria-label="main mailbox folders">
                          <List>
                            <ListItem disablePadding>
                              <ListItemIcon sx={{ minWidth: { xs: "48px", sm: "56px" } }}>
                                <Avatar
                                  variant="rounded"
                                  style={{
                                    color: "white",
                                    fontFamily: "Poppins",
                                    fontWeight: "600",
                                  }}
                                  sx={{
                                    background: `linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)`,
                                  }}
                                >
                                  {book.userName.slice(0, 1).toUpperCase()}
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText sx={{ minWidth: 0, pr: 1.5 }}>
                                <Typography
                                  sx={{
                                    fontSize: { xs: "13px", sm: "16px", md: "18px" },
                                    fontFamily: "Poppins",
                                    fontWeight: "600",
                                    whiteSpace: "nowrap",
                                    overflow: "visible",
                                    color: "#240F4F"
                                  }}
                                >
                                  {book.userName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: { xs: "11px", sm: "12.5px", md: "14px" },
                                    fontFamily: "Poppins",
                                    fontWeight: "500",
                                    color: "#8789A3",
                                    whiteSpace: "nowrap",
                                    overflow: "visible"
                                  }}
                                >
                                  {book.fatherName}
                                </Typography>
                              </ListItemText>
                              <Typography
                                sx={{
                                  color: "#8789A3",
                                  fontSize: { xs: "12.5px", sm: "14px" },
                                  fontWeight: "500",
                                  pr: { xs: "8px", sm: "40px" },
                                  fontFamily: "Poppins",
                                  whiteSpace: "nowrap",
                                  flexShrink: 0
                                }}
                              >
                                {book.phoneNumber}
                              </Typography>
                              <NavLink
                                to={`/user/${book.id}`}
                                style={({ isActive }) => ({
                                  textDecoration: "none",
                                })}
                              >
                                <ArrowForwardIosIcon
                                  style={{ color: "#8789A3" }}
                                />
                              </NavLink>
                            </ListItem>
                          </List>
                        </nav>
                        <Divider style={{ width: "100%" }} />
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}

export default ShowUserPublic;
