import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

import { getAllTasks } from "../../config/firebase";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WalletIcon from "@mui/icons-material/Wallet";

import Divider from "@mui/material/Divider";
const AmountSpendUsers = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    // Simulate a loading delay with setTimeout
    setTimeout(() => {
      getAllTasks()
        .then((tasks) => {
          setBooks(tasks);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    }, 0.5);
  }, [books]);
  const totalUsers = books.length;
  return (
    <>
      {/* Total Users Amount Investment */}
      <Divider
        style={{
          width: "100%",

          marginLeft: "1.7%",
          border: "1px solid rgba(187, 196, 206, 0.35)",
          marginBottom: "15px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Grid item xs={4} md={4} sm={4}>
          <Card style={{ boxShadow: "none" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Center vertically
              }}
            >
              <Avatar
                style={{
                  width: "45px",
                  height: "45px",
                  background: "rgba(187, 196, 206, 0.35)",
                }}
              >
                <PeopleOutlineIcon
                  style={{ width: "30px", height: "30px", color: "black" }}
                />
              </Avatar>
              <div>
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingLeft: "5px",
                    fontSize: "14px",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: "#8789A3",
                  }}
                >
                  Users
                </Typography>
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",

                    fontSize: "14px",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: " #672CBC",
                    paddingLeft: "5px",
                    marginTop: "10px",
                  }}
                >
                  {totalUsers}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          style={{ border: "1px solid rgba(187, 196, 206, 0.35)" }}
        />
        <Grid item xs={4} md={4} sm={4}>
          <Card style={{ boxShadow: "none" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Center vertically
              }}
            >
              <Avatar
                style={{
                  width: "45px",
                  height: "45px",
                  background: "rgba(187, 196, 206, 0.35)",
                }}
              >
                <WalletIcon
                  style={{ width: "30px", height: "30px", color: "black" }}
                />
              </Avatar>
              <div>
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingLeft: "5px",
                    fontSize: "14px",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: "#8789A3",
                  }}
                >
                  Amount
                </Typography>
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",

                    fontSize: "14px",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: "green",
                    paddingLeft: "5px",
                    marginTop: "10px",
                  }}
                >
                  100+
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          style={{ border: "1px solid rgba(187, 196, 206, 0.35)" }}
        />
        <Grid item xs={4} md={4} sm={4}>
          <Card style={{ boxShadow: "none" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Center vertically
              }}
            >
              <Avatar
                style={{
                  width: "45px",
                  height: "45px",
                  background: "rgba(187, 196, 206, 0.35)",
                }}
              >
                <CurrencyRupeeIcon
                  style={{ width: "30px", height: "30px", color: "black" }}
                />
              </Avatar>
              <div>
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingLeft: "5px",
                    fontSize: "14px",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: "#8789A3",
                  }}
                >
                  Spend
                </Typography>
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingLeft: "5px",
                    fontSize: "14px",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: "red",
                    marginTop: "10px",
                  }}
                >
                  100-
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Box>
      <Divider
        style={{
          width: "100%",
          marginTop: "15px",
          marginLeft: "1.7%",
          border: "1px solid rgba(187, 196, 206, 0.35)",
        }}
      />
    </>
  );
};

export default AmountSpendUsers;
