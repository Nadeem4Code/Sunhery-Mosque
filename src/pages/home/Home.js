import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

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

const Home = () => {
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
                                top: 50,
                                left: 20,
                                fontStyle: "normal",
                                fontWeight: "400",
                                fontSize: "13px",
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
                                top: 125,
                                left: 20,
                                fontStyle: "normal",
                                fontWeight: "600",
                                fontSize: "16px",
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
                                height: "30px",
                                width: "130px",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              height: "170px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                          >
                            <QuranIcon />
                          </div>
                        </Card>
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
