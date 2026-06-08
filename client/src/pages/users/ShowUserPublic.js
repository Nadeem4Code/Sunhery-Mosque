import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
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




// Search
import SearchSecond from '../../assets/icons/searchSecond.svg'

// Loader

import CircularProgress from "@mui/material/CircularProgress";

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
        <Card style={{ marginTop: "100px", boxShadow: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "220px",
                borderRadius: "5px",
                paddingRight: "5px",
                padding: "3px",
                boxShadow:
                  "0 5px 5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span
                style={{
                  padding: "5px",
                  marginTop: "5px",
                  borderRadius: "0 10px 10px 0",
                  cursor: "pointer",
                  paddingLeft: "20px",
                }}
              >
                <img src={SearchSecond} alt="search" />
              </span>
              <input
                type="text"
                value={query}
                onChange={handleQuery}
                style={{
                  padding: "5px",
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  width: "90px",
                }}
                placeholder="Search..."
              />
            </div>
          </div>
          <Card>
            <CardContent>
              <Typography
                style={{
                  color: "grey",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Users
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
                      post.fatherName
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
                              <ListItemIcon>
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
                              <ListItemText>
                                <Typography
                                  style={{
                                    fontSize: "18px",
                                    fontFamily: "Poppins",
                                    fontWeight: "600",
                                  }}
                                >
                                  {book.userName}
                                </Typography>
                                <Typography
                                  style={{
                                    fontSize: "14px",
                                    fontFamily: "Poppins",
                                    fontWeight: "500",
                                    color: "#8789A3",
                                  }}
                                >
                                  {book.fatherName}
                                </Typography>
                              </ListItemText>
                              <Typography
                                style={{
                                  color: "#8789A3",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  paddingRight: "40px",
                                  fontFamily: "Poppins",
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
        </Card>
      )}
    </>
  );
}

export default ShowUserPublic;
