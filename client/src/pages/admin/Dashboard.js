import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Avatar, CircularProgress } from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import axios from "axios";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

// Components
import AmountSpendUsers from "../../components/admin/AmountSpendUsers";
import AddUser from "./AddUser";

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [checkingRole, setCheckingRole] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:3001/books/uid/${user.uid}`)
      .then((res) => {
        if (res.data.role !== "admin") {
          navigate(`/user/${res.data.id}`);
        } else {
          setCheckingRole(false);
        }
      })
      .catch((err) => {
        console.error("Dashboard auth check failed:", err);
        navigate("/login");
      });
  }, [user, loading, navigate]);

  if (loading || checkingRole) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress color="secondary" />
      </div>
    );
  }

 
  
  return (
    <>
      <Grid
        container
        spacing={2}
        style={{
          marginTop: "100px",
          paddingLeft: "5%",
          paddingRight: "5%",
        }}
      >
        <AmountSpendUsers />

        <Grid item xs={6} md={6} sm={6}>
          <Card style={{ background: "#f3f2f2" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center", // Center vertically
                  flexDirection: "column", // Stack items vertically
                }}
              >
                <AddUser />
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontWeight: "600",

                    marginTop: "8px",
                  }}
                >
                  Add User
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={6} sm={6}>
          <Card style={{ background: "#f3f2f2" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <NavLink
                  to="/showUserForMosqueAdmin"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Avatar
                    style={{
                      width: "45px",
                      height: "45px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: `linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)`,
                    }}
                  >
                    <PeopleAltRoundedIcon
                      style={{
                        height: "30px",
                        width: "30px",
                        color: "white",
                        cursor: "pointer",
                      }}
                    />
                  </Avatar>
                </NavLink>
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontWeight: "600",

                    marginTop: "8px",
                  }}
                >
                  Mosque Users
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={6} sm={6}>
          <Card style={{ background: "#f3f2f2" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <NavLink
                  to="/showUserForImamAdmin"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Avatar
                    style={{
                      width: "45px",
                      height: "45px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: `linear-gradient(135deg, #2EB62C 0%, #ABE098 100%)`,
                    }}
                  >
                    <PeopleAltRoundedIcon
                      style={{
                        height: "30px",
                        width: "30px",

                        cursor: "pointer",
                      }}
                    />
                  </Avatar>
                </NavLink>
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontWeight: "600",

                    marginTop: "8px",
                  }}
                >
                  Imam Users
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Delete edit users */}
        <Grid item xs={6} md={6} sm={6}>
          <Card style={{ background: "#f3f2f2" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center", // Center vertically
                  flexDirection: "column", // Stack items vertically
                }}
              >
                <NavLink
                  to="/showUser"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Avatar
                    style={{
                      width: "45px",
                      height: "45px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: `linear-gradient(135deg, gray 0%, black 100%)`,
                    }}
                  >
                    <DeleteRoundedIcon
                      style={{
                        height: "30px",
                        width: "30px",
                        color: "white",
                        cursor: "pointer",
                      }}
                    />
                  </Avatar>
                </NavLink>
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontWeight: "600",

                    marginTop: "8px",
                  }}
                >
                  Delete
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
